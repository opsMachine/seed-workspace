---
name: discover-stack
description: "Day-1 onboarding interview that maps the user's existing tools and produces Setup-Decisions.md — the per-ability decision matrix that drives everything else in the seed. Use when the user says 'discover my stack', 'set up the workspace', 'onboard me', 'what should I install', 'help me configure this seed', or whenever Setup-Decisions.md is empty / missing. Non-blocking: produces a draft the user can edit; never installs anything itself."
allowed-tools: Read, Write, Edit, Glob
---

# discover-stack

Day-1 interview. Maps the user's existing tools (recorder, CRM, tasks, calendar, email, drive, strategy docs) and produces (or updates) `Setup-Decisions.md` — the per-ability decision matrix every other onboarding step routes through.

This skill **does not install anything.** It interviews, captures decisions, writes the matrix. Actual installs happen at the user's pace — they can ask the AI in chat to walk the `OnboardingChecklist.md` whenever they want, no dedicated skill needed.

---

## When to use

- First chat in a freshly-cloned seed workspace
- User says "discover my stack" / "set up the workspace" / "what should I install"
- `Setup-Decisions.md` is empty or doesn't exist
- User wants to revisit decisions after time has passed

## When NOT to use

- For deep "should I build X?" reasoning — that's [`gain-analysis`](../gain-analysis/SKILL.md), one ability at a time
- For walking the install steps — that's a normal AI chat against `OnboardingChecklist.md`, no dedicated skill required

---

## Stance

The user is in charge philosophically. You are not setting up *your* preferred system — you are mapping *theirs*. Default to capturing what they already have and asking "what's the gain over what you already have?" before recommending anything new.

**Voice:** No sycophancy. Plain questions, plain answers, no "great choice!" If the user gives a vague answer, ask a sharper one — but only one at a time. Don't dump a 20-question survey.

---

## Step 1: Read what's already there

```
Read: Setup-Decisions.md (if exists)
Read: README.md
Read: PHILOSOPHY.md
Glob: Context/*.md
Glob: Strategy/*.md
```

If `Setup-Decisions.md` already has rows filled in, this is an **update pass** — start by surfacing what's already decided and ask "what's changed?" instead of re-asking everything.

## Step 2: Interview, one ability at a time

Walk through the 9 abilities in this order. **Ask one focused question per ability.** Don't bundle. After each answer, write the row immediately so the matrix builds incrementally.

If the user answers "skip" or "later", write `decision: deferred` and move on. Never block.

### Abilities to walk

1. **Meeting transcripts** — *"What's your meeting recorder, and roughly how many meetings/week?"*
   - If recorder has API and >5/wk → consider extract-and-index (transcript-vault-mcp)
   - If recorder has good native search and <5/wk → skip the local index
   - Otherwise → start with native, revisit later

2. **CRM** — *"What's your CRM, and what kinds of questions do you wish you could ask it that you currently can't?"*
   - HubSpot / Salesforce / Pipedrive / Notion / spreadsheet / "vibes"
   - The "questions you can't ask" answer drives the build/skip decision more than the platform name

3. **Tasks/projects** — *"Where do tasks and project state live?"*
   - ClickUp / Asana / Linear / Notion / GitHub Issues / Trello / paper
   - Plus: do you keep per-engagement docs anywhere durable today?

4. **Calendar** — *"Google Calendar, Outlook, something else? Should AI sessions be calendar-aware?"*

5. **Email** — *"Is email a primary client-comms surface, or mostly for scheduling?"*
   - If primary → consider gmail/outlook MCP
   - If scheduling-only → usually skip; CRM captures the substantive history

