# Container/ — Operational container layer

Where strategy becomes weekly operations. The layer that lets the strategy actually run.

## Why this layer exists

Strategy without a container becomes "doc in drawer" — strategic clarity that doesn't translate to action. The container is the *how it stays alive week-to-week*: review cadence, plans, retros, accountability, the operational install that prevents strategic clarity from becoming a bookmarked PDF you never open.

The single most reliable failure mode of any strategy work is **clarity-without-install**. The container is the antidote.

## Conventions

### Weekly plans

- Filename pattern: `week-of-YYYY-MM-DD.md` (Monday of the week)
- Each plan has two sections: **Plan** (committed at start of week) and **Retro** (filled in at week's-end review)
- Plans cite back to your strat summary + evidence ledger so the trail stays connected
- Don't iterate plans into perfection — ship a v1 Monday morning, capture what happened Friday, learn

### Cadences

The most important install is a **weekly review cadence** — typically ~30 min, late in the week, where you walk the evidence ledger and ask "what did we learn?" / "what changed?" / "what's the move next week?" That single cadence is the keystone — almost everything else routes through it.

Other cadences to consider once the keystone is sticky (one at a time, never more):
- Monthly partner / collaborator check-ins
- Quarterly strategy review (do the strat-summary still hold up?)
- Per-engagement decision-point rhythms

## What belongs here

- Weekly plans + retros
- Cadence definitions in [`cadences/`](cadences/)
- Container-backlog artifacts as they get built (conversion measurement protocol, iteration discipline frame, etc.)
- Operational decisions that aren't strategy but need a durable home

## What does NOT belong here

- Strategy work → [`../Strategy/`](../Strategy/)
- Stable self-knowledge / positioning → [`../Context/`](../Context/)
- Client deliverables → respective `../clients/<name>/` repos
- Evidence claims → [`../Strategy/evidence-ledger.md`](../Strategy/evidence-ledger.md)

## Discipline

**Install one container artifact at a time, then maintain it before adding the next.** The operating-system layer is built incrementally. Trying to install five cadences in week one is a guaranteed regression — you'll skip the keystone first, then everything collapses.

The [`scaffold-cadence`](../.claude/skills/scaffold-cadence/SKILL.md) skill helps install one item per cycle.
