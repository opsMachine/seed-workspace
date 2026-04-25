---
name: gain-analysis
description: "Per-ability decision protocol for the seed workspace. Asks 'what's the marginal gain over what your live system already does?' for any proposed local subsystem (transcript vault, CRM index, drive index, custom MCP, scripted automation). Use when the user says 'should I build X', 'do I need a local index for Y', 'what's the gain', 'is this worth setting up', or whenever a row in Setup-Decisions.md is marked needs-gain-analysis. Outputs a recommendation with reasoning, not a decision — the user decides."
allowed-tools: Read, Write, Edit, Glob, Grep
---

# gain-analysis

The central decision protocol of the seed. For every "should I build this locally / wrap this in a custom thing?" question, route through one lens:

> **What's the marginal ability or speed gained over what the live system already provides — and is that gain worth the build + maintenance cost?**

If the answer is "nothing meaningful", skip. This is the philosophical guardrail against re-creating things HubSpot / ClickUp / Drive / your recorder already do well.

The positive framing matters: the goal isn't to *replace* the native system, it's to **add the interface enhancements that make AI work over it usefully better.** Keep using the native system; identify the gaps the AI can't bridge with the native interface; build only those.

**Canonical example.** The seed's transcript-vault doesn't replace your meeting recorder. It adds three things the recorder's UI fundamentally can't:
1. *Lookup-entire-relationship* — pull every meeting, every quote, every action item across years of history with one person/company in a single query
2. *Semantic search across the corpus* — find every time you discussed X, ranked by relevance, even when the words varied
3. *Deep-research prompts* — multi-step retrieval orchestrated by the MCP (`client_persona`, `account_prep`, `sales_coaching`, `content_from_meetings`)

Those interface enhancements emerged from working with the AI and noticing what was painful or impossible with the native UI. **That discovery process is the right way to find what to build.** Don't speculate about what might be useful; use the native tool, notice the friction, build the interface layer that closes that specific gap.

---

## When to use

- User asks "should I build X" / "do I need to set up Y" / "is this worth it"
- A row in `Setup-Decisions.md` is marked `needs-gain-analysis`
- About to write a custom MCP, indexer, scheduled job, or scripted automation
- Considering whether a local copy / cache / index of an external system earns its keep

## When NOT to use

- For decisions that aren't about building local capability (e.g. "should I do client work A or B" — that's a strategy decision, not a tooling one)
- For trivially-obvious wins (e.g. "should I install the official MCP for the system I use every day") — just install
- When the user already knows what they want and is just asking for help with the install

---

## The protocol (one ability per run)

### Step 1: Name the ability concretely

