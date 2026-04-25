---
name: harvest-learnings
description: "Extract transferable learnings from a client engagement (or strategic prep session) and stage them in `Strategy/to integrate/` for later canonical integration. Reads engagement artifacts from `clients/<client>/`, cross-references against the canonical strategy docs (paths read from `.skill-config.yml`), and drafts a properly-sourced staging doc using the to-integrate TEMPLATE.md. Use when the user says 'harvest learnings from [engagement]', 'what did we learn from [client]', 'feedback loop time', 'lessons from [client]', 'wrap up [engagement]', or 'extract insights from this work'. Does NOT modify canonical docs — that's the sister `integrate` skill's job. Manual invocation only."
allowed-tools: Read, Write, Edit, Glob, Grep
---

# harvest-learnings

Capture transferable patterns from completed (or in-progress) client work and stage them in `Strategy/to integrate/` for later canonical integration. Closes the feedback loop from per-engagement work back to the strategy layer.

The skill produces **a single staged doc** that the user reviews and integrates intentionally via the sister [`integrate`](../integrate/SKILL.md) skill — never an automatic canonical update.

> **Path parameterization:** Canonical doc paths are read from [`.skill-config.yml`](../.skill-config.yml). If your workspace doesn't use the default names (e.g. `Context/positioning-canvas.md`), edit the config; this skill follows it.

---

## When to use

- After a substantive client conversation that produced a reframe or new insight
- At the end of a phase, sprint, or engagement
- When the user explicitly asks: *"harvest learnings from [X]"* / *"what did we learn here"* / *"feedback loop time"* / *"lessons from [client]"* / *"wrap up [engagement]"*
- After a multi-day strategic prep session that produced new framing
- After a major reframe (positioning shift, role redefinition, new artifact type that worked, frame/metaphor that emerged)

## When NOT to use

- For per-engagement task tracking → use the engagement's task system (ClickUp / Notion / etc.)
- To update canonical docs directly → that's the sister [`integrate`](../integrate/SKILL.md) skill (manual review + intentional edits)
- For one-off conversation captures with no transferable signal → just jot a note
- When source artifacts don't exist yet → first ensure the engagement has at minimum an AGENTS.md, an empathy doc, and one captured call

---

## Step 1: Confirm scope (cheap, ~30 seconds)

Two things to confirm before reading:

1. **Source engagement** — which `clients/<client>/` to harvest from. If user said the name, just confirm: *"Harvesting from `clients/<name>/` — confirm?"* If ambiguous, list options from `Glob: clients/*/AGENTS.md` and ask.
2. **Time window** — entire engagement, or since last harvest? Default: since last `Strategy/to integrate/*-<client>*.md` if one exists; otherwise entire engagement.

Don't ask multiple clarifying questions. One focused confirmation, then proceed.

### Symlink awareness

`clients/<name>/` folders are typically symlinks to real repos elsewhere on disk. **Reads via the symlink path are fine.** Writes go to `Strategy/to integrate/` which is NOT a symlink, so this isn't a concern for output. But cross-reference engagement files using the symlink path (`clients/<name>/...`) — that's what's stable from the meta-workspace's perspective.

---

## Step 2: Get the current date

Get today's date in the user's local timezone (use the time MCP / `date` command). Required for:

- Filename: `YYYY-MM-DD-topic-source.md`
- Doc's `*Created: YYYY-MM-DD*` line
- Update log row

Never hardcode the date.

---

## Step 3: Inventory source artifacts

Read systematically. Expected artifact set for a client engagement:

| Artifact | What it gives you | Status if missing |
|---|---|---|
| `clients/<client>/AGENTS.md` | Operating context, conventions, what to avoid | **Critical** — if missing, stop and tell the user |
| `clients/<client>/README.md` | Engagement framing, partner context, file index | Note absence, continue |
| `clients/<client>/context/<person>/empathy-objective.md` | Buyer-as-person lens; empathy quotes; objectives stated and inferred | **Critical for Categories 1, 6** — if missing, flag |
| `clients/<client>/context/engagement-insights.md` | Engagement-level synthesis: insights, leverage, follow-ups | **Critical for Categories 2, 3, 5** — if missing, flag |
| `clients/<client>/context/<person>/<date>-*.md` (call captures) | Verbatim quotes with timestamps — gold for Category 6 | Note count; more is better |
| `clients/<client>/context/email-chains/*.md` | Multi-party dynamics; vendor / partner context | Optional |
| Task statuses (if accessible via project task MCP) | What was actually executed; what was deferred | Optional |

If critical artifacts are missing, **stop** and tell the user what's needed. Don't fake-harvest from thin source material.

---

## Step 4: Extract patterns across the 6 categories

Each becomes a section in the output doc. **Some categories may be empty for a given engagement — that's fine; better empty-and-honest than fabricated.**

### Category 1: Concrete behaviors that landed (or didn't)

What positioning / role / posture moves were made? Which worked? Which didn't? Each behavior should be:
- Observable (a third party could see it happen)
- Sourced (cite the artifact or moment — file path, transcript timestamp)
- Generalizable (could apply to another engagement)

### Category 2: Frames, metaphors, language that emerged

Did a new way of describing the work surface? A metaphor introduced by you or the buyer? Internal vs. external vocabulary distinctions?

### Category 3: Role-shape signals — what's actually being sold

What did the buyer think they were buying? What did they actually need? What was the role *in practice* (not as named in any contract)? What disqualifies it?

### Category 4: Document/artifact types that worked

What artifacts produced clarity? Which were skipped or replaced? Categorize as:
- **Per-client (internal)** — empathy doc, engagement-insights doc, captured calls
- **Per-conversation (client-facing)** — flow chart, decisions list, glossary
- **Strategic-layer (cross-engagement)** — role one-pager, phase/roadmap doc

