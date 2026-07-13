# Memory & Pattern Learning — Step Beyond Example

How the same request gets better across three sessions, because the agent remembers. Full protocol: `skills/step-beyond/references/memory.md`. (Validated by a real eval run — see `evals/results/2026-07-04-baseline.md`.)

> **Scope note:** this trace shows the per-user **Memory** loop (brand, bans, trajectories). For the separate per-agent **Self-Improvement** loop — the agent scoring and pruning its own heuristics, independent of any one user — see [`self-improvement-loop.md`](self-improvement-loop.md).

---

## Session 1 — Cold Start (no memory yet)

```
User: "Zrób mi landing page dla mojego brandu"

Agent (internal):
  CONTEXT → no user-model store found; current prompt and project only.
  INTENT  → "landing page for a brand" = hero, offer, CTA, contact path.
           Brand colors unknown → ask once, remember forever.
  DECIDE → proceed with a reversible local draft; ask before publication.
  BUILD  → responsive landing, semantic HTML, real fonts.
  INITIATIVE → score contact, favicon, and OG candidates for this request.
  EXECUTE → build the base and selected AUTO local candidates.
  VERIFY → opened, clicked, 375px checked. Console clean.

Agent (delivered): landing +contact, favicon, OG

User reaction: uses contact page, deploys. Ignores OG image.
Also says: "dark navy i złoty to nasze kolory, i pisz do mnie po polsku"

LEARN → creates step-beyond/patterns.md:
  Profile:  brand: dark navy + gold · language: PL
  Watching: web: +contact (accepted 1×) · web: +OG (ignored 1×)
```

## Session 2 — Patterns Forming

```
User: "Potrzebuję stronę z cennikiem"

Agent (internal):
  CONTEXT → confirmed navy+gold and PL; observed contact adoption; OG outcome unknown.
  INTENT → pricing page for the same brand → match existing site's
           conventions, navy+gold applied silently (no re-asking!)
  INITIATIVE → score an FAQ section as a new candidate
           +contact link in pricing CTA (Watching says they value contact)
           NOT +OG (one ignore — deprioritized, not dead yet)
  VERIFY → rendered, prices sum correctly vs. input, mobile checked

User reaction: "idealnie" + uses FAQ.

LEARN → patterns.md updated:
  Reinforced: web: +contact-path (accepted 2×) ← PROMOTED
  Watching:   web: +FAQ (accepted 1×, strong signal)
  Trajectories: landing → pricing (seen 1×)
```

## Session 3 — Prediction Kicks In

```
User: "Dodaj sekcję z opiniami klientów"

Agent (internal):
  CONTEXT → confirmed contact-path preference. Observed trajectory: landing → pricing.
           This user is building out a full brand site, page by page.
  INTENT → testimonials section, navy+gold, PL copy, marked placeholders
           clearly marked (no fake social proof — that's slop)
  INITIATIVE → treat a meta/SEO audit as a candidate, disclose its scope and
               ask before expanding into all pages if that exceeds authority.
  VERIFY → section renders, carousel works on mobile, no fake data shipped

Agent (delivered): "Sekcja opinii gotowa (placeholdery oznaczone do podmiany).
                    Proponuję audyt meta/SEO wszystkich stron przed deployem."

User reaction: "o, super, właśnie miałem o to pytać"
```

**That last line is the entire point of the skill.**

---

## What Made the Difference

| Session 1 | Session 3 |
|-----------|-----------|
| Asks about brand colors | Applies them silently |
| Generic domain candidates | Candidates informed by confirmed outcomes |
| No trajectory evidence | A next-step proposal tied to observed trajectory |
| Wrong language guess possible | PL from Profile |
| Cold-start selection — not measured | Memory-informed selection — not measured |

## What the Agent Did NOT Do

- Did not classify silence about +OG as rejection; its outcome remained unknown
- Did not store anything private — only work preferences
- Did not write to memory every message — batched at session end
- Did not let memory override words: had the user said "in English this time",
  English wins (explicit > memory > environment > self-notes > defaults)
