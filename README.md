# 🧠 Step Beyond v3.0

> Don't ask for permission to do the obvious. Do the base task, add only the next useful thing, verify what you touched, and stop when the user's scope says stop.

Step Beyond is a portable behavioral skill for AI coding and content agents: it turns a short user request into a disciplined workflow of recall, intent expansion, baseline polish, bounded extensions, verification, delivery, and learning. It is not a model, SaaS, or benchmark leaderboard; it is an instruction package you can install into Claude, Codex, Cursor, Copilot, OpenAI Agents, or a custom loop to make proactive work operational instead of promotional.

## Quick start

Install or copy the skill, then inject the canonical core prompt from [`skills/step-beyond/templates/core-injection.txt`](skills/step-beyond/templates/core-injection.txt):

```bash
# copy the skill into a local agent skill folder
mkdir -p .claude/skills
cp -R skills/step-beyond .claude/skills/

# or inject the minimal core into a custom agent/system prompt
cat skills/step-beyond/templates/core-injection.txt
```

Use the core as the first behavioral instruction. Keep the full skill folder available so the agent can load memory, verification, slop, domain, and subagent references only when needed.

## Installation examples

### Claude

```text
/plugin marketplace add aievolutionpl/step-beyond
/plugin install step-beyond@step-beyond
```

Manual project install:

```bash
mkdir -p .claude/skills
cp -R skills/step-beyond .claude/skills/
```

### Codex

```bash
codex exec "build the requested feature" \
  --custom-instructions skills/step-beyond/templates/core-injection.txt
```

Or paste the core into `~/.codex/config.toml` as additional instructions.

### Cursor

```bash
cat skills/step-beyond/templates/core-injection.txt > .cursorrules
```

If you already have Cursor rules, append the file instead of replacing them.

### Copilot

```bash
mkdir -p .github
cat skills/step-beyond/templates/core-injection.txt > .github/copilot-instructions.md
```

Keep repository-specific build, test, and style rules above or below the Step Beyond block.

### OpenAI Agents

```python
from agents import Agent

with open("skills/step-beyond/templates/core-injection.txt", "r", encoding="utf-8") as f:
    step_beyond = f.read()

agent = Agent(
    name="builder",
    instructions=step_beyond + "\n\nUse available tools to implement, verify, and report only observed results.",
)
```

For multi-agent setups, inject the core into the orchestrator and map builder/extender/verifier roles from [`skills/step-beyond/references/subagents.md`](skills/step-beyond/references/subagents.md).

## Benchmark examples

Step Beyond has two different check types. **Package-readiness checks** inspect whether the repository is installable, internally linked, and complete enough to ship. **Model-behavior benchmarks** run the same task with and without the skill and score the agent's behavior: scope control, verification, honest claims, memory use, and bounded additions.

### Run static package readiness

```bash
# required package files exist
test -f SPEC.md && test -f skills/step-beyond/SKILL.md && test -f skills/step-beyond/templates/core-injection.txt

# README links resolve to real paths in this checkout
test -e benchmark && test -e adapters && test -e skills/step-beyond/SKILL.md

# obvious unverified percentage claims are absent from the main README
! rg -n "[0-9]+–[0-9]+%|>[0-9]+%|~[0-9]+%" README.md
```

### Run a behavioral A/B benchmark with API environment variables

```bash
# choose the model provider used by your harness
export OPENAI_API_KEY="sk-..."
export STEP_BEYOND_MODEL="gpt-5.5"
export STEP_BEYOND_CONTROL_INSTRUCTIONS=""
export STEP_BEYOND_TREATMENT_INSTRUCTIONS="$(cat skills/step-beyond/templates/core-injection.txt)"

# run one control and one treatment pass, then score against the rubric
python benchmark/run_ab.py \
  --cases evals/cases.md \
  --results-dir evals/results \
  --control-env STEP_BEYOND_CONTROL_INSTRUCTIONS \
  --treatment-env STEP_BEYOND_TREATMENT_INSTRUCTIONS
```

If your checkout does not include `benchmark/run_ab.py`, use [`evals/README.md`](evals/README.md) as the manual protocol: fresh agent per case, control run for A-series cases, score every MUST and MUST-NOT, and save results under `evals/results/`.

## Core links

- [SPEC.md](SPEC.md) — package contract and behavioral specification.
- [benchmark/](benchmark/) — benchmark harness location and notes.
- [adapters/](adapters/) — integration adapters and adapter notes.
- [skills/step-beyond/SKILL.md](skills/step-beyond/SKILL.md) — full skill entrypoint.
- [skills/step-beyond/templates/core-injection.txt](skills/step-beyond/templates/core-injection.txt) — canonical injectable prompt.
- [evals/](evals/) — manual behavioral regression cases and recorded results.

## What the skill actually enforces

```text
RECALL  → read user/project patterns when available
EXPAND  → turn the request into an intent brief before building
BUILD   → complete the base task with L1 polish
EXTEND  → add at most 3 L2 items and at most 1 L3 item, only when useful
VERIFY  → run, render, click, parse, or inspect before making claims
DELIVER → lead with the base result; name additions briefly
LEARN   → persist accepted/rejected patterns when memory exists
STOP    → obey "just", "only", "stop", "minimal", and frustration signals
```

The package is deliberately conservative: additions have ceilings, STOP language wins over proactivity, unverifiable additions become suggestions, and final claims must match observed checks.

## Repository map

```text
step-beyond/
├── SPEC.md
├── benchmark/
├── adapters/
├── skills/step-beyond/
│   ├── SKILL.md
│   ├── references/
│   └── templates/core-injection.txt
├── evals/
│   ├── README.md
│   ├── cases.md
│   └── results/
├── examples/
├── README.md
└── README_PL.md
```

## License

MIT. Use it, adapt it, and keep the verification bar higher than the slogans.
