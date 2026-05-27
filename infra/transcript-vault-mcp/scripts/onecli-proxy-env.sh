#!/usr/bin/env bash
# Optional: route transcript-vault extract through an OneCLI credential gateway.
# https://github.com/onecli/onecli
#
# Source this script to set proxy env vars so Node routes HTTPS through OneCLI,
# which injects the real recorder API key from its encrypted vault at request time.
# The key never touches disk outside the vault.
#
# Prerequisites:
#   1. OneCLI running: docker compose -p onecli -f ~/.onecli/docker-compose.yml up -d
#   2. CA cert extracted once:
#        docker cp onecli:/app/data/gateway/ca.pem ~/.onecli/gateway-ca.pem
#   3. Secret in OneCLI dashboard (e.g. for Fathom):
#        Host: api.fathom.ai | Header: X-Api-Key | Format: {value} | Value: <real key>
#   4. ONECLI_AGENT_ACCESS_TOKEN and ONECLI_AOC_TOKEN set in .env (see .env.example)
#
# Usage: source scripts/onecli-proxy-env.sh  (then run tsx src/extract.ts)
#
# Cross-platform note: this script is bash/Linux/macOS only. On Windows, set the
# same env vars (HTTPS_PROXY, NODE_EXTRA_CA_CERTS, NODE_USE_ENV_PROXY) in your
# shell profile or .env and call tsx directly.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ -f "$REPO_ROOT/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_ROOT/.env"
  set +a
fi

GATEWAY="${ONECLI_GATEWAY:-http://127.0.0.1:10255}"
# Use aoc_ (agent) token for proxy URL; fall back to oc_ management token
AOC_TOKEN="${ONECLI_AOC_TOKEN:-${ONECLI_AGENT_ACCESS_TOKEN:-}}"

if [ -z "$AOC_TOKEN" ]; then
  echo "onecli-proxy-env: set ONECLI_AOC_TOKEN (or ONECLI_AGENT_ACCESS_TOKEN) in .env" >&2
  echo "  Get it from the OneCLI dashboard (http://127.0.0.1:10254) → Agents page" >&2
  exit 1
fi

PROXY_URL="http://x:${AOC_TOKEN}@${GATEWAY#http://}"
export HTTP_PROXY="$PROXY_URL"
export HTTPS_PROXY="$PROXY_URL"
export http_proxy="$PROXY_URL"
export https_proxy="$PROXY_URL"
export NO_PROXY="${NO_PROXY:-localhost,127.0.0.1}"
export NODE_USE_ENV_PROXY=1
export GIT_HTTP_PROXY_AUTHMETHOD=basic

# CA cert enables MITM mode so the gateway can inject headers into TLS traffic.
# Without it, the gateway falls back to plain tunnel and cannot modify requests.
ONECLI_CA="${ONECLI_CA:-$HOME/.onecli/gateway-ca.pem}"
if [ -f "$ONECLI_CA" ]; then
  export NODE_EXTRA_CA_CERTS="$ONECLI_CA"
  export ONECLI_CA
else
  echo "onecli-proxy-env: CA cert not found at $ONECLI_CA" >&2
  echo "  Fix: docker cp onecli:/app/data/gateway/ca.pem ~/.onecli/gateway-ca.pem" >&2
  exit 1
fi
