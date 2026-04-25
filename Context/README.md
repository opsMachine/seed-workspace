# Context/ — Stable knowledge layer

Foundational material that doesn't change often. Strategy work in [`../Strategy/`](../Strategy/) builds on top of this.

## What belongs here

- **Self-knowledge** — your cognitive defaults, blind spots, ideal role, how you make decisions when you're operating well
- **Positioning** — what you do, who it's for, what attracts vs. filters
- **Voice** — how you write/speak externally; tone calibration for AI-drafted copy
- **Working-with-you** — collaborator handoff notes for any AI agent or human picking up your context cold (different from self-knowledge: this is about the working relationship, not just who you are)
- **Swipe file** — analogous copy / language patterns from other businesses that resonate with your buyers
- **Stable analysis** — positioning breakthroughs, value-ladder analyses, anything you'll reference for years

## What does NOT belong here

- Working strategy → [`../Strategy/`](../Strategy/)
- Weekly plans / cadences → [`../Container/`](../Container/)
- Per-engagement client work → [`../clients/<name>/`](../clients/)
- AI system-prompt instructions → [`../In-App/`](../In-App/)

## Templates shipped

| File | Purpose |
|---|---|
| `self-profile.md.template` | Cognitive signature, blind spots, operating modes |
| `working-with-X.md.template` | Collaborator handoff: voice, register, division of labor, patterns to watch |
| `positioning-canvas.md.template` | Three-part positioning + engagement shape + filters |
| `swipe-file.md.template` | Buyer-language patterns + analogous copy library |

Each has a `<<EDIT: ...>>` placeholder convention. Copy the template (drop the `.template` suffix), fill in, and the file becomes your living canonical doc.

## Maintenance

- **Date-stamp** every meaningful update (use real-time, not hardcoded — your IDE's time tool)
- **"Last touched" awareness** — anything 6+ months old is worth re-reading with "is this still right?" before treating as canonical
- Keep these short and dense. Long Context docs become unread Context docs.
