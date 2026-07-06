# Install Step Beyond in ChatGPT

This guide installs the ChatGPT-ready adapter of Step Beyond.

Use this when you want the behavior inside ChatGPT, Custom GPTs, Projects, or Agent Mode without setting up a separate agent framework.

## Option 1: Custom GPT

1. Open GPT Builder.
2. Create or edit your GPT.
3. Open the Instructions field.
4. Paste the block from `templates/chatgpt-core-instruction.txt`.
5. Add any project-specific rules below it.
6. Save.

Recommended extra line:

```text
When the user asks for content, code, research, files, or strategy, run Step Beyond silently and deliver the practical result first.
```

## Option 2: ChatGPT Project

1. Create or open a Project.
2. Open Project Instructions.
3. Paste `templates/chatgpt-core-instruction.txt`.
4. Add project rules, brand rules, audience, tone, file formats, banned outputs, and recurring workflows.
5. Upload reference files if the project depends on them.

Good for:

- marketing projects
- client delivery systems
- codebase support
- research workspaces
- content pipelines
- education communities

## Option 3: ChatGPT Agent Mode

Paste this into Agent Mode before giving the task:

```text
Use the Step Beyond ChatGPT skill from this repo:
https://github.com/aievolutionpl/step-beyond

Read `skills/step-beyond-chatgpt/SKILL.md` and apply it to this task.
Work one step ahead, but keep extras bounded. Verify what you can. Do not claim anything is tested unless you tested it.
```

Then give the real task.

## Option 4: Normal Chat

Paste the quick core once at the top of a chat:

```text
Use Step Beyond behavior for this chat. Complete the real intent, verify what you can, add only the useful missing piece, and keep the final answer practical.
```

This does not persist like a Custom GPT or Project, but it works for a single thread.

## Smoke Test

After installation, run:

```text
Use Step Beyond. I need a landing page for a local fireplace installer. Give me what you would build, what you would add, what you would verify, and what you would remember for next time.
```

A good response should:

- expand the task into a business outcome
- include contact path, mobile, CTA, trust proof, and basic SEO
- avoid adding unlimited extras
- mark verification honestly
- remember only stable workflow preferences

## Rules To Keep It Safe

Step Beyond should not become noisy.

Keep these rules active:

```text
One useful missing piece beats ten random ideas.
No unverified claims.
No secret storage.
No sensitive memory.
No hidden background promises.
No extras when the user asks for short, only, just, or no extra.
```

## Best Folder To Use

Use this folder for ChatGPT:

```text
skills/step-beyond-chatgpt/
```

Use the full universal version for coding agents and custom runtimes:

```text
skills/step-beyond/
```
