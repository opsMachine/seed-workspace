# To Integrate

Staging area for content that should eventually fold into the canonical strategy docs ([`../strat-summary.md`](../strat-summary.md), [`../evidence-ledger.md`](../evidence-ledger.md), [`../../Context/positioning-canvas.md`](../../Context/positioning-canvas.md), [`../../Context/swipe-file.md`](../../Context/swipe-file.md), etc.) — but hasn't been integrated yet.

## Purpose

Things drop in here when they emerge — usually from client work, strategic conversations, or skill iterations. They don't go directly into canonical docs because:

- Integration deserves intentional review, not incremental drift
- Some learnings are N=1 (single engagement) and need validation before they generalize
- Batch-integration produces more coherent canonical docs than continuous edits
- Captures the *date* a learning surfaced — useful when reviewing how thinking evolved

## Lifecycle

```
client work / conversation
        │
        ▼
   capture here  ──►  validate (other engagements / time)  ──►  integrate into canonical
                                                                        │
                                                                        ▼
                                                                archive original to ../z-archived/
                                                                (or delete if redundant)
```

Mediated by the paired skills:

- **Capture** — invoke [`harvest-learnings`](../../.claude/skills/harvest-learnings/SKILL.md) and it writes a doc here
- **Validate** — let it sit; or add corroborating evidence rows in the source doc when a second engagement confirms
- **Integrate** — invoke [`integrate`](../../.claude/skills/integrate/SKILL.md); it proposes per-edit changes to canonical docs, applies the ones you approve, then archives the source

## Conventions

- **Filename:** `YYYY-MM-DD-topic-source.md` (e.g. `2026-04-25-positioning-uncovered-acme-corp.md`)
- **First line:** `*Status: To integrate. Source: [where the learning came from].*`
- **Always include:** TL;DR at top + "Where this should integrate" section at bottom
- **Update log** row when revised
- **Source-cite every claim** — file path, transcript timestamp, email date. A claim without a source isn't a learning, it's a guess.

See [`TEMPLATE.md`](TEMPLATE.md) for the full structure.