Don't accept "should I build a CRM thing." Push for: *what specific question or workflow do you wish you could run that you currently can't (or that's painful)?*

If they can't name a concrete missing ability, that's the answer: **don't build it**. Wait until the gap is real.

### Step 2: Map what the live system already provides

For the named ability, list what their existing tool already does:

- Native search? How good?
- API access? What endpoints?
- Existing native integrations / plugins?
- AI features the vendor ships?

If they don't know — say so plainly: *"Worth a 10-minute look at what HubSpot's native search can actually do before we decide to build alongside it."*

### Step 3: Name the marginal gain (precisely)

The build is justified if and only if it provides at least one of:

1. **Speed** — significantly faster than the live system for queries you actually run repeatedly
2. **Depth** — answers questions the live system genuinely can't (semantic search, cross-source joins, full-history scan, free-form transformation)
3. **Composability** — exposes data so other tools (the AI, other scripts, other MCPs) can use it without each one needing a separate API integration
4. **Privacy** — keeps sensitive context local instead of sending to the vendor's AI
5. **Resilience** — keeps you operational when the live service is down / rate-limited / expensive

If you can't name at least one specific gain at the level of *"I will use this query weekly and it currently takes me 3 minutes / I currently can't run it at all"* — there's no gain. Skip.

### Step 4: Name the cost (precisely)

- **Setup time** — initial install, integration, schema mapping
- **Maintenance** — schema drift when the source system changes, debugging sync failures, occasional cleanup
- **Drift risk** — local cache vs. source-of-truth divergence; rules for refresh; what to do when they disagree
- **Opportunity cost** — what *else* you could be building / doing with the same hours

Be honest. Local indexes have a non-trivial maintenance tail.

### Step 5: Recommend (with reasoning)

Three possible outcomes:

- **Build** — gain is real and recurring; cost is justifiable. Recommend the smallest possible v1, framed as an *interface enhancement* to the native system, not a replacement.
- **Skip** — gain is hypothetical or one-off; live system is good enough. Recommend live-only.
- **Hybrid / lightweight** — live system stays the system-of-record, lightweight cache or index handles one specific repeated query the native system can't.

If the recommendation is "build," **explicitly name what stays delegated to the native system** (versioning, write-truth, primary search, etc.) so the build stays additive and doesn't accidentally try to replace the source.

Don't decide. **Surface the trade-off in plain English and ask the user.** They are in charge philosophically (see [`PHILOSOPHY.md`](../../PHILOSOPHY.md)).

### Step 6: Update Setup-Decisions.md

Replace the `needs-gain-analysis` cell for this ability with the resolved decision. Add the reasoning to the Notes column:

```
| CRM | HubSpot | mcp-only | gain-analysis 2026-04-25: native search adequate for current questions; no recurring missing query identified; revisit when we have a specific recurring "I wish I could ask X across all contacts" question. |
```

---

## Recurring patterns (use as priors, not rules)

These are not decisions — they're tendencies that the protocol surfaces frequently.

### Build-leaning patterns

- **Recorder transcript indexing** — almost always wins if you record >5 meetings/week and want semantic search across the corpus. The live recorder UI is universally weak at "find every time I mentioned X across all calls."
- **Drive folder symlinks** — almost always wins (zero build cost via Drive File Stream + ln -s); semantic indexing on top is the gain-analysis call.
- **Per-client engagement repos with AGENTS.md** — almost always wins for any engagement substantive enough to warrant >1 week of context — gives the AI rich grounded context the CRM can't match.

### Skip-leaning patterns

- **Local CRM index** — usually skip on day 1; HubSpot/Salesforce/Notion native search is competent. Build only when you've named a specific recurring missing query.
- **Email indexing** — usually skip unless email is your primary client-comms surface; CRM captures most of what matters.
- **Custom calendar logic** — usually skip; native + the calendar MCP read tools are enough.
- **Re-implementing what the vendor's AI already does well** — almost always skip; vendor AI knows their schema.

### Hybrid-leaning patterns

- **CRM + local cache for cross-source joins** — if you frequently want to ask "show me every contact whose company appears in three+ transcripts AND has an open deal" — the answer is one local SQLite that joins HubSpot + transcript-vault. Tight scope, high gain.
- **Drive + selective indexer** — symlink everything; only index the 2–3 folders you semantically search regularly.

---

## What this skill does NOT do

- Does NOT make the decision for the user. Surfaces the trade-off; the user decides.
- Does NOT install or build anything. Other skills (or just the user) handle execution.
- Does NOT bundle multiple abilities. One run = one ability. If multiple are pending, loop the protocol.
- Does NOT advocate for "more tooling." The default lean should be skip; the burden of proof is on build.

---

## Best practices

1. **Push for concreteness.** "I want CRM stuff" → *"What specific question do you wish you could ask?"*
2. **Don't theorize the gain.** If they can't name a query they'll actually run weekly, the gain isn't real.
3. **Name the maintenance cost honestly.** Local indexes drift. Vendors change schemas. This is real ongoing work.
4. **Recommend the smallest viable v1 if Build wins.** Almost never the maximalist version.
5. **Skip is a respected answer.** A workspace with 3 well-chosen MCPs is better than one with 10 half-configured ones.
