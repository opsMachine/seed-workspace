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

## The six principles

1. **Local files beat connected systems** for AI work. Fast, native, no connection layer required. The default lean is *bring it into the workspace as files* over *connect via API* — for the things where local makes sense.

2. **Delegate to systems-of-record; build only the interface enhancements that make AI work usefully better.** Drive owns versioning of your docs — we don't duplicate that; we symlink in the references and let Drive do its job. HubSpot owns CRM state — we don't rebuild it; we add the cross-source synthesis the native UI doesn't give us. Calendar owns event truth. The point isn't to replace the system you (or your team) already use; it's to *augment what you can do with it from an AI session.*

   The transcript-vault is the canonical example. It doesn't replace your recorder; it adds abilities the recorder's UI fundamentally can't: lookup-entire-relationship across years of calls, semantic search across the corpus, deep-research prompts that orchestrate multi-step retrieval. Those interface enhancements emerged from working with the AI and noticing what was painful or impossible with the native tool. **That's the right way to discover what to build:** keep using the native system, notice what the AI can't do well over it, build only the interface layer that closes that specific gap.

3. **The AI is your interface across systems.** The seed exists so the AI can synthesize from many sources at once without each one needing its own ceremony. Cross-system synthesis is the headline value.

4. **Architecture: layers separated, artifacts connected.** Stable (`Context/`) / current (`Strategy/`) / operational (`Container/`) are three distinct layers — keeping them separate prevents conversational thinking from leaking into canonical, and prevents stale canonical from disguising itself as current strategy. *Within and across* layers, every artifact knows its neighbors (strategy connects to engagements connects to transcripts connects to swipe file). AI sessions traverse those connections naturally because the files are right there in a coherent structure.

5. **Falsifiable beats confident.** Every strategic claim has an evidence row. The Evidence Ledger is the answer to *"how do you know this is still true?"* Without that mechanism, strategy drifts toward what feels right and decouples from operating reality. The capture-then-integrate lifecycle ([`Strategy/to integrate/`](Strategy/to%20integrate/) → approval-gated `integrate` skill → canonical) exists in service of this — see [`WORKFLOWS.md`](WORKFLOWS.md) for the mechanism.

   One honest constraint: the Evidence Ledger is a *self-assessed* system. You write the claims, the falsification criteria, and the evidence levels. That's better than not tracking at all, and still subject to motivated reasoning — narrow falsification criteria, retrospective pattern-matching, and avoiding the contexts where a claim might fail are all failure modes a motivated person can execute in good faith. The level promotion criteria in the ledger template are designed to make this harder, not to eliminate it. Treat L1–L3 claims as working hypotheses; treat L4 claims as well-tested but not proven.

6. **Cadence beats one-off discipline.** A short, durable weekly review beats a beautiful one-off planning session every time. The container layer exists because strategy without an operating layer becomes doc-in-drawer.

## Credential security: agents never see real keys

MCP wiring, `.env` files, and chat sessions are all places an AI agent can *read* configuration. Treat **real API keys as out-of-band** from anything the agent touches in this workspace.

**Default stance:**

- **Never commit** secrets — `.env`, `.cursor/mcp.json`, and live config files are gitignored; templates ship empty placeholders only.
- **Never paste** real keys into chat, canonical docs, or client repos the agent can search.
- **Prefer a credential gateway** when you run multiple MCPs or agents: store real keys once; agents use placeholders or proxy-routed calls. The agent makes normal HTTP/MCP requests; the gateway injects auth.

**Recommended:** [OneCLI](https://github.com/onecli/onecli) — open-source credential gateway with an encrypted vault. You store credentials in OneCLI; agents get scoped access tokens and placeholder keys. Outbound requests through the gateway swap placeholders for real secrets at request time. Fits the same philosophy as write-tool gating: *the agent operates; it does not hold the keys.*

Local-only subprocesses (e.g. `npm run extract` for transcript-vault) may still read a gitignored `.env` on disk — that's acceptable when only *you* run the command, not the agent in a broad file search. When the agent might see env or MCP config, use OneCLI or equivalent instead.

See [`RECOMMENDED-TOOLING.md`](RECOMMENDED-TOOLING.md) (Security) and [`AGENTS.md`](AGENTS.md.template) (Credential handling).

## The central decision protocol: gain-analysis

Principle 2 (delegate to systems-of-record) is the *stance*. Gain-analysis is how you make it operational. Most "should I build this?" questions can be answered with one lens:

> **What's the marginal ability or speed gained over what my live system already does — and is that gain worth the build + maintenance cost?**

Default lean: **skip** — keep using the native system, let it do its job. The burden of proof is on **build**, and what gets built should almost always be an *interface enhancement* (something that makes AI work over the native system meaningfully better) rather than a replacement of the native system itself.

This applies recursively — even to the substrate the seed itself ships (the transcript vault). Run gain-analysis on that before installing it.

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

> *Local files beat connected systems where they can. Delegate to systems-of-record where they can't — and add only the interface enhancements that make AI work usefully better over them. The AI is your cross-system interface. Agents never hold real API keys — store secrets in a gateway, not in MCP config the agent can read. Curate and connect, don't just store. Falsifiable beats confident. Cadence beats discipline. Ask "what's the gain?" before building anything new. Extend without bound.*
