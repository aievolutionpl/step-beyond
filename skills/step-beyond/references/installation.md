# 📦 Installation — Per Framework

> **Architecture:** every host below is one thin adapter over the same core — see `references/adapters.md` for the capability contract (memory · self-notes · subagents · runtime · injection) and how each degrades gracefully. This page is the practical setup; that page is the *why*.

## Core Injection (All Frameworks)

The canonical injectable core lives in one file — **`templates/core-injection.txt`** (~460 tokens, identical to the Core Instruction in SKILL.md). Inject it as the FIRST system message or skill. Don't fork the text per framework; when the core changes, it changes in one place.

**Whatever the host, wire the five capability slots once at session start** (`references/adapters.md` §1): memory, self-notes, subagents, runtime, injection. Any slot the host lacks → its documented fallback. The pipeline is identical across all of them.

---

## Self-Install (agent-driven) — recommended

**If you are an AI agent reading this, you can install Step Beyond into the current workspace yourself.** The user gave you the repo link precisely so they don't have to know where their host keeps its config — do the wiring for them. Run these five steps.

> **After installing, run the onboarding ritual** in [`references/onboarding.md`](onboarding.md): the six beats (detect → wire → seed → calibrate → announce → activate) turn a fresh install into an agent that already knows its powers, its host's fallbacks, and the state of the user's project from turn one. Install puts the files in place; onboarding wakes the agent up.

**1. DETECT the host and its standing-instructions mechanism.** Pick the first that matches your runtime:

