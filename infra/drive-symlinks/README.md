# infra/drive-symlinks/

Surface Drive content in the workspace as if it were local files. The seed's preferred way to bring in your existing strategy / positioning / client material without recreating it.

## Why symlinks beat the Drive API for most cases

- **Local files are AI-native.** Faster than API calls, no rate limits, work with grep / ripgrep / file readers without extra ceremony.
- **Real-time sync.** File Stream / rclone keeps the local view current automatically.
- **Drive's UI still works.** You're not migrating; you're surfacing.

The Drive MCP makes sense when you need *write* access from an AI session, or when File Stream isn't available. Otherwise: symlinks.

## The pattern

1. Mount Drive locally — Google Drive for desktop on macOS/Windows, rclone mount on Linux. (If you don't already have this set up, ask your AI; it knows.)
2. `ln -s "<absolute-path-to-drive-folder>" infra/drive-symlinks/<short-name>`
3. Optionally symlink directly into the canonical layer when it makes sense:
   ```sh
   ln -s "../infra/drive-symlinks/<short-name>/positioning.md" Context/positioning-canvas.md
   ```
4. Update `.claude/skills/.skill-config.yml` if the symlink replaces a default canonical path.

## What to symlink (and what not to)

**Good candidates:** strategic / positioning docs you've already written, swipe-worthy collateral, client engagement folders with substantive context, reference material you want grep-able.

**Bad candidates:** massive folders you don't actually browse from the workspace, sensitive folders other tools shouldn't see, anything with files that change so often that File Stream's caching causes confusion.

Be selective. The point is to surface *the parts of Drive you'd want an AI session to be able to read*, not to mirror your entire Drive.

## Optional second pass: indexing into transcript-vault

If you want semantic search across some Drive folders (not just file browsing / grep), you can extend the transcript-vault to ingest selected markdown files alongside meeting transcripts. This is a real build — run [`gain-analysis`](../../.claude/skills/gain-analysis/SKILL.md) first. The symlink-only path is enough for most use cases.

## .gitignore note

Symlinks are personal (broken on other machines unless they have the same Drive structure). The repo's top-level `.gitignore` already ignores `infra/drive-symlinks/*` (with an exception for the README). Recreate per-machine using `Setup-Decisions.md` as the recipe.
