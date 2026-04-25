# Container/cadences/

Definitions of recurring operational rituals. One file per cadence. Each file should answer:

1. **What** — concrete activity (e.g. "Walk every claim in the evidence ledger and update levels / add evidence rows")
2. **Why** — what this cadence prevents or produces
3. **When** — exact slot (e.g. "Friday 4:00–4:30 PM, calendar-blocked")
4. **Inputs** — what artifacts you read going in
5. **Outputs** — what artifacts get updated coming out
6. **Drift signals** — what tells you the cadence is failing (e.g. "skipped twice in a row", "filled in by autopilot without thought")

## Recommended starter cadence

The keystone is **weekly evidence-ledger review** (~30 min, end of week). If you install nothing else, install this one. Every other operational discipline routes through it.

A starter file `weekly-review.md` (you create after first onboarding) might look like:

```
# Cadence: Weekly Evidence Ledger Review

What:    Walk every claim in Strategy/evidence-ledger.md; update levels;
         add new evidence rows from this week's work; flag anything
         contradicted; identify what to test next week.
Why:     Keeps the strategy falsifiable. Catches drift before it compounds.
When:    Friday 4:00–4:30 PM, calendar-blocked, recurring.
Inputs:  Strategy/evidence-ledger.md, this week's container/week-of-*.md,
         any new entries in Strategy/to integrate/.
Outputs: Updated evidence-ledger.md; retro section of this week's plan;
         new entries in Strategy/to integrate/ if applicable.
Drift:   Skipped twice → install at risk; filled in last 5 min before EOW
         → not actually reflective; same evidence rows untouched 4 weeks
         in a row → ledger is stale, not your operating reality.
```

## Adding new cadences

Don't add a second cadence until the first is sticky for at least 4 weeks. Past four sticky cadences, you're probably over-instrumented.
