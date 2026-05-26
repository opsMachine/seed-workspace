#!/usr/bin/env bash
# Point this repo's git hooks at .githooks/ (pre-commit runs gitleaks).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

chmod +x "$ROOT/scripts/secret-scan.sh" "$ROOT/.githooks/pre-commit"
git config core.hooksPath .githooks

echo "Installed git hooks from .githooks/ (pre-commit → scripts/secret-scan.sh)"
echo "Requires gitleaks on PATH. Skip with: git commit --no-verify"
