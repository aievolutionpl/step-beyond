# Step Beyond for ChatGPT

**Version 4.0.0-alpha.2** · Prompt-only adapter for Custom GPT, Project
Instructions, Agent Mode, and regular chats

[Main README](README.md) · [Polski](README_PL.md) · [Specification](SPEC.md)

## Every task. One step further.

Step Beyond gives ChatGPT a standing instinct to understand the outcome behind
the prompt, complete the missing pieces, predict the next useful move, and verify
the result before delivery.

## The Step Beyond instinct

For every meaningful task, the agent asks:

1. What outcome does the user need?
2. What necessary piece is missing from the literal request?
3. What will the user probably need next?
4. Am I authorized to act on it?
5. What evidence proves the result?

**Every task gets Step Beyond reasoning. Extra work happens only when it is useful, safe, permitted, and verifiable.**

The ChatGPT package compresses this behavior into instructions suited to a chat
host while preserving authority, strict scope, and evidence boundaries.

## Operating mode

The bundled ChatGPT adapter is **prompt-only**. It can guide reasoning and tool
use, but prompt text cannot enforce durable state, shared policy, permission
gates, or audit records.

Call a ChatGPT setup **runtime-backed** only when an external Step Beyond runtime
implements the required adapter operations. Host memory or project context alone
does not provide runtime-backed Step Beyond persistence.

## ⚡ What Your Agent Gains

| | Superpower | The instinct it installs |
|---|---|---|
| 🧠 | **RECALL** | Uses relevant chat, project, and confirmed user context without promoting guesses |
| 🔎 | **SCAN** | Reads available files and sources before describing their contents |
| 🔍 | **EXPAND** | Considers distinct intended outcomes before choosing a response |
| 🎨 | **POLISH** | Produces a complete professional baseline inside the requested scope |
| ➕ | **EXTEND** | Selects optional work by value, authority, cost, risk, and verifiability |
| 🔮 | **ANTICIPATE** | Recognizes a likely next need without treating prediction as permission |
| ✅ | **VERIFY** | Uses tool observations to support claims and labels unchecked scope |
| 📈 | **SELF-IMPROVE** | Treats observable outcomes as evidence and keeps `unknown` neutral |

These labels describe capabilities, not a second pipeline.

```text
CONTEXT → INTENT → DECIDE → BUILD → INITIATIVE → EXECUTE → VERIFY → DELIVER → LEARN
```

| Capability label | Canonical lifecycle stage |
|---|---|
| RECALL | CONTEXT |
| SCAN | CONTEXT |
| EXPAND | INTENT + DECIDE |
| POLISH | BUILD |
| EXTEND | INITIATIVE + EXECUTE |
| ANTICIPATE | INITIATIVE + DECIDE |
| VERIFY | VERIFY |
| SELF-IMPROVE | LEARN |

## Install

Use the files under [`skills/step-beyond-chatgpt/`](skills/step-beyond-chatgpt/):

| Use case | File |
|---|---|
| Custom GPT or Project Instructions | [`templates/chatgpt-core-instruction.txt`](skills/step-beyond-chatgpt/templates/chatgpt-core-instruction.txt) |
| Skill package | [`SKILL.md`](skills/step-beyond-chatgpt/SKILL.md) |
| Polish skill package | [`SKILL_PL.md`](skills/step-beyond-chatgpt/SKILL_PL.md) |
| Setup guidance | [`INSTALL.md`](skills/step-beyond-chatgpt/INSTALL.md) |

Paste the core instruction into the relevant instruction field. Keep higher
priority platform, organization, project, and user instructions intact.

## Behavior

- Build multiple materially different intent hypotheses for meaningful requests.
- Compare confidence with mistake cost before acting or asking one question.
- Treat `only`, `just`, `nothing else`, `tylko`, and `nic więcej` as strict scope.
- Separate understanding, proposing, local execution, sending, and publication.
- Request permission for public, expensive, destructive, credential-related,
  security-sensitive, or irreversible actions.
- Report `verified`, `partially_verified`, or `unverified` at the scope supported
  by actual tool observations.
- Keep project facts separate from user preferences.
- Treat silence and unobservable usage as `unknown`.

## Memory and host tools

ChatGPT memory, project files, browsing, code execution, and connectors vary by
product configuration. Detect what the current chat exposes. Do not claim a
file was read, a command ran, or a memory record persisted without an observation
from that capability.

When an external runtime is connected, assign one store as the user-model owner
and one ledger entry to each material claim. The
[adapter reference](skills/step-beyond/references/adapters.md) explains how to
avoid duplicate memory and verification logic.

## Evidence limits

The repository's deterministic replay tests runtime policy and eval plumbing. It
does not prove ChatGPT model behavior. A ChatGPT configuration needs repeated
runs with the named model, instruction version, tools, parameters, transcripts,
and artifacts before its behavior can carry `verified` status.

The benchmark contract and release-gate rules are in
[`evals/README.md`](evals/README.md). Start new reports from
[`evals/results/TEMPLATE.md`](evals/results/TEMPLATE.md) and leave cases as
`NOT RUN` until evidence exists.

## Attribution

Step Beyond is created by
[**AI EVOLUTION POLSKA**](https://www.aievolutionpolska.pl/).

[https://www.aievolutionpolska.pl/](https://www.aievolutionpolska.pl/) · [https://aievolutionlabs.io/](https://aievolutionlabs.io/)

MIT License.
