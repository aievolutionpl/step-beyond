# Baseline: Without Step Beyond

This file describes the behavior commonly seen when the Step Beyond adapter is not installed.

## Task

```text
Improve this repo so it works better as a ChatGPT skill.
```

## Typical Literal Output

```text
You can improve the repo by adding clearer documentation, examples, and instructions for ChatGPT. You should also add a section explaining how to use it in Custom GPTs and Projects.
```

## Problems

- The repo is not inspected.
- No actual file structure is proposed.
- No copy-paste instruction is created.
- No install guide is added.
- No benchmark exists.
- No verification status is given.
- The response is advice, not implementation.

## Expected Score

Using `rubric.md`, this baseline would usually score around 12-18 out of 40.

| Category | Likely Score |
|---|---:|
| Intent Expansion | 2 |
| Base Completion | 2 |
| Useful Extension | 2 |
| Ceiling Discipline | 3 |
| Verification Honesty | 2 |
| Tool/Context Use | 0 |
| Memory Safety | 4 |
| Delivery Quality | 3 |

Estimated total: 18 / 40

## What Step Beyond Should Improve

The Step Beyond version should inspect the repo, add a ChatGPT adapter, add installation docs, add a core prompt, add examples, add evals, and clearly state what was changed and what was not verified.
