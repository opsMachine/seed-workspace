# transcript-vault-mcp

Local-first semantic search MCP built from your meeting recorder's data. Runs entirely on disk — no third-party AI API required for retrieval. Exposes 12 tools and 4 workflow prompts to any MCP-capable AI client (Cursor, Claude Desktop, Claude Code).

## Origin and motivation

This started as [`opsMachine/FathomMCP`](https://github.com/opsMachine/FathomMCP) — a Fathom-specific tool built to answer a single frustration: the native Fathom UI can't search semantically across years of recordings, pull everything ever said about a company in one query, or verify a strategic claim against the corpus. Those are AI-native capabilities the recorder UI fundamentally won't build because they require a local index.

After using it, three design decisions became clear that led to this generalized version:
1. The extraction layer (recorder API calls) should be swappable — everything else is recorder-agnostic
2. The labeling system (who is a client vs. advisor vs. prospect) should be human-in-the-loop with a YAML source of truth, not inferred automatically
3. The research methodology should ship alongside the MCP as a skill, so the AI knows how to use it rigorously rather than naively

The result: swap recorders by writing a single ~100-line adapter. Everything else (transform, embed, search, MCP server, workflow prompts, research discipline) stays the same.

## What the MCP exposes

**12 tools:**

| Tool | What it does |
|---|---|
| `list_meetings` | Filter meetings by person, company, date, relationship tag, call type |
| `get_meeting` | Full metadata, summary, and participants for a single recording |
| `find_person` | Search participants by name or email substring |
| `find_company` | Search companies by domain |
| `list_people_by_relationship` | All people carrying a given relationship tag (e.g. all clients) |
| `keyword_search` | FTS5 full-text search over titles and summaries |
| `semantic_search` | Vector search across transcript chunks — conceptual, not keyword-dependent |
| `get_entity_timeline` | Chronologically ordered mentions of a person, company, project, or topic |
| `get_project_status` | Inferred current state of a named project or deal, with history |
| `verify_claim` | **Dual-retrieval:** finds both supporting *and* contradicting evidence for a stated claim |
| `get_transcript` | All indexed transcript chunks for a recording, ordered by timestamp |
| `build_context` | Semantic search formatted as a ready-to-use markdown context block |

**4 workflow prompts** (orchestrate multiple tools into complete outputs):
- `client_persona` — pains, goals, objections, decision style, with citations
- `sales_coaching` — timestamped coaching review of a single call
- `content_from_meetings` — themes and pull-quotes across meetings on a topic
- `account_prep` — pre-meeting briefing: relationship state, open actions, unresolved concerns

The research methodology (triangulation protocol, attribution discipline, temporal resolution, roleplay guardrails) ships as a skill at `skills/transcript-research/SKILL.md` and is also served as an MCP resource (`skill://transcript-research`) so AI clients can fetch it directly without IDE skill discovery.

→ Architecture deep-dive (pipeline, storage layout, design decisions): [`ARCHITECTURE.md`](ARCHITECTURE.md)

> **Decide if you need this first.** If your recorder's native search is good enough for how you actually use it, skip this whole subsystem. See [`../../PHILOSOPHY.md`](../../PHILOSOPHY.md) and the `gain-analysis` skill.

---

## Pipeline at a glance

```
<your recorder's API>
   → adapters/<recorder>.ts
   → data/raw/*.json         (npm run extract)
   → vault/**/*.md           (npm run transform — human-browseable + opaque links)
   → data/index.db           (npm run transform — SQLite + FTS5 + label projections)
   → data/vectors/*          (npm run embed — LanceDB @ 384-dim, resumable)
   → MCP server              (npm run mcp, stdio)
   → Cursor / AntiGravity / Claude Desktop
```

Labeling loop (human-in-the-loop, git-tracked source of truth):

```
config/labels.yml            (TRACKED — single source of truth)
   ▲
   │  npm run apply-labels  (atomic merge + diff + re-transform)
   │
data/proposals.yml           (gitignored, chat-written)
   ▲
   │  Cursor chat reads the dossier, writes decisions
   │
data/candidates/*.md         (gitignored, npm run prep:people / prep:calls)
```

---

## Setup

```bash
cd infra/transcript-vault-mcp

# Install deps
npm install

# Configure
cp .env.example .env
# Then edit .env:
#   RECORDER_ADAPTER=<your recorder>
#   VAULT_DATA_ROOT=/abs/path/to/seed-workspace/vault   (recommended)
#   <ADAPTER>_API_KEY=...

cp config/labels.yml.template config/labels.yml

# First run
npm run extract       # pulls all meetings into data/raw/
npm run transform     # builds vault/ markdown + data/index.db
npm run embed         # populates LanceDB vectors
npm run mcp           # smoke-test the MCP server (Ctrl+C to exit)
```

The MCP server is registered in the workspace's `.cursor/mcp.json` (see `../../.cursor/mcp.json.template`). Once registered, ask `@transcript-vault` anything in Cursor.

---

## Adapters

The active recorder is selected by `RECORDER_ADAPTER` in `.env`. See [`adapters/README.md`](adapters/README.md) for the contract and [`adapters/fathom.ts`](adapters/fathom.ts) for a working implementation.

Stubs shipped (rename `.stub` → `.ts` and finish): `otter`, `granola`, `fireflies`. PRs welcome.

If you switch recorders, **delete `data/sync-state.json` first** — its `downloaded_ids` set is shared across adapters and you don't want a Fathom recording_id collision with a Fireflies one.

---

## What gets committed

Tracked: `config/labels.yml` only. `vault/People/` and `vault/Companies/` are generated output from `apply-labels` — they're gitignored because tracking generated artifacts alongside their source (`labels.yml`) creates noisy diffs and sync risk. Rebuild them any time with `npm run apply-labels`. Everything else (raw JSON, vectors, SQLite, sync state, proposals, candidates, logs, lock, transcripts) is also gitignored — see `.gitignore`.

---

## Nightly sync

A systemd user timer can run `scripts/nightly-sync.sh` at 03:00 local time. The wrapper runs extract → transform → embed in sequence under `flock`, tees to `data/logs/sync-YYYY-MM-DD.log`, and prunes logs older than 30 days. The unit passes `Environment=VAULT_DATA_ROOT=...` so the timer always writes to the right place.

Templates in [`scripts/sync.service.example`](scripts/sync.service.example) and [`scripts/sync.timer.example`](scripts/sync.timer.example). Copy to `~/.config/systemd/user/transcript-vault-sync.{service,timer}`, edit the paths, then:

```sh
systemctl --user daemon-reload
systemctl --user enable --now transcript-vault-sync.timer
systemctl --user list-timers transcript-vault-sync.timer
journalctl --user -u transcript-vault-sync -n 200
```

For one-off manual runs: `npm run sync:nightly`.

---

## Labeling workflow (human-in-the-loop)

The taxonomy at `config/labels.yml` is the single source of truth. Loop:

1. `npm run prep:people` (or `prep:companies` / `prep:calls`) — emits a triaged dossier to `data/candidates/<kind>-dossier.md`. Idempotent: skips anyone already in `labels.yml` or `proposals.yml`. Default `--limit 30`; `--all` for everything.
2. In Cursor chat, read the dossier and write tag decisions into `data/proposals.yml`. Or run with `--accept-drafts` to auto-stage the high-confidence (A_PROPOSE) bucket.
3. `npm run apply-labels -- --dry-run` to preview the diff.
4. `npm run apply-labels` to merge atomically and re-run transform.

Run companies before people — the person dossier uses company tags as a prior. Auto-derived call_types (`internal`, `advisory`) are computed at transform time and never appear in the YAML.

---

## MCP prompts (slash commands)

The server exposes four prompts that orchestrate the tools into complete workflows:

- `client_persona(company, focus?)` — pains / goals / objections / decision style with citations
- `sales_coaching(recording_id, angle?)` — timestamped coaching review of a single call
- `content_from_meetings(topic, audience?, format?)` — themes + pull-quotes + optional draft post
- `account_prep(company | person, lookback_days?)` — pre-meeting briefing: relationship state, open actions, unresolved concerns

In Cursor: `@transcript-vault` and ask. In Claude Desktop: `+` menu → MCP → transcript-vault.

---

## Conventions

- All timestamps stored ISO-8601 UTC.
- Filenames sanitized to `[<safe chars>]{1,100}`.
- Email addresses lowercased when used as keys.
- Generic email domains (gmail, yahoo, hotmail, outlook, icloud, aol, protonmail, mail.com) excluded from the company index.
- Meeting markdown filenames are `<recording_id>.md`; titles live in front-matter + h1 only — they don't leak through filenames.

---

## Known limitations / future work

- **Smoketest requires a populated corpus.** `npm run mcp:test` connects a real MCP client against the server; it cannot run against an empty vault because most tool assertions require at least one meeting. No fixture data or mock layer exists yet. This means the smoketest cannot run in CI on a fresh clone — it's a local integration check only.

- **`scaffold-cadence` cadence count is unenforced.** The skill warns against installing more than ~4 cadences but does not prevent it — the check is a prompt instruction with no enforcement mechanism. A future improvement would be a small validation script (or an explicit count check that the skill calls before proceeding).

- **`integrate` approval gate is a UX convention, not a technical lock.** The per-edit approval step relies on the AI respecting the protocol. There's no mechanism to block writes if the model interprets an ambiguous user response as approval. See the note in the skill itself.

- **Speaker attribution in transcripts is incomplete.** Many chunks surface as `Unknown` speaker. This is an upstream data-quality issue (varies by recorder). The A2 discipline in the transcript-research skill addresses it at the usage layer, but the underlying data will remain imperfect until recorders improve speaker diarization.

- **`vault/People/` and `vault/Companies/` are not incrementally rebuilt.** `apply-labels` re-runs transform on the full corpus, which can be slow on large vaults. A delta-only rebuild (re-transform only the meetings whose label assignments changed) would be a meaningful performance improvement.
