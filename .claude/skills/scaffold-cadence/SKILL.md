---
name: scaffold-cadence
description: "Install one operational cadence at a time in Container/cadences/. The discipline is one-at-a-time, never bundled — past four sticky cadences you're over-instrumented. Use when the user says 'install a cadence', 'add a weekly review', 'set up the keystone review', 'scaffold a Friday review', 'add a monthly retro', or any 'install one operational ritual' request. Drafts the cadence file, names the calendar slot, defines drift signals, and asks the user to commit to a 4-week trial."
allowed-tools: Read, Write, Edit, Glob
---

# scaffold-cadence

Install one operational cadence in `Container/cadences/`. Just one. Never bundle.

> **The discipline:** install one cadence; let it run for at least 4 weeks; only then add another. Trying to install three at once is a guaranteed regression — the first one slips, then the others collapse around it.

---

## When to use

- User asks to install a weekly review, monthly retro, decision-point cadence, etc.
- User has finished `discover-stack` and is ready for the keystone install
- User wants to add a second/third cadence after the first is sticky

## When NOT to use

- For one-off planning (use a `Container/week-of-*.md` file instead)
- For per-engagement decisions (those go in the client repo, not in cadences)
- When the user is trying to install >1 cadence — politely insist on one at a time

---

## Stance

**Cadence > content.** A short, durable cadence beats a beautiful one-off doc every time. The skill's job is to install something the user will *actually do* on the slotted day, not to design the perfect protocol.

If the keystone (weekly review) isn't sticky yet, every other cadence install is premature. Default to weekly review unless the user explicitly says otherwise.

---

## Step 1: Check what cadences already exist

```
Read: Container/README.md
Glob: Container/cadences/*.md
Read: any existing cadence files
```

If cadences already exist:

- **First cadence not yet running 4 weeks?** Surface this; gently push back on adding another. *"Your <existing> cadence is N weeks old; the discipline is to let it run 4 weeks before adding another. Worth installing this new one now anyway? (sometimes the answer is yes — name why)."*
- **Three+ cadences already?** Surface this; flag over-instrumentation risk. *"You have N cadences already. Adding more often means dropping one. Which one is this replacing, or what makes a 4th worth it?"*

Don't refuse — but make the trade-off visible.

## Step 2: Define the cadence in plain English

Ask the user — not as a checklist, as a conversation:

1. **What is the activity?** Concrete; observable. Not "review the strategy" — *"walk every claim in evidence-ledger.md and update levels."*
2. **Why does this need to exist?** What does it prevent or produce? If they can't name it, the cadence isn't earned yet.
3. **When?** Exact slot. Day of week, time, duration. *"Friday 4:00–4:30 PM"* — not *"end of week sometime."* Vague slots don't get done.
4. **What artifacts go in?** What gets read.
5. **What artifacts come out?** What gets written / updated.
6. **What are the drift signals?** What tells you the cadence is failing — before outcomes show it. (e.g. *"Skipped twice in a row," "Filled in 5 minutes before EOW without thought," "Same evidence rows untouched 4 weeks running"*)

## Step 3: Draft the cadence file

Write to `Container/cadences/<slug>.md`. Use the structure from `Container/cadences/README.md`:

```
# Cadence: <name>

*Installed: YYYY-MM-DD*
*Status: trial (first 4 weeks)*

What:    <activity, concrete and observable>
Why:     <what this prevents or produces>
When:    <day, time, duration; calendar-blocked>
Inputs:  <artifacts read going in>
Outputs: <artifacts updated coming out>
Drift:   <signals that the cadence is failing — before outcomes show it>

## Trial check-in (4 weeks from install)

- Did it happen all 4 weeks? (sticky / mostly / collapsed)
- Did it produce the intended artifacts each time?
- Drift signals firing?
- Continue, adjust, or retire?

| Week | Date | Happened? | Notes |
|---|---|---|---|
| 1 | YYYY-MM-DD | | |
| 2 | YYYY-MM-DD | | |
| 3 | YYYY-MM-DD | | |
| 4 | YYYY-MM-DD | | |
```

## Step 4: Name the calendar block

Cadences without a calendar block don't happen. Tell the user: *"This needs a recurring calendar block right now. Should I write the calendar event description for you to paste, or do you want to set it up directly?"*

**Do not auto-create the calendar event** even if the calendar MCP has writes enabled — calendar writes are gated per the workspace AGENTS.md. The user creates the event.

## Step 5: Update the Container README

Add a row to the "Cadences installed" section in `Container/README.md`:

```
- [`cadences/<slug>.md`](cadences/<slug>.md) — installed YYYY-MM-DD; trial through <date+4wk>
```

## Step 6: Set the revisit reminder

Tell the user: *"4-week check-in is YYYY-MM-DD (4 weeks from today). Either set a calendar reminder, or I'll resurface it next time we're reviewing the cadence — your call."*

## Step 7: Stop

**Do not** propose a second cadence in the same session. The skill ends here. If the user pushes for a second, gently restate: *"One at a time. Let this one prove out for 4 weeks first."*

---

## What this skill does NOT do

- Does NOT install multiple cadences in one session
- Does NOT auto-create calendar events (gated)
- Does NOT design exotic protocols when "weekly review of evidence-ledger" would do
- Does NOT lecture about discipline — surfaces trade-offs and lets the user decide

---

## Best practices

1. **Default to the keystone.** Weekly review of the evidence ledger is the right first cadence almost always.
2. **Concrete > clever.** A simple "walk the claims, update levels" beats an elaborate protocol no one runs.
3. **Drift signals are mandatory.** If the cadence has no failure-mode-detection, it has no honesty mechanism.
4. **Calendar block or it didn't happen.** Vague time slots don't get honored.
5. **Trial period is real.** 4 weeks is the floor; a cadence that survives 4 weeks earns a permanent slot.
