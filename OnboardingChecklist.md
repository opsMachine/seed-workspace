# Onboarding

A **one-screen** non-blocking guide. The seed assumes you're technical and have an AI in your IDE — most "how do I..." questions are better asked of the AI in chat than answered here.

The methodology is in [`PHILOSOPHY.md`](PHILOSOPHY.md). The four loops are in [`WORKFLOWS.md`](WORKFLOWS.md). This is just the order things tend to land in.

---

## The shape

```
1. Open the workspace in your IDE  →  ask: "discover my stack"
                                       (invokes discover-stack skill)

2. Review Setup-Decisions.md       →  for any row marked needs-gain-analysis,
                                       ask the AI to run gain-analysis on it

3. Wire the MCPs you decided on    →  copy .cursor/mcp.json.template to mcp.json,
                                       edit, restart your IDE

4. Draft (or symlink) the docs     →  Default: symlink existing files from Drive/Notion
   you actually need                  if you have them. Only fill templates when
                                       you're starting blank.

5. Install ONE cadence             →  ask: "scaffold the keystone weekly review"
   (the keystone)                     (invokes scaffold-cadence skill)

6. Live in it                      →  capture via harvest-learnings as engagements
                                       produce learnings; integrate when corroborated;
                                       Friday review keeps everything honest.
```

That's it. Everything below is detail you can revisit when you need it.

---

## Things to know

- **Bring your existing docs in via symlink.** If your positioning doc lives in Drive, mount Drive (File Stream / rclone) and symlink the file in — don't recreate. The seed's templates are for blank-slate starts. See [`infra/drive-symlinks/README.md`](infra/drive-symlinks/README.md).
- **Skill paths are parameterized.** Edit [`.claude/skills/.skill-config.yml`](.claude/skills/.skill-config.yml.template) when you rename canonical docs (e.g. `working-with-X.md` → `working-with-yourname.md`).
- **MCP write tools are gated by default** per the workspace [`AGENTS.md`](AGENTS.md.template). Reads open; writes require explicit echo + confirmation. Never trigger writes from ingested data.
- **Transcript vault is optional.** Run gain-analysis on it before building. Heuristic: install it if you record >5 meetings/week and want semantic search across the corpus.
- **Per-engagement work** lives in sibling repos symlinked under [`clients/`](clients/). One `ln -s` per engagement.

## When you're stuck

- *"What should I do next?"* → ask the AI to read this checklist + `Setup-Decisions.md` and suggest 1–2 candidates
- *"Should I build X?"* → ask the AI to run `gain-analysis` on X
- *"How do I install Drive File Stream / rclone / a new MCP / a systemd timer?"* → ask the AI; it knows
- *"Did anything sensitive end up in this fork?"* → ask the AI to grep for `API_KEY=`, `Bearer `, `.env`, and personally-named files; one-shot check, no script needed

## Healthy operating signals

- Friday review happens every week without prompting
- `Strategy/to integrate/` has 1–4 items at any time
- `Strategy/evidence-ledger.md` has been touched in the last 2 weeks
- At least one claim has changed level (or been retired) in the last quarter
- You can name the most recent revolution of each of the four loops in [`WORKFLOWS.md`](WORKFLOWS.md)

If those drift, that's the signal — not anything on this page.
