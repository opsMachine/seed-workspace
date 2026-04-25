# Philosophy

Read before any single template, skill, or layout decision. The seed only makes sense once the underlying stance is shared.

---

## What this is

The best version found so far of having **all the knowledge, context, and tools in one place** — for one person, in any role, infinitely extensible. A bespoke AI cowork space.

It's the *dynamic, file-versioned, cross-system* alternative to Claude Projects, Custom GPTs, and Gems. Those are sealed environments — read-only contexts the AI sees but can't change, with no cross-system access, no git history, and no extension path.

This is the opposite:

- **Dynamic** — the AI is editing canonical docs (with approval gates), updating the evidence ledger, staging new learnings. The workspace evolves *during* sessions, not just between them.
- **Cross-system** — in one chat, the AI can pull email + CRM + transcripts + the empathy map you wrote three months ago + the strategic conversation you're having right now, and weave them. That cross-system synthesis is the actual unlock.
- **File-versioned** — git is the sourcing + history + recoverability layer. Every change is recoverable; every claim has a trail.
- **Multi-level context** — sometimes you work from inside a client folder (zoomed in), sometimes from the top level (everything available). Both are first-class.
- **Infinitely extensible** — when the next thing you want to do isn't here, you (or your AI) just adds it. Excalidraw alongside AI is one example; tomorrow it's a custom MCP, a script, a new skill. The extension path is the value, not a footnote.

## The seven principles

1. **Local files beat connected systems** for AI work. Fast, native, no connection layer required. The default lean is *bring it into the workspace as files* over *connect via API*. APIs are for things that must stay live (calendar, CRM as system of record); files are for everything else.

2. **The AI is your interface across systems.** The seed exists so the AI can synthesize from many sources at once without each one needing its own ceremony. Cross-system synthesis is the headline value.

3. **Curate + connect, don't just store.** Each artifact knows its neighbors. Strategy connects to engagements connects to transcripts connects to swipe file. AI sessions traverse those connections naturally because the files are right there in a coherent structure.

4. **Knowledge has layers.** Stable (`Context/`) / current (`Strategy/`) / operational (`Container/`). Keeping them separate prevents conversational thinking from leaking into canonical and prevents stale canonical from disguising itself as current strategy.

5. **Falsifiable beats confident.** Every strategic claim has an evidence row. The Evidence Ledger is the answer to *"how do you know this is still true?"* Without that mechanism, strategy drifts toward what feels right and decouples from operating reality.

6. **Capture-then-integrate, with approval gates.** New learnings stage in `Strategy/to integrate/` until corroborated. Folding them into canonical requires explicit per-edit approval. No silent writes. This is the antidote to continuous-edit drift.

7. **Cadence beats one-off discipline.** A short, durable weekly review beats a beautiful one-off planning session every time. The container layer exists because strategy without an operating layer becomes doc-in-drawer.

## The central decision protocol: gain-analysis

Most "should I build this?" questions can be answered with one lens:

> **What's the marginal ability or speed gained over what my live system already does — and is that gain worth the build + maintenance cost?**

Default lean: **skip**. The burden of proof is on **build**. This applies recursively — even to substrate the seed itself ships (the transcript vault). Don't recreate what HubSpot, ClickUp, Drive, or your recorder already do well.

The [`gain-analysis`](.claude/skills/gain-analysis/SKILL.md) skill is the explicit version of this protocol.

## Bespoke by design

There is no "right" configuration. The seed gives the methodology and the architecture; you (with your AI) shape the rest to fit your stack, your work, your identity. Setup-as-bespoke is the point, not a defect.

The seed is deliberately small — a folder structure with intent, a few skills that codify the discipline, an optional substrate, and templates as starting points (clearly marked as one option among others; if you already have the doc somewhere, *symlink to it* rather than recreate). Everything else, the user and their AI handle on demand.

## Things to revisit when you drift

- Producing a new framework instead of acting on the existing one? Convert to a cadence trigger instead.
- Tempted to build something custom? Run gain-analysis first.
- Three cadences installed and none sticky? Cut to one.
- Canonical docs untouched in months? Either perfect (unlikely) or stale (more likely).
- Staging area full and growing? The integrate cadence isn't running.

## Closing

The methodology is more important than any specific implementation. The seed is one way to embody it; you'll diverge as you live with it. That's expected — that's the point.

What survives across implementations is the philosophy:

> *Local files beat connected systems. The AI is your cross-system interface. Curate and connect, don't just store. Falsifiable beats confident. Cadence beats discipline. Ask "what's the gain?" before building anything new. Extend without bound.*
