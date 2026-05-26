# Setup Decisions

*Last interview: YYYY-MM-DD*

The output of the [`discover-stack`](.claude/skills/discover-stack/SKILL.md) skill — and the per-ability decision matrix that drives the rest of onboarding.

> Don't fill this in by hand on day 1. Run `discover-stack` instead — the skill will populate the matrix from a short conversation. You can edit it manually thereafter.

> **Companion doc:** [`OnboardingChecklist.md`](OnboardingChecklist.md) is the *did-it-yet* tracker; this doc is the *what-and-why* matrix. Update both: when a decision changes here, the checklist usually has an item that needs re-ticking.

---

## Decision matrix

For each row:

- **Decision** is one of: `mcp-only` / `mcp + local index` / `extract-and-index` / `native` / `symlinks` / `symlinks + indexed` / `port-templates` / `install` / `skip` / `deferred` / `needs-gain-analysis`
- **Notes** captures the *why* — the reasoning trail. Especially important for `needs-gain-analysis` and `deferred` rows so future revisits remember the context.

| Ability | Current system | Decision | Notes |
|---|---|---|---|
| Meeting transcripts | <<EDIT: e.g. Fathom / Otter / Granola / Fireflies / no recorder>> | needs-gain-analysis | <<EDIT: e.g. "Records ~3/week — gain-analysis says skip the local index unless that grows.">> |
| CRM | <<EDIT: e.g. HubSpot / Salesforce / Pipedrive / Notion / spreadsheet / vibes>> | needs-gain-analysis | <<EDIT>> |
| Tasks/projects | <<EDIT: e.g. ClickUp / Asana / Linear / Notion / paper>> | needs-gain-analysis | <<EDIT>> |
| Calendar | <<EDIT: e.g. Google Calendar / Outlook>> | mcp (read-only by default) | <<EDIT: write gating per AGENTS.md>> |
| Email | <<EDIT: e.g. Gmail / Outlook / scheduling-only>> | needs-gain-analysis | <<EDIT>> |
| Drive / docs | <<EDIT: e.g. Drive / Dropbox / Notion / scattered>> | needs-gain-analysis | <<EDIT: e.g. "Drive File Stream installed — symlink path is high-leverage.">> |
| Strategy / self-knowledge docs | <<EDIT: e.g. nothing yet / scattered in Drive / on a Notion page>> | port-templates / symlink-existing | <<EDIT: e.g. "Existing positioning doc in Drive — will symlink and adapt rather than recreate.">> |
| Cadences | <<EDIT: e.g. weekly review already exists / nothing>> | install keystone weekly review / already-have-one / deferred | <<EDIT>> |
| API credential gateway | <<EDIT: e.g. none / keys in .env only / OneCLI>> | install OneCLI / env-only / deferred | <<EDIT: e.g. "OneCLI for MCP keys — agents never read mcp.json secrets.">> |

---

## Per-row reasoning archive

When a row's decision changes (e.g. `needs-gain-analysis` → `extract-and-index`), append the reasoning here so the trail isn't lost:

### YYYY-MM-DD — <ability>

- **Previous decision:** <<EDIT>>
- **New decision:** <<EDIT>>
- **Reasoning:** <<EDIT — what changed; what gain-analysis surfaced; what new context surfaced>>

---

## Notes (anything else surfaced during discovery)

<<EDIT: free-form. Things like:

- "Fathom records get exported to Drive automatically — could index those instead of going through the API."
- "ClickUp tasks have rich notes that are arguably more valuable than the task titles themselves."
- "I don't currently have a positioning doc; the breakthrough analysis will probably come from one of the discover-stack questions itself."
- "Friday afternoons are my reflective slot already — keystone cadence has a natural home."
>>

---

## Rebooting this matrix

If your stack genuinely changes (new CRM, new recorder, new collaboration platform), re-run `discover-stack`. It'll surface what's already decided and ask "what's changed?" rather than re-asking everything. Reasoning rows above carry forward.
