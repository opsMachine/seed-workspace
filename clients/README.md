# clients/

Per-engagement work, kept independent from the meta-workspace.

## The pattern

Each active client engagement is its **own private GitHub repo** living as a sibling of `seed-workspace/` on disk:

```
~/Documents/GitHub/
├── seed-workspace/           ← this repo (meta-workspace)
├── acme-corp/                ← independent client repo (private)
├── widget-co/                ← independent client repo (private)
└── ...
```

Then **symlink** each client repo into this folder so the meta-workspace can read it without compromising per-repo isolation:

```sh
cd seed-workspace/clients
ln -s ../../acme-corp acme-corp
```

(One line; ask your AI in chat if you'd rather it handle the symlink.)

## Why client repos live as siblings (not under `clients/` for real)

- **IP / data isolation** — each engagement has its own private repo with its own visibility, history, and access controls. Easy to transfer ownership at end of engagement.
- **Blast radius** — a misconfigured `.gitignore` in the meta-workspace can never accidentally expose a client's private files. They live in a different repo.
- **Per-engagement git history** — clean commits per client, no cross-contamination.
- **Symlinks-into-meta** give you the workspace-level convenience (one IDE window, full context loaded) without giving up per-repo isolation.

This is the **"personal infra travels via tooling, client work stays isolated"** pattern. The MCPs travel via `seed-workspace/.cursor/mcp.json`. Strategy travels via the meta-workspace filesystem. Client repos stay independent.

## What lives in each client repo

Suggested structure (not mandatory):

```
acme-corp/
├── AGENTS.md                  ← engagement-specific operating context for AI
├── README.md                  ← engagement framing, status, next milestone
├── context/                   ← empathy doc, engagement-insights, captured calls
│   └── <person>/
│       ├── client-empathy-objective.md
│       └── YYYY-MM-DD-call-name.md
├── deliverables/              ← actual project artifacts
└── ...
```

The `AGENTS.md` is the most important — it's what an AI session reads when it picks up your work cold inside this engagement. Voice, sensitivities, conventions, what to avoid.

## Adding a new engagement

1. Create the repo as a sibling: `~/Documents/GitHub/<client-slug>/`
2. Initialize and push to a private GitHub remote
3. Symlink: `cd seed-workspace/clients && ln -s ../../<client-slug> <client-slug>`
4. Add a row to the Client engagements table in `../PROJECTS.md`
5. Drop an `AGENTS.md` in the client repo so AI agents have project-specific context
