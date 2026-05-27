# Security toolchain

Two complementary layers for this workspace:

| Layer | Tool | What it catches |
|-------|------|-----------------|
| **Prevention (runtime)** | [OneCLI](https://github.com/onecli/onecli) | Real keys in `mcp.json`, chat, or files the agent reads |
| **Detection (git)** | [gitleaks](https://github.com/gitleaks/gitleaks) | Secrets committed to git (working tree + history) |

Philosophy: [`PHILOSOPHY.md`](../../PHILOSOPHY.md) (Credential security).

---

## 1. Gitleaks (secret scan)

### Recommended: pre-commit hook (catches secrets before they ever reach GitHub)

```bash
./scripts/install-git-hooks.sh
```

This points `core.hooksPath` at `.githooks/` — the pre-commit hook runs `scripts/secret-scan.sh` on every `git commit`. Skip for a single commit with `git commit --no-verify`.

### One-off scan

```bash
./scripts/secret-scan.sh
```

### CI (backstop)

[`.github/workflows/secret-scan.yml`](../../.github/workflows/secret-scan.yml) runs on push/PR as a secondary safety net — catches anything that slips past a missing or bypassed hook.

Config: [`.gitleaks.toml`](../../.gitleaks.toml) (extends default rules; allowlists seed templates and `<<EDIT>>` placeholders).

### Before making a fork public

```bash
./scripts/secret-scan.sh
# Also confirm .env and .cursor/mcp.json are not tracked:
git ls-files | grep -E '\.env$|mcp\.json$' || echo "OK: no env/mcp.json tracked"
```

---

## 2. OneCLI (credential gateway)

OneCLI is **not vendored in this repo** — you run it locally (or on a trusted host). Dashboard `http://localhost:10254`, HTTP gateway `http://localhost:10255`.

### Install

```bash
curl -fsSL https://onecli.sh/install | sh
# or: git clone https://github.com/onecli/onecli.git && cd onecli && docker compose -f docker/docker-compose.yml up -d --wait
```

See [onecli/onecli README](https://github.com/onecli/onecli) for dev setup and team OAuth.

### Workspace wiring

1. Open the dashboard → create an **agent** (e.g. `cursor-seed`) with a scoped access token. Paste that token into `.cursor/mcp.json` as `ONECLI_AGENT_ACCESS_TOKEN` (gitignored).
2. Add **secrets** matched by host (and path if needed). Use a **placeholder value** the agent sends (e.g. secret named `Fathom` → placeholder `Fathom` in `FATHOM_API_KEY` / `X-Api-Key`). Examples for this seed:

| Service | Host | Injection | Used by |
|---------|------|-----------|---------|
| Fathom extract | `api.fathom.ai` | Header `X-Api-Key` — **`valueFormat`: `{value}`** (not `Bearer {value}`) | `npm run extract` in transcript-vault (via OneCLI proxy) |
| HubSpot MCP | `api.hubapi.com` | Header `Authorization: Bearer …` | HubSpot MCP in `.cursor/mcp.json` |
| Fireflies | `api.fireflies.ai` | (per their API) | transcript-vault adapter |

3. In **`.cursor/mcp.json`** (gitignored): use **placeholders** only — never the real key. Route MCP HTTP clients through the gateway where the client supports `HTTP_PROXY` / proxy env (see OneCLI docs).

4. **Transcript-vault extract** (does not use MCP at runtime):
   - **Simple:** keep `FATHOM_API_KEY` in gitignored `infra/transcript-vault-mcp/.env` or `FathomMCP/.env`; only you run `npm run extract` / systemd sync.
   - **Stricter:** store the real key in OneCLI; put a placeholder in `.env`; run extract with proxy, e.g.  
     `HTTP_PROXY=http://127.0.0.1:10255 HTTPS_PROXY=http://127.0.0.1:10255 npm run extract`  
     (OneCLI swaps placeholder → real key on outbound requests to `api.fathom.ai`.)

5. **`@transcript-vault` MCP tools** need **no** Fathom key — they read the local index only (`VAULT_DATA_ROOT`).

Record your choice in [`Setup-Decisions.md`](../../Setup-Decisions.md) (API credential gateway row).

### Health check

```bash
curl -sf http://localhost:10254 >/dev/null && echo "OneCLI dashboard up" || echo "OneCLI not running"
```

---

## What stays gitignored

| File | Why |
|------|-----|
| `.env`, `infra/transcript-vault-mcp/.env` | Adapter API keys |
| `.cursor/mcp.json` | MCP env the agent can read |
| `vault/data/` | Raw transcripts and embeddings |

Gitleaks does **not** replace gitignore — it catches mistakes after the fact.
