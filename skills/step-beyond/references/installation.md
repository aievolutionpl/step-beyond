# Installation

## Prompt-only

```bash
scripts/install.sh                 # every supported host found in $HOME
scripts/install.sh --host claude   # or codex, hermes, all
scripts/install.sh --project       # this repository only
scripts/install.sh --always-on     # also write the standing instruction block
```

The installer copies `skills/step-beyond/` into the host's skill directory,
creates `~/.step-beyond/user-patterns.md` if it does not exist, and with
`--always-on` writes `templates/core-injection.txt` between
`<!-- step-beyond:core:start -->` and `<!-- step-beyond:core:end -->` in the
host's standing instructions. Re-running updates in place and never overwrites
memory. Paths and per-host behavior are in `hosts.md`.

Manual install: copy `skills/step-beyond/` into the host's skill directory, or
paste `templates/core-injection.txt` into its standing instructions.

Label this mode `prompt-only`: it guides reasoning but does not enforce
persistence, permission, shared state, or evidence.

## Runtime-backed

Requires Node.js 20 or newer:

```bash
npm install
npm run validate
```

Wire the host through `@step-beyond/adapter-reference`, then provide user-model
persistence with `@step-beyond/runtime-store`. See `docs/runtime.md` in the
repository for concrete examples.

An installation is runtime-backed only after capability detection, local policy
tests, and storage reload checks pass. It is verified only after repeated
adapter-specific behavioral evals. Re-running setup must update in place and must
not overwrite user memory or audit history.
