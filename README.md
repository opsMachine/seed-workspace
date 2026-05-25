# seed-workspace

A bespoke AI cowork space for one person operating at high context complexity. The dynamic, file-versioned, cross-system alternative to Claude Projects / Custom GPTs / Gems — and infinitely extensible.

> **The best version found so far of having all the knowledge, context, and tools in one place.** Not a productized template. Not a wizard. A methodology + a folder structure with intent + a few skills + an optional substrate. You shape the rest.

**Read in order:**

1. [`PHILOSOPHY.md`](PHILOSOPHY.md) — what this is and why
2. [`WORKFLOWS.md`](WORKFLOWS.md) — the four feedback loops
3. [`OnboardingChecklist.md`](OnboardingChecklist.md) — one-screen adoption guide
4. [`RECOMMENDED-TOOLING.md`](RECOMMENDED-TOOLING.md) — short menu of things that pair well

---

## What's here

```
seed-workspace/
├── PHILOSOPHY.md               ← what this is and why
├── WORKFLOWS.md                ← the four feedback loops the seed runs on
├── RECOMMENDED-TOOLING.md      ← short menu, not a prescription
├── OnboardingChecklist.md      ← one-screen adoption guide
├── Setup-Decisions.md          ← per-ability decision matrix (output of discover-stack)
│
├── Context/                    ← stable layer: self-knowledge, positioning, voice
├── Strategy/                   ← working layer: synthesis + Evidence Ledger + staging
│   ├── to integrate/           ← capture-then-integrate staging area
│   └── z-archived/             ← superseded artifacts kept for trail
├── Container/                  ← operational layer: weekly plans + cadences
├── In-App/                     ← system-prompt template for tools without auto-loaded context
│
├── clients/                    ← symlinks to per-engagement repos (sibling on disk)
├── personal/                   ← symlinks to non-client personal projects
│
├── infra/
│   ├── transcript-vault-mcp/   ← optional substrate: local meeting KB, recorder-agnostic
│   └── drive-symlinks/         ← convention for surfacing Drive content as local files
│
├── .cursor/mcp.json.template   ← MCP wiring template
└── .claude/skills/             ← the seed's skills
```

## The technical substrate: transcript-vault-mcp

[`infra/transcript-vault-mcp/`](infra/transcript-vault-mcp/) is the most substantial piece of working infrastructure in the repo. It's a local-first semantic search MCP built from your meeting recorder's data — no third-party AI API required for retrieval, everything runs on disk.

**What it does that your recorder's UI can't:**
- Semantic search across every transcript you've ever recorded, in one query
- Pull the full history of every conversation with a person or company, chronologically ordered
- Verify a claim by retrieving *both* supporting and contradicting evidence (dual-retrieval)
- Infer and track project/deal status from mentions across meetings over time
- Build pre-meeting briefings, client personas, and sales coaching reviews as MCP workflow prompts

**Stack:** TypeScript, SQLite + FTS5 (keyword search), [LanceDB](https://lancedb.github.io/lancedb/) + `@xenova/transformers` (local 384-dim embeddings — no OpenAI dependency), MCP stdio server, adapter interface for any recorder. Fathom is fully implemented; Fireflies/Otter/Granola ship as stubs.

Originally built for Fathom specifically as [`MitchSchwartz/FathomMCP`](https://github.com/MitchSchwartz/FathomMCP), then generalized so the extraction layer is swappable while everything else (transform, embed, search, MCP server, workflow prompts) stays recorder-agnostic.

→ Full documentation: [`infra/transcript-vault-mcp/README.md`](infra/transcript-vault-mcp/README.md)  
→ Architecture deep-dive: [`infra/transcript-vault-mcp/ARCHITECTURE.md`](infra/transcript-vault-mcp/ARCHITECTURE.md)

---

## The skills (the methodology, codified)

- **[`harvest-learnings`](.claude/skills/harvest-learnings/SKILL.md)** + **[`integrate`](.claude/skills/integrate/SKILL.md)** — capture-then-integrate lifecycle with explicit per-edit approval gates
- **[`gain-analysis`](.claude/skills/gain-analysis/SKILL.md)** — the central build/skip decision protocol
- **[`discover-stack`](.claude/skills/discover-stack/SKILL.md)** — day-1 interview to map what you already have so we don't recreate
- **[`scaffold-cadence`](.claude/skills/scaffold-cadence/SKILL.md)** — install one operational cadence at a time

Skill paths are parameterized via [`.claude/skills/.skill-config.yml`](.claude/skills/.skill-config.yml.template) so the seed adapts to whatever you've named your canonical docs.

## Getting started

1. Clone (or "Use this template" on GitHub) to `~/Documents/GitHub/<your-meta-workspace-name>/`.
2. Open it in your IDE (Cursor, AntiGravity, Claude Code) as the **workspace root**.
3. In chat: *"discover my stack"* — invokes [`discover-stack`](.claude/skills/discover-stack/SKILL.md), which interviews you and writes [`Setup-Decisions.md`](Setup-Decisions.md). It will ask, for each canonical doc, whether you already have it somewhere (Drive, Notion) so we **symlink rather than recreate** wherever possible.
4. From there, your AI walks you through [`OnboardingChecklist.md`](OnboardingChecklist.md) at your pace.

A few things the AI may need to do for you (just ask): create the `.cursor/skills` → `../.claude/skills` symlink for IDE skill discovery; create empty `vault/People/` and `vault/Companies/` if you decide to enable transcript-vault-mcp; create symlinks under `clients/` and `personal/` as you add sibling repos. None of these need a script — they're one-line shell commands the AI can run on demand.

## What this is NOT

- **Not a wizard.** Onboarding is a one-screen checklist; nothing blocks.
- **Not opinionated about your stack.** Every "should I build / connect this?" routes through [`gain-analysis`](.claude/skills/gain-analysis/SKILL.md).
- **Not a clone of someone else's setup.** Templates are starting points; the default lean is *symlink to what you already have* rather than fill in blank docs.
- **Not finished.** v0.1. The whole point is **infinitely extensible** — adapt freely, replace anything, write your own skills, build your own MCPs.

## IDE notes

Default `.cursor/` folder works for Cursor + AntiGravity. For Windsurf, Claude Code, or others, see [`.cursor/README.md`](.cursor/README.md) — it's usually one symlink.

## License

MIT — see [LICENSE](LICENSE).
