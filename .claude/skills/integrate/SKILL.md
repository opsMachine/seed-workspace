---
name: integrate
description: "Sister to `harvest-learnings`. Take a staged doc from `Strategy/to integrate/`, propose specific edits to canonical strategy docs (paths read from `.skill-config.yml`), get the user's explicit per-edit approval, apply approved edits, then archive the source to `Strategy/z-archived/`. Use when the user says: 'integrate the [topic] learnings', 'integrate from to-integrate', 'apply the staged learnings', 'merge into canonical', 'fold the [client] insights into strategy', or 'time to integrate'. **NEVER writes to canonical without explicit per-edit approval.** Supports preview-only mode + partial integration. Manual invocation only."
allowed-tools: Read, Write, Edit, Glob, Grep
---

# integrate

Take staged learnings from `Strategy/to integrate/` and fold them into canonical strategy docs intentionally. Sister to [`harvest-learnings`](../harvest-learnings/SKILL.md). Where harvest captures, integrate edits.

This skill is **higher-stakes** than harvest because it modifies canonical docs that downstream work depends on. Therefore: every canonical edit goes through an explicit approval gate. **No silent writes to canonical.**

> **Path parameterization:** Canonical doc paths are read from [`.skill-config.yml`](../.skill-config.yml). The skill resolves logical names (`positioning_canonical`, `evidence_ledger`, etc.) to actual file paths.

---

## When to use

- After harvest is staged and the user wants to fold it into canonical
- When a `to integrate/` doc has been corroborated by a second engagement and is now ready to canonicalize
- When the user is doing an intentional review pass of the staging area
- When a strategic claim needs a new evidence row in the Evidence Ledger
- When the user explicitly invokes: *"integrate [topic]"*, *"merge into canonical"*, *"apply the staged learnings"*, *"time to integrate"*

## When NOT to use

- To capture new learnings → use [`harvest-learnings`](../harvest-learnings/SKILL.md)
- To make ad-hoc edits to canonical that aren't sourced from a `to integrate/` doc → just edit canonical directly
- When the source doc is N=1 and hasn't been validated → warn the user; defer unless explicitly overridden
- For per-engagement file updates → those live in `clients/<client>/`, not canonical

---

## Step 1: Identify the source(s)

Three modes:

### Mode A: Specific source named
*"Integrate from `Strategy/to integrate/2026-04-25-positioning-uncovered-acme.md`"*
→ Use that doc. Confirm.

### Mode B: Topic named (resolve to file)
*"Integrate the Acme learnings"* / *"integrate the role-shape stuff"*
→ Glob `Strategy/to integrate/*.md`, match on filename or content. If 1 match, confirm and proceed. If multiple, list and ask. If 0, suggest invoking `harvest-learnings` first.

### Mode C: Bulk
*"Integrate everything in to-integrate"*
→ Glob, list, then process **one at a time** (not merged into one batch — keeps approval gates clean and rollback simple). Confirm the user wants the loop.

**Don't proceed without naming a specific source file.**

---

## Step 2: Get the current date

Get today's date in the user's local timezone. Required for archive filename suffix, source-doc update log, canonical Last Updated fields, evidence ledger row dates.

Never hardcode the date.

---

## Step 3: Read the source doc fully

Pay specific attention to:

1. **Status line** — `*Status: To integrate.*` should still be there. If it says something else (e.g., `Integrated YYYY-MM-DD`), STOP — already integrated.
2. **TL;DR** — the highest-priority claims
3. **Each populated category section** — the substance to integrate
4. **"What needs validation across other engagements"** — the limits the user is asking you to respect
5. **"Where this should integrate"** — the target table; this is the integration plan's starting point. **Treat as authoritative unless evidence says otherwise.**
6. **Update log** — has anything been added since the original capture? (Validation notes from a second engagement, etc.)

If the source is missing the "Where this should integrate" section, ask the user which canonical docs to target before proceeding. Don't infer silently.

---

## Step 4: Read each canonical target doc

Resolve target names through `.skill-config.yml`. For each target:

