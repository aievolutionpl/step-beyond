# Agent Mode Prompt: Install Step Beyond for ChatGPT

Use this prompt when you want ChatGPT Agent Mode or another repo-capable agent to apply the ChatGPT adapter.

```text
Install and apply the Step Beyond ChatGPT skill in this workspace.

Repository:
https://github.com/aievolutionpl/step-beyond

Read these files first:
- README_CHATGPT.md
- skills/step-beyond-chatgpt/SKILL.md
- skills/step-beyond-chatgpt/templates/chatgpt-core-instruction.txt

Your task:
1. Detect where standing instructions should live in this workspace.
2. Add the Step Beyond ChatGPT core instruction there.
3. Do not duplicate an existing Step Beyond block. Update it in place if it already exists.
4. Add a short smoke test prompt to the workspace if there is a docs or prompts folder.
5. Tell me exactly what file you changed.
6. Tell me what you verified and what remains unverified.

Rules:
- Keep extras bounded.
- Do not claim tests passed unless you ran them.
- Do not store secrets, tokens, passwords, or private IDs.
- Do not overwrite project-specific instructions. Append Step Beyond below them unless the file clearly says otherwise.
```

## Expected Result

The agent should return something like:

```text
Installed Step Beyond in AGENTS.md.
Updated existing instruction block instead of duplicating it.
Added prompts/step-beyond-smoke-test.md.
Verified the files exist.
Did not run app tests because this was a docs-only change.
```
