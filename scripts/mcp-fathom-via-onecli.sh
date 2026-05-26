#!/usr/bin/env bash
# Fathom cloud MCP via mcp-remote + OneCLI gateway.
# Requires: ONECLI_AGENT_ACCESS_TOKEN, OneCLI on :10255, secret "Fathom" in vault.
set -euo pipefail

GATEWAY="${ONECLI_GATEWAY:-http://127.0.0.1:10255}"
TOKEN="${ONECLI_AGENT_ACCESS_TOKEN:-}"

if [ -z "$TOKEN" ]; then
  echo "mcp-fathom-via-onecli: set ONECLI_AGENT_ACCESS_TOKEN in .cursor/mcp.json" >&2
  exit 1
fi

export HTTP_PROXY="$GATEWAY"
export HTTPS_PROXY="$GATEWAY"
export NO_PROXY="${NO_PROXY:-localhost,127.0.0.1}"
export FATHOM_API_KEY="${FATHOM_API_KEY:-Fathom}"
export X_Api_Key="${X-Api-Key:-$FATHOM_API_KEY}"

# Node/fetch proxy auth for OneCLI agent token
export HTTP_PROXY_AUTH="Bearer ${TOKEN}"
export HTTPS_PROXY_AUTH="Bearer ${TOKEN}"

exec npx -y mcp-remote@latest "https://api.fathom.ai/mcp" --enable-proxy "$@"
