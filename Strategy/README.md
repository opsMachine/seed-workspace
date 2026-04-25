# Strategy/ — Working strategy layer

Current strategic synthesis + falsification layer + iterative diagrams. This layer is **alive** — update when understanding shifts; retire claims when superseded.

## What belongs here

- **Strat Summary** — your current working synthesis. TL;DR at top, supporting detail below. Updated whenever a major claim shifts.
- **Evidence Ledger** — the falsification layer beneath your strat summary. Tracks supporting / contradicting cases per claim with evidence levels (L1 pattern-match → L4 sustained). Counters drift; addresses the abductive-reasoning blind spot.
- **Visual strategy maps (optional)** — if you find visual mapping useful, drop the files here in any format that works for you (Excalidraw, draw.io, Miro export, hand-drawn screenshots). Convention: filename-version dates, archive prior iterations under `z-archived/`. The seed doesn't ship a starter — pick a tool that fits your thinking.
- **Staging area** ([`to integrate/`](to%20integrate/)) — captures from client work, conversations, and skill outputs that aren't yet ready for canonical
- **Archive** ([`z-archived/`](z-archived/)) — superseded versions of strategy artifacts kept for historical trail

## What does NOT belong here

- Stable self-knowledge → [`../Context/`](../Context/)
- Weekly plans → [`../Container/`](../Container/)
- Per-engagement work → [`../clients/`](../clients/)

## Conventions

- **Filename versioning**: when a major artifact gets restructured, save the prior version as `<name>-vN-YYYY-MM-DD.<ext>` and move it to `z-archived/`
- **Strikethrough in TL;DRs**: indicates a claim has been refined or superseded; the new version follows on the same line
- **"Held" or "deferred"** in open questions: explicitly not-yet-resolved (different from "open" — these are intentional non-decisions)
- **Update log row** at the bottom of each living doc, date-stamped

## Templates shipped

| File | Purpose |
|---|---|
| `strat-summary.md.template` | Current working synthesis: headline diagnosis, TL;DR, detail, container backlog |
| `evidence-ledger.md.template` | Per-claim evidence tracking with L1–L4 levels |
| `to integrate/TEMPLATE.md` | Stage doc structure (used by the harvest-learnings skill) |

## Why three sub-layers (synthesis / evidence / staging)

- **Synthesis** is what you operate from day-to-day — should be readable in one sitting.
- **Evidence** is what makes the synthesis falsifiable — claims without evidence rows are guesses.
- **Staging** is where new learnings live until you've corroborated them across more than one engagement / context — prevents N=1 drift.

The capture → integrate lifecycle is mediated by the [`harvest-learnings`](../.claude/skills/harvest-learnings/SKILL.md) and [`integrate`](../.claude/skills/integrate/SKILL.md) skills.
