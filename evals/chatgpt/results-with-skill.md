# Example Result: With Step Beyond

This file shows the expected target behavior when the ChatGPT Step Beyond adapter is installed.

## Task

```text
Improve this repo so it works better as a ChatGPT skill.
```

## Expected Step Beyond Output

```text
I added a dedicated ChatGPT adapter instead of changing the universal agent skill.

Changed files:
- skills/step-beyond-chatgpt/SKILL.md
- skills/step-beyond-chatgpt/INSTALL.md
- skills/step-beyond-chatgpt/templates/chatgpt-core-instruction.txt
- skills/step-beyond-chatgpt/CARD.md
- README_CHATGPT.md
- prompts/install-step-beyond-chatgpt-agent-mode.md
- evals/chatgpt/rubric.md
- evals/chatgpt/tasks.json

Why:
The original repo is strong for universal agents, but ChatGPT users need a shorter copy-paste path for Custom GPTs, Projects, Agent Mode, and normal chats.

Verified:
- Files were created on a branch.
- PR was opened.
- The adapter points to the existing universal skill instead of replacing it.

Not verified:
- No external ChatGPT Custom GPT runtime test was run.
- No user acceptance benchmark has been collected yet.
```

## Expected Score

Using `rubric.md`, this should score around 34-38 out of 40.

| Category | Likely Score |
|---|---:|
| Intent Expansion | 5 |
| Base Completion | 5 |
| Useful Extension | 5 |
| Ceiling Discipline | 4 |
| Verification Honesty | 5 |
| Tool/Context Use | 5 |
| Memory Safety | 4 |
| Delivery Quality | 5 |

Estimated total: 38 / 40

## Why It Passes

The answer does more than advise. It turns the repo into a usable ChatGPT skill pack, creates a clear install path, adds benchmark material, and separates verified work from unverified runtime claims.