- Understand current structure (what sections exist, where new content slots in)
- Calibrate to the doc's voice
- Detect overlaps (is some of this already in the doc?)
- Detect contradictions (does the new content disagree with what's already there?)

If a target canonical doc doesn't exist or is marked `not_in_use: true` in `.skill-config.yml`: flag it. Don't create new canonical docs unilaterally.

---

## Step 5: Build the integration plan

Synthesize Steps 3 + 4 into a structured plan. **One section per target canonical doc.** Each proposed edit must be:

- **Specific:** name the exact section and the exact insertion point
- **Voice-matched:** drafted in the target doc's register, not the source's
- **Source-cited:** include a brief citation to the source `to integrate/` doc + originating engagement (kept after archive)
- **Atomic:** each edit can be approved or rejected independently

### Plan format (presented in chat)

```
INTEGRATION PLAN
================
Source: Strategy/to integrate/<source>.md
Source-engagement: <engagement name + date range>

TARGET 1: <canonical doc path>
  Edit 1.1 — Section "<section name>":
    Add bullet: "[Drafted text in target voice]"
    Source-citation: "(see Strategy/z-archived/<source-after-archive>.md, <engagement>, YYYY-MM-DD)"

  Edit 1.2 — Section "<section>":
    Add bullet: "[Drafted text]"
    Source-citation: "(...)"

TARGET 2: <canonical doc path>
  Edit 2.1 — New "Entry N: <name>":
    Add new numbered entry following existing template.
    [Show full drafted entry inline]

TARGET 3: <evidence ledger>
  Edit 3.1 — Existing claim "[claim text]":
    Add evidence row:
      | Date | Engagement / Source | Direction | Notes |
      | YYYY-MM-DD | <engagement> | SUPPORTS | "<note>" |

  Edit 3.2 — New claim:
    Add full claim section with statement, falsification criteria, and first evidence row.

HELD BACK (NOT in plan):
  - <Pattern from source>: <reason — N=1, contradicts existing canonical, needs the user's call, etc.>

POST-INTEGRATION:
  - Source doc → archive to Strategy/z-archived/<source>-archived-YYYY-MM-DD.md with integration header
  - OR: delete (the user's call)
```

**Do NOT write anything yet.** This is the proposal. Wait for explicit approval.

---

## Step 6: Get approval (per-edit, not just per-target)

Present the plan and ask:

> *Approve which edits? Reply with edit IDs (e.g., "1.1, 2.1, 3.1") or "all" or "all except 1.2" or "preview only — don't write" or "defer X — let me think" or "stop — needs more thought".*

The user may:
- **Approve all** — proceed to Step 7
- **Approve some** — proceed with approved subset; note deferred edits in the source doc's update log so they're not lost
- **Reject all** — STOP. Update source doc's update log with "Reviewed YYYY-MM-DD: held for further validation" and don't archive
- **Preview only** — STOP after presenting plan. Don't write anything. Don't archive.
- **Defer** — STOP. Don't write. Don't archive. Plan is captured in chat for next session

**Never proceed past this gate without explicit go-ahead.** "Looks good" is not approval — get edit IDs or "all".

> **Note on enforcement:** This gate is a UX convention enforced by prompt instruction, not a technical lock. The model can technically bypass it if the user is ambiguous. Treat it as a strong norm, not a hard boundary — it only holds when both parties respect the protocol.

---

## Step 7: Apply approved edits

For each approved edit, in order (target by target, edit by edit):

1. **Read the canonical doc one more time** — in case anything changed between Step 4 and now
2. **Apply the edit surgically with `Edit` (StrReplace)** — match enough surrounding context to make the replacement unique
3. **Update the canonical doc's `Last Updated:` field** if it has one (use the date from Step 2)
4. **Verify** — read back the affected section to confirm the edit landed correctly
5. **If the edit fails (target text not found):** stop, report the failure, don't continue with that target. Other targets can still proceed independently.

For Evidence Ledger edits specifically: be extra careful with table-row formatting. The Evidence Ledger structure is load-bearing.

---

## Step 8: Update the source doc's update log

**Before archiving**, append a row to the source doc's update log:

```
| YYYY-MM-DD | Integrated. Applied edits: 1.1, 1.2, 2.1, 3.1, 3.2. Held back: <list>. | <user> approval via integrate skill |
```

This preserves the chain of custody even after archival.

---

## Step 9: Archive (or delete) the source

**Default: archive.** Move the source to `Strategy/z-archived/` with a date suffix:

```
Strategy/to integrate/<source>.md
  → Strategy/z-archived/<source>-archived-YYYY-MM-DD.md
```

Add an integration header at the top of the archived file (above the existing `*Status:*` line):

```markdown
> **Archived YYYY-MM-DD.** Integrated into:
> - `<canonical doc>` — sections [X, Y]
> - `<canonical doc>` — Entry N
> - `<evidence ledger>` — claim rows [A, B]
>
> Held back (not integrated): [list, with reasons]
>
> Original status (preserved below): To integrate.

---
```

If the user explicitly says **"delete"** instead of archive: delete the source. Note the deletion in your final report.

If the user said **"preview only"** or **"defer"** in Step 6: don't archive. Source stays in `to integrate/`.

---

## Step 10: Report what was done

Clean summary in chat:

```
INTEGRATION COMPLETE
====================
Source: Strategy/to integrate/<source>.md (now archived as Strategy/z-archived/<filename>)

Applied edits:
  ✓ <canonical doc> (Edit 1.1, 1.2)
  ✓ <canonical doc> (Edit 2.1 — new Entry N)
  ✓ <evidence ledger> (Edits 3.1, 3.2)

Held back / deferred:
  - Edit X.Y: <reason>

Last Updated dates refreshed: <list of canonical docs>

Suggested next moves:
  - <e.g., "Edit X.Y deferred — revisit after [trigger event]">
  - <e.g., "Other to-integrate docs remain: [list]">
```

---

## What this skill does NOT do

- Does NOT modify any canonical doc without explicit per-edit approval
- Does NOT create new canonical docs (flag if needed; that's a separate decision)
- Does NOT commit to git
- Does NOT modify CRM records (that's CRM-MCP territory)
- Does NOT modify per-engagement files in `clients/<client>/`
- Does NOT run during active engagement work — invoke after harvest is complete and reviewed
- Does NOT synthesize across multiple `to integrate/` docs in a single approval cycle — one source at a time

---

## Best practices

1. **Always preview-able.** If the user wants to see the plan before any writes, support that. Default behavior is plan-then-approve.
2. **Atomic edits.** Each edit is independently approvable. Don't bundle 5 edits as "edit 1.1" — defeats the gate.
3. **Voice-match the target, not the source.** Each canonical doc has its own register. Read the canonical first; draft in its register.
4. **Source-cite every addition.** After archiving, the citation should still resolve — use the post-archive path in citations.
5. **Evidence Ledger is special.** New evidence usually adds rows to existing claims, not new claims. Only add a new claim if the to-integrate doc surfaces something genuinely novel.
6. **N=1 is a real constraint.** If the source doc flagged N=1 explicitly, surface that in the plan and recommend deferring weight-bearing edits to canonical (positioning, strategy summary). Evidence Ledger additions are fine even at N=1.
7. **Keep the staging area clean.** After successful integration, archive (or delete). Don't leave integrated docs sitting in `to integrate/`.
8. **One source per session.** If multiple sources are pending, do them one at a time with full approval cycles.
9. **If `Last Updated` isn't a field in the doc, don't add it.** Don't change canonical doc structure during integration.
10. **Read the resolved `voice_profile` doc** before drafting any external-voice edits.

---

## Sister skill

[`harvest-learnings`](../harvest-learnings/SKILL.md) is the upstream capture skill. The natural workflow:

```
client engagement → harvest-learnings → Strategy/to integrate/<doc>.md
                                              ↓
                                   (validation, time, second engagement)
                                              ↓
                                       integrate (this skill)
                                              ↓
                            canonical edits + Strategy/z-archived/
```

If invoked but no `to integrate/` docs exist, suggest invoking `harvest-learnings` first.

---

## Troubleshooting

**Source doc says `Status: Integrated YYYY-MM-DD`:** Already integrated. Stop — don't re-integrate.

**Source doc has no "Where this should integrate" section:** Ask the user which canonical docs to target. Don't guess.

**Edit fails because target text not found in canonical:** The canonical doc changed since the plan was built. Re-read the canonical, propose a revised edit, get re-approval for that specific edit. Other approved edits can still proceed.

**Two `to integrate/` docs propose conflicting edits to the same canonical doc:** Surface the conflict before proposing a plan. Ask the user how to resolve.

**A canonical doc has been edited by the user since harvest:** Treat the user's edits as authoritative. Honor what's in the doc now.

**The user wants to integrate something flagged N=1 with no validation:** Warn explicitly. Show the "What needs validation" section back. Let them override; don't refuse.

**`.skill-config.yml` is missing or incomplete:** Tell the user. Ask which canonical docs to target for this run; suggest invoking `discover-stack` afterwards to populate the config.