| Host signal | Install target |
|-------------|----------------|
| Claude Code / Agent SDK (a `.claude/` dir exists) | `.claude/skills/` (project) or `~/.claude/skills/` (global) |
| opencode / OpenClaw / Amp / Aider / Cline / Roo | `AGENTS.md` in the repo root (or the tool's rules file) |
| Cursor / Windsurf | `.cursorrules` / `.windsurfrules` |
| Codex CLI | `~/.codex/config.toml` or a `--custom-instructions` file |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Gemini CLI | `GEMINI.md` (project or `~/.gemini/`) |
| Custom / unknown loop | inject as the first system message |

**2. INSTALL by the matching method.**
- **Skills-dir host** → copy the whole `skills/step-beyond/` directory in. Progressive disclosure keeps the token cost near zero until a reference is needed. On Claude Code you may instead run the plugin commands below.
- **Instruction-file host** → paste the core block (§Core Injection / `templates/core-injection.txt`, ~460 tokens) into that file, wrapped in `<!-- step-beyond:core:start -->` … `<!-- step-beyond:core:end -->` markers so you can update it in place later.

**3. WIRE memory + self-notes** (§Wiring Memory below): point RECALL/LEARN at `step-beyond/patterns.md` and the self-improvement loop at `step-beyond/self-notes.md` — or the user's Obsidian / MCP / mem0 store if one is available. No writable store → session-only mode; offer to create the files once.

**4. VERIFY the install.** Re-read the file or directory you wrote and confirm the marked block or the `skills/step-beyond/` tree is present. Do not claim "installed" without observing it.

**5. REPORT & ACTIVATE.** Tell the user the exact method and path you used, then run the Step Beyond pipeline from the very next task.

> **Idempotent:** if a `step-beyond:core` marker block or a `skills/step-beyond/` directory already exists, **update it in place** — never duplicate. Re-running the install should upgrade, not stack.

---

## Claude Code (Plugin — recommended)

The repo is a Claude Code plugin marketplace. Two commands, done:

```
/plugin marketplace add aievolutionpl/step-beyond
/plugin install step-beyond@step-beyond
```

Claude loads SKILL.md when relevant and pulls `references/` on demand — progressive disclosure keeps the token cost near zero until needed.

## Claude Code / Claude Agent SDK (manual skill install)

```bash
# Personal (all projects)
git clone https://github.com/aievolutionpl/step-beyond /tmp/step-beyond &&
  cp -r /tmp/step-beyond/skills/step-beyond ~/.claude/skills/

# Project-scoped
git clone https://github.com/aievolutionpl/step-beyond /tmp/step-beyond &&
  cp -r /tmp/step-beyond/skills/step-beyond .claude/skills/
```

Or the minimal footprint version — paste into `CLAUDE.md`:

```markdown
## 🧠 Step Beyond

Pipeline (every request): recall memory → expand intent → build base + L1 →
extend (L2 max 3, L3 max 1) → VERIFY (run it, slop scan, honest claims) →
deliver → learn (write patterns back to memory).

L1 (ALWAYS, SILENT): Fix incompleteness. No void. No slop.
L2 (<15% time, MAX 3): One missing piece. "+name"
L3 (<30% time, MAX 1): Predict next request. "+name (~Xs)"

CEILING: 5 total/session. STOP: "just X", "only X", "stop", "enough".
Never ship unverified. Explicit instruction > memory > defaults.
Memory file: step-beyond/patterns.md (or your vault) — read at start, write at end.
```

## Hermes Agent

```yaml
# config.yaml
skills:
  - step-beyond  # FIRST — behavioral foundation before all other skills
```

## Codex CLI

```bash
# Via custom instructions file
codex exec "your prompt" --custom-instructions step-beyond.md

# Or in ~/.codex/config.toml
[instructions]
additional = """
Step Beyond: recall memory → expand intent → build → extend → VERIFY → learn.
L1 always (silent). L2 max 3 (+name). L3 max 1 (+name ~Xs). Ceiling 5.
Never ship unverified. STOP: just/only/stop/enough.
"""
```

## OpenClaw

OpenClaw reads a project `AGENTS.md` and a system prompt. Put the core in `AGENTS.md` so it loads first, before any task:

```markdown
# AGENTS.md

<!-- step-beyond:core:start -->
Step Beyond — proactive pipeline for EVERY task:
recall memory + scan environment → expand intent → build base + L1 →
extend (L2 max 3, L3 max 1) → VERIFY (run it, slop scan, honest claims)
→ deliver → learn + self-improve.

L1 always (silent). L2 "+name". L3 "+name (~Xs)". CEILING 5/session.
STOP: "just X", "only X", "stop", "enough". Never ship unverified.
Memory: step-beyond/patterns.md. Self-notes: step-beyond/self-notes.md.
Environment: files/git/config, no store needed, never overrides Banned.
Explicit instruction > user memory > environment > agent self-notes > defaults.
<!-- step-beyond:core:end -->
```

Capability slots (`references/adapters.md`): memory + self-notes → `step-beyond/*.md` in the repo; subagents → solo (Fresh-Eyes Protocol) unless OpenClaw exposes spawning; runtime → its shell. For the full ~460-token core, paste `templates/core-injection.txt` into the marked block instead of the summary above.

## opencode

opencode uses the `AGENTS.md` convention — same block as OpenClaw above. Drop it in the repo root (or `~/.config/opencode/AGENTS.md` for all projects) and it loads as the standing instruction for every session.

## Gemini CLI

Put the core in `GEMINI.md` (project or `~/.gemini/`):

```markdown
# GEMINI.md
Step Beyond: recall → expand → build + L1 → extend (L2×3, L3×1) → VERIFY → learn + self-improve.
L1 silent. Ceiling 5. STOP: just/only/stop/enough. No unbacked "works"/"tested".
Memory + self-notes in step-beyond/*.md. Explicit > memory > self-notes > defaults.
```

## Amp / Aider / Cline / Roo

All read a project rules or system-prompt file. Paste the same marked core block (`AGENTS.md`, `.clinerules`, or the tool's rules file). Wire memory/self-notes to `step-beyond/*.md`; runtime is the tool's shell/edit loop; subagents default to solo unless the tool supports them.

## Cursor / Windsurf

```markdown
# .cursorrules

## 🧠 Step Beyond

Pipeline: recall → expand intent → build → extend → VERIFY → learn.

L1 (ALWAYS, SILENT): types, errors, edge cases. No bare functions.
L2 (<15%, MAX 3): +tests, +docs, +error states
L3 (<30%, MAX 1): +Storybook, +i18n, +integration example

VERIFY: run the code before claiming it works. No unbacked "works"/"tested".
CEILING: 5/session. STOP: "just fix this", "minimal", "quick".
```

## GitHub Copilot

```markdown
# copilot-instructions.md

Step Beyond: L1 always (types, errors — silent). L2 max 3 (+tests, +docs).
L3 max 1 (+Storybook, +i18n). Verify before claiming: run it or say untested.
STOP: "just code", "minimal", "quick fix".
```

## Custom Agent / ReAct Loop

```python
# Inject templates/core-injection.txt as the FIRST system message,
# before user context. If your loop has tool access, wire:
#   memory_read()  → pipeline step 0 (RECALL)
#   memory_write() → pipeline step 6 (LEARN)
#   spawn_agent()  → references/subagents.md roles
SYSTEM = open("step-beyond/templates/core-injection.txt").read()
```

## OpenAI Agents SDK / CrewAI / AutoGen / LangGraph

- Inject the Core Injection block into the **orchestrating** agent's instructions.
- Map roles from `references/subagents.md`: builder / extenders / verifier as
  handoffs (Agents SDK), crew members (CrewAI), or graph nodes (LangGraph).
- Keep the verifier's context fresh: pass it the deliverable + checklists,
  never the builder's transcript (the Verifier Firewall).

---

## Wiring Memory (all frameworks)

Step Beyond's learning persists through **whatever memory the platform has** — see `references/memory.md` for the full protocol. Quick map:

| Platform has… | Wire RECALL/LEARN to |
|---------------|---------------------|
| Obsidian vault (via MCP or filesystem) | `{vault}/step-beyond/patterns.md` |
| Memory MCP server / mem0 | document keyed `step-beyond:patterns` |
| CLAUDE.md / AGENTS.md | marked section, ≤40 lines, overflow to linked file |
| Just a filesystem | `step-beyond/patterns.md` in the workspace |
| Nothing persistent | session-only tracking; offer to create the file once |

**Two ledgers, not one.** Alongside the per-user pattern file, wire the agent's own **self-notes** (`references/self-improvement.md`) — heuristic scores, verify gaps, slop caught late. Store it separately (`step-beyond/self-notes.md` or key `step-beyond:self-notes`); it holds heuristics only, never user data, and is portable across users. No writable store → run the self-improvement loop session-scoped.
