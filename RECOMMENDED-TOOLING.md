# Recommended Tooling

A short menu of things that pair well with the seed. **None are required.** Run [`gain-analysis`](.claude/skills/gain-analysis/SKILL.md) on each before installing.

If you're technical and your AI is sitting in your IDE, you don't need install instructions for any of this — just ask the AI. This page is a *menu of suggestions*, not a runbook.

## IDE plugins (per editor)

- **Excalidraw** — open `.excalidraw` files inline; useful if visual mapping is part of how you think. (`pomdtr.excalidraw-editor` for VS Code / Cursor.)
- **Mermaid preview** — renders the Mermaid diagrams in `WORKFLOWS.md` and similar docs.
- **YAML schema** + **markdownlint** — keeps `labels.yml`, `.skill-config.yml`, and the long-form markdown clean.

The seed is **infinitely extensible** by design — when you find another plugin or extension that meaningfully amplifies how you work, add it. There's no fixed shape.

## Security (credential gateway)

**Problem:** every MCP you enable wants an API key. If that key lives in `.cursor/mcp.json` or a file in the workspace, the AI agent can read it — in config search, grep, or a mistaken commit.

**Stance:** agents never see real secrets. Real keys live outside the workspace surface the agent searches.

**Recommended:** [**OneCLI**](https://github.com/onecli/onecli) — open-source credential gateway with a built-in encrypted vault ([onecli.sh](https://onecli.sh)). Store credentials once in OneCLI; give each agent a scoped access token and placeholder keys (e.g. `FAKE_KEY`). HTTP traffic routed through the OneCLI gateway (default `localhost:10255`) gets real auth injected at request time. The dashboard (`localhost:10254`) manages agents, secrets, and host/path matching.

Run gain-analysis before adding it — but for any multi-MCP workspace, the marginal gain over "keys in mcp.json" is large: one rotation surface, no secrets in git, no accidental paste into chat.

**Minimum bar without OneCLI:** keep all real keys in gitignored `.env` only; never put them in `mcp.json`; never commit `.env`; run the onboarding grep for `API_KEY=` before making a fork public. That is necessary but not sufficient when the agent routinely reads env-backed MCP config.

## MCPs

> Decide via [`discover-stack`](.claude/skills/discover-stack/SKILL.md) and [`gain-analysis`](.claude/skills/gain-analysis/SKILL.md) before adding anything to `.cursor/mcp.json`.

- **Calendar** (Google Calendar / Outlook) — read tools open, writes gated.
- **CRM** of choice (HubSpot / ClickUp / Notion / Linear / etc.) — same pattern.
- **Drive** — usually the symlink path beats the API path; see [`infra/drive-symlinks/README.md`](infra/drive-symlinks/README.md). Drive MCP is a fallback.
- **Time MCP** — small, free, fixes the "what's today" problem so timestamps are accurate.
- **transcript-vault** — local, ships with the seed under `infra/transcript-vault-mcp/`. Install only if recording frequency makes the corpus genuinely useful.

## Host-level helpers

- **Drive File Stream** (macOS / Windows) or **rclone mount** (Linux) — for the symlink-Drive-as-local pattern.
- **systemd / launchd / cron** — for nightly transcript syncs or any scheduled job you want.
- **gh** (GitHub CLI) — for spinning up new client repos as siblings.

## What this list deliberately doesn't include

- Per-OS install instructions for any of the above. Your AI handles those better than a stale doc would.
- Notion / Coda / Airtable / Obsidian recommendations. These are alternative philosophies. If you live in one of them already, port the seed's *patterns* (capture/integrate, evidence ledger, weekly cadence) into that tool rather than fight the seed's filesystem default.
- AI agents-of-agents frameworks. The seed's skills + your IDE's chat is enough for v1.

## The decision pattern

For each tool you're considering:

1. What missing ability would I be addressing? (concrete query / workflow)
2. What does my current stack do for this?
3. What's the marginal gain? (speed / depth / composability / privacy / resilience)
4. What's the maintenance cost?
5. Decision: install / skip / revisit-later.

Default lean: **skip**. A workspace with 3 well-chosen MCPs and a sticky weekly review beats one with 12 half-configured MCPs every time.
