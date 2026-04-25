# personal/

Symlinks to **non-client personal projects** — side projects, communities, products you're building outside the consulting practice.

Same pattern as [`../clients/`](../clients/): each project is its own sibling repo, symlinked in for unified workspace context, kept independent for git/deploy isolation.

```
~/Documents/GitHub/
├── seed-workspace/
├── side-project-a/      ← independent repo
└── community-thing/     ← independent repo

seed-workspace/personal/
├── side-project-a/      → symlink to ../../side-project-a
└── community-thing/     → symlink to ../../community-thing
```

(One line; ask your AI in chat if you'd rather it handle the symlink.)

## Why a separate folder from `clients/`

Same pattern, different mental category. Clients pay; personal projects are yours. The split keeps them visually separable in the file tree and prevents your strategy reads from accidentally treating a personal project as a "current client" data point.
