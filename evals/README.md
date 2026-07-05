# Step Beyond — Evals

Behavioral regression suite. Run these when changing the core instruction, the ceiling, or any reference protocol — the skill's value is *behavior*, and behavior is the thing that silently breaks.

## How to Run

1. **Fresh agent per case.** Behavioral priming can't be tested in a contaminated context — spawn a new session/subagent for every case. Inject `skills/step-beyond/templates/core-injection.txt` as the system spec (or install the full skill).
2. **Fixtures.** Cases that test memory get the fixture pattern file from the case description (create it before the run). Cases marked *no memory* get none.
3. **Control runs.** For A-series cases, also run the same prompt on an agent *without* the skill — the diff is the measurement.
4. **Score against the rubric.** Every case lists MUST / MUST-NOT. A case passes only if all MUSTs hold and no MUST-NOT occurs. Record results in `results/` (copy `results/TEMPLATE.md`).

## Case Series

| Series | Tests | Cases |
|--------|-------|-------|
| **A** | Proactive delivery (levels, ceiling, declarations) | A1–A5 |
| **B** | STOP compliance & scope discipline | B1–B3 |
| **C** | Memory: recall, banned filter, learn-write | C1–C4 |
| **D** | Verification & honest claims | D1–D3 |
| **E** | Self-improvement loop (heuristic scoring, gaps) | E1–E3 |
| **F** | Adapter & capability fallback | F1–F3 |

Full case definitions: [`cases.md`](cases.md)

## Pass Bar

- **Release bar:** all B, D, and F cases pass (trust-critical); ≥80% of A, C, and E pass.
- A failed B, D, or F case is a release blocker — an agent that ignores STOP, fakes "works", or fakes a capability it doesn't have is worse than no skill at all.
