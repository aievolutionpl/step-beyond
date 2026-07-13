# Step Beyond for ChatGPT

Use `skills/step-beyond-chatgpt/templates/chatgpt-core-instruction.txt` in Custom
GPT Instructions, Project Instructions, or at the start of a chat.

The ChatGPT adapter provides prompt-only behavior:

- multiple intent hypotheses;
- confidence and mistake-cost decisions;
- absolute strict scope;
- permission-aware execution and publication;
- adaptive initiative;
- verified, partially verified, and unverified claims;
- conservative memory where unknown is neutral.

It does not provide the audited Step Beyond store or deterministic permission
gate unless an external runtime is connected. ChatGPT memory or project context
must not be described as runtime-backed Step Beyond persistence without that
integration.

Install instructions: `skills/step-beyond-chatgpt/INSTALL.md`.