### Category 5: Problem types being solved

Which patterns of buyer pain recurred or were named? These are the hooks to recognize in future engagements.

### Category 6: Empathy statements — buyer's own language

Concrete buyer quotes the practice should be calibrated to recognize. Format as a table: `quote → what it means → response pattern`. **Source-cite every quote.** Primary candidates for the swipe-file canonical doc.

---

## Step 5: Cross-reference against existing `Strategy/to integrate/` content

```
Glob: Strategy/to integrate/*.md
```

For each existing file, read enough to check for overlap. Three possible outcomes per pattern:

- **Net new** → goes in the new doc
- **Extends an existing pattern** → either extend the existing doc directly OR add to new doc with a `> See also: [existing-doc]` link
- **Already captured** → skip; mention in the report

Don't duplicate. The `to integrate/` folder is a clean staging area, not a churn log.

---

## Step 6: Cross-reference against canonical docs

Read paths from [`.skill-config.yml`](../.skill-config.yml). Default canonical doc list (resolved per workspace):

| Logical name | Default path | What's in it |
|---|---|---|
| `positioning_canonical` | `Context/positioning-canvas.md` | Three-part core statement, engagement shape, what attracts/filters |
| `swipe_file` | `Context/swipe-file.md` | Buyer-language analogs |
| `working_with` | `Context/working-with-X.md` | Collaborator handoff |
| `self_profile` | `Context/self-profile.md` | Operating defaults, blind spots |
| `strat_summary` | `Strategy/strat-summary.md` | Current working strategy |
| `evidence_ledger` | `Strategy/evidence-ledger.md` | Falsification layer |

Use `Grep` to check whether a specific pattern's keywords already appear in canonical. If it does and the new evidence corroborates: don't restage; add a note to the output flagging it as a candidate for the Evidence Ledger. If it does and the new evidence contradicts: flag prominently — refutation is high-value signal.

If a pattern is NOT in canonical: it goes in the staged doc.

If a doc in `.skill-config.yml` is marked `not_in_use: true`, skip cross-referencing it.

---

## Step 7: Draft the staging doc

Use `Strategy/to integrate/TEMPLATE.md` as the structural starting point. Required elements:

- **Filename:** `Strategy/to integrate/YYYY-MM-DD-topic-source.md`
- **First line:** `*Status: To integrate. Source: [engagement name + date range].*`
- **Created date:** `*Created: YYYY-MM-DD*`
- **TL;DR section** at top — 3–5 bullets, each a quotable sentence
- **Per-category sections** populated from Step 4 (skip empty categories or note "no significant patterns this round" — don't fabricate)
- **"What needs validation across other engagements"** — honest about N=1 limits; concrete questions to test next
- **"Where this should integrate"** — a target-by-target mapping naming specific canonical docs (use the table from Step 6)
- **Update log** with one row stamped today

**Source-cite every claim.** Use clickable links where possible (transcript timestamps, file paths). A claim without a source isn't a learning — it's a guess.

**Voice template:** read the resolved `voice_profile` doc (from `.skill-config.yml`) before drafting if you need to recalibrate.

---

## Step 8: Report back

```
Staged: Strategy/to integrate/<filename>

Captured (X patterns across Y categories):
  - Category 1 (behaviors): <count> — <one-line summary>
  - Category 2 (frames): <count> — <one-line summary>
  - Category 3 (role-shape): <count> — <one-line summary>
  - Category 4 (artifacts): <count> — <one-line summary>
  - Category 5 (problem types): <count> — <one-line summary>
  - Category 6 (empathy quotes): <count> — <one-line summary>

Skipped:
  - <pattern>: <reason — already in canonical / duplicates existing to-integrate / no source>

Suggested next move:
  - validate (wait for second engagement) | partial-integrate (specific pieces ready now) | wait
  - If integrate-ready: which canonical docs are the targets
  - If wait: what corroboration would unlock integration
```

Keep it tight. The user reads this to decide what to do next.

---

## What this skill does NOT do

- Does NOT modify any canonical strategy doc — that's [`integrate`](../integrate/SKILL.md)'s job
- Does NOT modify the Evidence Ledger directly (only flags candidates in the output doc)
- Does NOT delete or archive anything from `Strategy/to integrate/` (manual after intentional integration)
- Does NOT commit to git
- Does NOT fabricate patterns to fill empty categories
- Does NOT over-stage — if only one or two transferable patterns surfaced, ship a short doc
- Does NOT run automatically — manual invocation only
- Does NOT synthesize across multiple engagements in a single run — one harvest per session

---

## Best practices

1. **Source-cite everything.** Every claim needs a file path, transcript timestamp, or email date.
2. **Honor N=1.** Single-engagement insights LOOK transferable but often aren't. Flag them and list what would validate them.
3. **Match voice.** Read the resolved `voice_profile` doc if you need to recalibrate.
4. **Skip empty categories cleanly.** A 4-section doc with substance > a 6-section doc with filler.
5. **Stage, don't integrate.** The skill's job ends at producing the staged doc.
6. **Filename hygiene:** `YYYY-MM-DD-topic-source.md`. Keep `topic-source` short, lowercase, hyphen-separated. The source is usually a client slug.
7. **One harvest per session.** Cross-engagement synthesis is a different (more expensive) move that deserves its own future skill.

---

## Sister skill

[`integrate`](../integrate/SKILL.md) handles the next step: take a `Strategy/to integrate/` doc, propose specific edits to canonical, get the user's approval per-edit, apply, then archive the source.

If the user asks to integrate from this skill: redirect — *"Harvest is staged. Want me to invoke `integrate` next?"* — don't try to do both jobs in one skill.
