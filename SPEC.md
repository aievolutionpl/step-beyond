# Step Beyond Specification

Step Beyond is a behavioral instruction package for agents. The package contract is:

1. Load `skills/step-beyond/SKILL.md` as the full skill entrypoint.
2. Use `skills/step-beyond/templates/core-injection.txt` as the canonical minimal injection text.
3. Apply the pipeline in order: RECALL, EXPAND, BUILD, EXTEND, VERIFY, DELIVER, LEARN.
4. Enforce ceilings: bounded L2/L3 additions, STOP-language compliance, and no unverifiable shipped additions.
5. Report only claims backed by observed checks or clearly mark them as unverified.
6. Persist accepted, rejected, ignored, and open-loop patterns only when a memory store is available.

Benchmarking separates static package readiness from model behavior:

- Package readiness checks repository files, links, installation paths, and claim hygiene.
- Model behavior benchmarks compare control and treatment agent runs against the eval rubric in `evals/cases.md`.
