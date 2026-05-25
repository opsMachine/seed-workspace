# Skills

Agent skills shipped with the seed workspace. Each `<skill-name>/SKILL.md` is auto-discovered by Claude Code, Cursor's skill system, and AntiGravity (with minor adapter notes per IDE).

## What ships

| Skill | Purpose |
|---|---|
| [`discover-stack`](discover-stack/SKILL.md) | Day-1 interview that maps your existing stack and produces `Setup-Decisions.md` |
| [`gain-analysis`](gain-analysis/SKILL.md) | Per-ability decision protocol — *what's the marginal gain over what your live system already does?* |
| [`scaffold-cadence`](scaffold-cadence/SKILL.md) | Install one operational cadence per cycle (the discipline against over-instrumenting) |
| [`harvest-learnings`](harvest-learnings/SKILL.md) | Stage learnings from a client engagement or strategic conversation in `Strategy/to integrate/` |
| [`integrate`](integrate/SKILL.md) | Sister to harvest — fold staged learnings into canonical strategy docs with explicit per-edit approval |

That's it. Walking the onboarding checklist, doing one-off shell tasks, drafting docs from templates, troubleshooting MCPs — all of that, the AI in your IDE handles on demand without needing a dedicated skill.

## Path parameterization

`harvest-learnings` and `integrate` reference canonical doc paths that vary per workspace (you may name your positioning doc `positioning-canvas.md`, someone else may name it `positioning.md`). Both skills read [`.skill-config.yml`](.skill-config.yml.template) for the mapping.

After bootstrap, the `discover-stack` skill writes the resolved paths into `.skill-config.yml`. You can also edit it manually.

## IDE registration

- **Claude Code** — auto-discovers `.claude/skills/<name>/SKILL.md`. Nothing to do.
- **Cursor / AntiGravity** — auto-discovers `.cursor/skills/<name>/SKILL.md`. One-liner: `ln -s ../.claude/skills .cursor/skills` so both conventions see the same source of truth. Ask your AI to do it if you want.
- **Other IDEs** — same pattern; symlink to wherever your IDE expects skills.

## Adding new skills

Same convention: `<name>/SKILL.md` with frontmatter `name`, `description`, optional `allowed-tools`. Description should include trigger phrases the user is likely to say so the skill auto-surfaces.

## `allowed-tools` is advisory, not a security boundary

The `allowed-tools` frontmatter field (e.g. `allowed-tools: Read, Write, Edit, Glob, Grep`) documents which tools the skill is designed to use. Claude Code partially honors it as a nudge — but it is **not** a permission boundary or access control mechanism. A model still has access to any tool available in the session regardless of what `allowed-tools` says. Treat it as documentation of intent, not a constraint you can rely on for security.