6. **Drive / docs** — *"Where do your strategy / process / client docs currently live?"*
   - Drive / Dropbox / Notion / scattered chats / nowhere
   - If Drive: do you have Drive File Stream (or equivalent mounted-drive)? — that unlocks the symlink path
   - If "scattered in chats" → flag that the strat-summary template is the antidote (don't lecture; just note)

7. **Strategy / self-knowledge docs** — *"Do you have any of these already (positioning doc, working-style doc, voice doc, strategy summary), or are we drafting from scratch?"*
   - **Default bias: symlink-from-existing, not create-from-template.** For each canonical slot in `.skill-config.yml`, ask: *"do you already have something close in Drive / Notion / on disk?"* If yes:
     - Drive (with File Stream mounted) → ask the AI to `ln -s` the existing file into `infra/drive-symlinks/<name>` and update `.skill-config.yml` to point at the symlink path
     - Notion → leave it where it is; reference it by URL in the seed's docs and use the Notion MCP for content access
     - Local disk (e.g. another folder) → symlink directly
   - Only fall back to "fill in the template" when there is genuinely no existing source — and even then, ask if a thin draft might already live somewhere (an old strategy email, a half-finished Notion page) that could seed the doc.
   - This is the philosophical default: **don't recreate what exists.** The seed's templates are scaffolding for blank slates, not migration targets for existing thinking.

8. **Cadences** — *"Do you have any operational rituals already (weekly review, monthly retro)?"*
   - If yes: capture them; the keystone may already exist
   - If no: name "weekly review" as the keystone candidate; don't push install yet

9. **API credential gateway** — *"Where do API keys for MCPs live today — in mcp.json, a .env file, a password manager, or nowhere yet?"*
   - If multiple MCPs or the agent can read config → recommend [OneCLI](https://github.com/onecli/onecli) (`install` or `deferred`); agents use placeholders, gateway injects real keys
   - If keys only in gitignored `.env` for manual CLI → note `env-only` and the risk if the agent greps env
   - Never recommend putting real keys in `mcp.json` or committed files

## Step 3: For any unsure answer — defer to gain-analysis

If the user can't decide on an ability ("hmm, not sure if I need a local CRM index"), don't push. Write `decision: needs-gain-analysis` and tell them: *"We can run the [`gain-analysis`](../gain-analysis/SKILL.md) skill on that one specifically when you want — it walks the build/skip lens."*

This is a feature, not a fallback. The gain-analysis question is the central philosophical move; surfacing it deliberately is part of the methodology.

## Step 4: Write Setup-Decisions.md

Use this structure (preserving any existing rows + their `decision` and `notes`):

```
# Setup Decisions

*Last interview: YYYY-MM-DD*

| Ability | Current system | Decision | Notes |
|---|---|---|---|
| Meeting transcripts | <recorder> | extract-and-index / native / skip / deferred / needs-gain-analysis | <freeform> |
| CRM | <system> | mcp-only / mcp + local index / native / skip / deferred / needs-gain-analysis | <freeform> |
| Tasks/projects | <system> | mcp + per-client repos / mcp-only / native / skip / deferred | <freeform> |
| Calendar | <system> | mcp (read-only) / mcp (gated writes) / skip / deferred | <freeform> |
| Email | <system> | mcp / skip / deferred | <freeform> |
| Drive / docs | <system> | symlinks / symlinks + indexed / mcp / skip / deferred | <freeform> |
| Strategy docs | <existing or "drafting from scratch"> | port-templates / symlink-existing-then-adapt / hybrid | <freeform> |
| Cadences | <existing> | install keystone weekly review / already have one / deferred | <freeform> |
| API credential gateway | <none / .env / OneCLI / other> | install OneCLI / env-only / deferred / needs-gain-analysis | <freeform> |
```

Plus a `## Notes` section under the table for anything else surfaced.

Plus update `.claude/skills/.skill-config.yml` with any path changes implied by their answers (e.g. if they renamed `working-with-X.md` to `working-with-alex.md`).

## Step 5: Report

Tight summary:

```
Setup-Decisions.md updated. <N> abilities decided, <M> deferred, <K> need gain-analysis.

Suggested next moves (your pace, no rush):
  - <highest-priority install based on decisions>
  - Run gain-analysis on: <abilities marked needs-gain-analysis>
  - <any context-doc draft to start from templates>

Ready to walk the OnboardingChecklist whenever you want — just ask in chat.
```

---

## What this skill does NOT do

- Does NOT install MCPs or run any setup commands — that's the user's call
- Does NOT fill in canonical docs (positioning, strategy summary) — too high-stakes for an automated draft
- Does NOT push opinions about the "right" stack — opinions only when explicitly asked
- Does NOT block — every ability can be `deferred`; the matrix is incremental

---

## Best practices

1. **One question at a time.** Voice-input users especially can't process a 20-question batch.
2. **Capture as you go.** Write each row to Setup-Decisions.md immediately after the answer, before moving to the next ability.
3. **Match register.** If the user is curt, be curt. If they're explaining context, listen — don't rush them to the next question.
4. **Defer cleanly.** "needs-gain-analysis" is a respected outcome, not a failure.
5. **Update mode is the common mode.** Most chats invoking this skill are revisits, not first-times. Surface what's already there before re-asking.
