# Host guide: Claude Code, Codex, Hermes

The behavior is identical on every host. Only three bindings differ: where the
skill is discovered, how it becomes always-on, and where memory lives. Detect
what the current session actually exposes; do not infer capabilities from the
host name.

All three hosts load a skill by matching the task against the `description`
in `SKILL.md`, so a skill that should shape every task also needs a standing
instruction. `templates/core-injection.txt` is that instruction (under 350
words). The installer writes it between `<!-- step-beyond:core:start -->` and
`<!-- step-beyond:core:end -->` markers so re-running replaces it in place.

```bash
scripts/install.sh                      # every host found in $HOME
scripts/install.sh --host codex         # one host
scripts/install.sh --project            # this repository only
scripts/install.sh --always-on          # also write the standing instruction
scripts/install.sh --dry-run            # show changes without writing
```

| | Claude Code | Codex | Hermes |
|---|---|---|---|
| User skill path | `~/.claude/skills/step-beyond/` | `~/.agents/skills/step-beyond/` | `~/.hermes/skills/step-beyond/` |
| Project skill path | `.claude/skills/step-beyond/` | `.agents/skills/step-beyond/` | none (or `skills.external_dirs`) |
| Explicit call | `/step-beyond` | `$step-beyond` or `/skills` | `/step-beyond` |
| Always-on | plugin `SessionStart` hook, or block in `CLAUDE.md` | block in `AGENTS.md` (`~/.codex/AGENTS.md` or project) | block in `~/.hermes/SOUL.md` |
| Memory | host memory when exposed, else the portable file | portable file | `~/.hermes/memories/USER.md` and `MEMORY.md` |
| Parallel work | subagents when the session exposes them | subagents when exposed, else solo | delegation when exposed, else solo |

The portable memory file is `~/.step-beyond/user-patterns.md` (created from
`templates/user-patterns.md`, never overwritten by the installer).

## Claude Code

- **Install.** As a plugin: `/plugin marketplace add aievolutionpl/step-beyond`
  then `/plugin install step-beyond@step-beyond`. The plugin ships a
  `SessionStart` hook (`hooks/hooks.json`) that adds the core instruction to
  every session. Without the plugin, run the installer; use `--always-on` to
  write the block into `CLAUDE.md`.
- **Context.** `CLAUDE.md` and repository rules are project or host
  instructions, never learned user preferences.
- **Memory.** If the session exposes a memory directory or memory tool, that is
  the single store: write trajectories, hits, misses, and open loops there in
  the same record shapes. Otherwise use the portable file. Do not write both.
- **Prediction evidence.** Recent commits, the todo list, open pull requests,
  and failing checks are strong `artifact_gap` and `session_arc` signals.
- **Doing ahead.** Local edits, tests, and drafts in the working tree are
  `AUTO`. Commits follow the user's stated git preferences; pushing, opening a
  pull request, and anything that posts to an external service are `ASK`
  unless the user already asked for them in this task.
- **Verification.** Run the project's own checks. Evidence the session already
  produced is imported into the claim ledger, not re-run for ceremony.
- **Subagents.** Execution transport only. The parent keeps permission,
  the attention budget, delivery, and memory.

## Codex

- **Install.** `scripts/install.sh --host codex` copies the skill to
  `~/.agents/skills/step-beyond/` (or `.agents/skills/` with `--project`).
  Codex selects it by description or when the user types `$step-beyond`.
- **Always-on.** `--always-on` writes the block into `~/.codex/AGENTS.md`
  (all projects) or the repository `AGENTS.md` (with `--project`). Keep the
  block short; `AGENTS.md` is loaded into every turn.
- **Context.** `AGENTS.md` files are project instructions. Nested files closer
  to the edited code take precedence; follow the host's normal precedence.
- **Sandbox and approvals.** The approval policy is the permission surface. A
  `DO_AHEAD` step must fit inside the current sandbox without requesting
  escalation. If a predicted step would need network access, writes outside
  the workspace, or an approval prompt, it is `PROPOSE`, not `DO_AHEAD`.
- **Memory.** Use the portable file unless the session exposes a memory
  facility with visible, correctable records.
- **Non-interactive runs** (`codex exec`, CI). No one can answer a question or
  accept an offer: take the safest reading, disclose assumptions in the final
  message, and convert `PROPOSE` items into a short "not done, needs your
  decision" list. Never block on a clarification.
- **Verification.** Run the commands the repository documents. When the
  sandbox blocks a check, report the claim as `partially_verified` or
  `unverified` and name the blocker.

## Hermes

- **Install.** `scripts/install.sh --host hermes` copies the skill to
  `~/.hermes/skills/step-beyond/`, or install from the repository with
  `hermes skills install aievolutionpl/step-beyond/skills/step-beyond`. It is
  then available as `/step-beyond` and through the skills list.
- **Always-on.** `--always-on` writes the block into `~/.hermes/SOUL.md`,
  which Hermes places at the top of its system prompt.
- **Memory.** Hermes owns memory. `USER.md` holds the user profile and
  `MEMORY.md` the agent's notes; both have small character limits. Store only
  the highest-value lines: confirmed constraints, the two or three strongest
  trajectories, and explicit "never" feedback. Use session search for history
  instead of copying it into memory. Do not also write the portable file.
- **Skills the agent writes.** When a multi-step workflow succeeds repeatedly,
  Hermes may save it as its own skill. That is procedure memory; keep user
  preferences out of it.
- **Messaging gateways and scheduled jobs.** Replies may arrive later or not at
  all, and scheduled runs have no reader. Anything that sends a message on the
  user's behalf to a third party is `ASK`. In scheduled runs behave as in
  Codex non-interactive mode: no questions, safest reading, proposals listed
  for later.
- **Delivery.** On chat platforms keep the `Step beyond:` and `Next:` lines to
  one short line each.

## Other hosts

Any agent that can load a Markdown skill or accept standing instructions can run
the method: copy `skills/step-beyond/` where the host discovers skills, or paste
`templates/core-injection.txt` into its system prompt. Ownership rules for hosts
with their own memory, verification, or rules are in `adapters.md`.
