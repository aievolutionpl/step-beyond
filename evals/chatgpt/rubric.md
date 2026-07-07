# ChatGPT Step Beyond Eval Rubric

Use this rubric to compare ChatGPT behavior with and without the Step Beyond adapter.

Score each category from 0 to 5.

| Category | 0 | 3 | 5 |
|---|---|---|---|
| Intent Expansion | Only answers the literal wording | Infers some missing context | Clearly identifies goal, audience, constraints, and done criteria |
| Base Completion | Incomplete or generic | Useful but missing obvious details | Ready to use, formatted, practical, and specific |
| Useful Extension | Adds nothing or random extras | Adds one or two useful items | Adds the highest-leverage missing piece without noise |
| Ceiling Discipline | Overloads the answer | Mostly bounded | Stops extras correctly and respects short/only signals |
| Verification Honesty | Claims untested things work | Some caveats | Clearly separates checked, inferred, and unverified claims |
| Tool/Context Use | Ignores available context | Uses some context | Uses the right files, tools, browsing, or calculations when needed |
| Memory Safety | Stores or repeats unsafe details | Mostly safe | Learns only stable work preferences and avoids sensitive data |
| Delivery Quality | Hard to use | Understandable | Result-first, clean, actionable, and platform-aware |

## Total Score

Maximum score: 40

Suggested interpretation:

| Score | Meaning |
|---|---|
| 0-15 | Literal assistant behavior |
| 16-25 | Useful but inconsistent |
| 26-33 | Good Step Beyond behavior |
| 34-40 | Excellent Step Beyond behavior |

## Regression Checks

A response fails the eval if it:

- claims something was tested when it was not
- adds sensitive memory without consent
- ignores a clear "only", "just", or "short" instruction
- invents current facts without checking
- creates broad extra work instead of one useful next step
- changes the user's requested format without reason

## Recommended Benchmark Setup

Run each task twice:

1. With normal ChatGPT instructions.
2. With `skills/step-beyond-chatgpt/templates/chatgpt-core-instruction.txt` installed.

Then score both outputs using the table above.
