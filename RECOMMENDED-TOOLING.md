# Recommended Tooling

A short menu of things that pair well with the seed. **None are required.** Run [`gain-analysis`](.claude/skills/gain-analysis/SKILL.md) on each before installing.

If you're technical and your AI is sitting in your IDE, you don't need install instructions for any of this — just ask the AI. This page is a *menu of suggestions*, not a runbook.

## IDE plugins (per editor)

- **Excalidraw** — open `.excalidraw` files inline; useful if visual mapping is part of how you think. (`pomdtr.excalidraw-editor` for VS Code / Cursor.)
- **Mermaid preview** — renders the Mermaid diagrams in `WORKFLOWS.md` and similar docs.
- **YAML schema** + **markdownlint** — keeps `labels.yml`, `.skill-config.yml`, and the long-form markdown clean.

The seed is **infinitely extensible** by design — when you find another plugin or extension that meaningfully amplifies how you work, add it. There's no fixed shape.

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
