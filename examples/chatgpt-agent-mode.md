# Example: ChatGPT Agent Mode

This example shows how Step Beyond should behave inside ChatGPT Agent Mode.

## User Request

```text
Przerób to repo pod skill do ChatGPT:
https://github.com/aievolutionpl/step-beyond/tree/main
```

## Bad: Literal Agent

```text
This repo is about Step Beyond. You can use it in ChatGPT by pasting the instructions.
```

Why this is weak:

- no repo inspection
- no actual file proposal
- no ChatGPT-specific adapter
- no install path
- no examples
- no verification note
- no pull request or patch

## Good: Step Beyond Agent

Internal trace:

```text
CONTEXT:
The user wants Step Beyond to become a practical ChatGPT skill. Inspect the repo
when browsing tools are actually available; otherwise disclose that limitation.

INTENT:
Repo contains a universal `skills/step-beyond/SKILL.md`, references, templates, examples, README, and SPEC. Main skill already covers frameworks, memory, scan, verification, and self-improvement.

DECIDE:
The typed request says "przerób". The real intent is not another explanation. The repo needs a ChatGPT-ready adapter that can be pasted into Custom GPT, Project Instructions, or Agent Mode.

Ask before creating a branch, pushing, or opening a pull request. Local draft files are reversible.

BUILD:
Create `skills/step-beyond-chatgpt/SKILL.md` with a compact ChatGPT behavior layer.

INITIATIVE:
+install guide
+core template
+agent-mode example

EXECUTE:
Create only the locally authorized files. Publishing remains a separate permission.

VERIFY:
Confirm files were created in a branch or provide a patch. Do not claim the PR is merged unless it is merged.

DELIVER:
Give the branch/PR, list changed files, explain the practical effect, and mention what was not tested.
```

## Result

The agent should create or propose these files:

```text
skills/step-beyond-chatgpt/SKILL.md
skills/step-beyond-chatgpt/INSTALL.md
skills/step-beyond-chatgpt/templates/chatgpt-core-instruction.txt
examples/chatgpt-agent-mode.md
```

## Why

The full Step Beyond skill is powerful, but ChatGPT needs a smaller adapter. ChatGPT users usually need instructions they can paste into Custom GPT, Project Instructions, or Agent Mode. A separate adapter keeps the main universal skill intact while making the repo easier to use for normal ChatGPT workflows.

## What Triggers Step Beyond Here

```text
repo improvement
skill adaptation
ChatGPT instructions
Agent Mode
Custom GPT
Project Instructions
przerób repo
make this usable
```
