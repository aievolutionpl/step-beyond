# Memory & Pattern Learning — Step Beyond Example

How the same request gets better across three sessions, because the agent remembers. Full protocol: `skills/step-beyond/references/memory.md`. (Validated by a real eval run — see `evals/results/2026-07-04-baseline.md`.)

> **Scope note:** this trace shows the per-user **Memory** loop (brand, bans, trajectories). For the separate per-agent **Self-Improvement** loop — the agent scoring and pruning its own heuristics, independent of any one user — see [`self-improvement-loop.md`](self-improvement-loop.md).

---

## Session 1 — Cold Start (no memory yet)

```
User: "Zrób mi landing page dla mojego brandu"

Agent (internal):
  RECALL → no pattern file found. Domain defaults only.
  EXPAND → "landing page for a brand" = hero, offer, CTA, contact path.
           Brand colors unknown → ask once, remember forever.
  BUILD  → responsive landing, semantic HTML, real fonts (L1)
  EXTEND → +contact, +favicon, +OG image (generic domain L2s)
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
  RECALL → Profile: navy+gold, PL. Watching: +contact liked, +OG ignored.
  EXPAND → pricing page for the SAME brand → match existing site's
           conventions, navy+gold applied silently (no re-asking!)
  EXTEND → +FAQ section (pricing pages get questions) — new candidate
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
  RECALL → Reinforced: contact-path. Trajectory: landing → pricing → ???
           This user is building out a full brand site, page by page.
  EXPAND → testimonials section, navy+gold, PL copy, real-name placeholders
           clearly marked (no fake social proof — that's slop)
  L3     → trajectory says a brand site heading toward launch needs
           analytics + SEO meta before deploy. Pre-build: +meta/OG audit
           across ALL pages (~60s) — ONE L3, declared with cost.
  VERIFY → section renders, carousel works on mobile, no fake data shipped

Agent (delivered): "Sekcja opinii gotowa (placeholdery oznaczone do podmiany).
                    +audyt meta/SEO wszystkich stron (~60s) — przed deployem."

User reaction: "o, super, właśnie miałem o to pytać"
```

**That last line is the entire point of the skill.**

---

## What Made the Difference

| Session 1 | Session 3 |
|-----------|-----------|
| Asks about brand colors | Applies them silently |
| Generic domain L2s | This user's Reinforced list |
| L3 skipped (no trajectory data) | L3 lands exactly one step ahead |
| Wrong language guess possible | PL from Profile |
| ~60% addition acceptance | ~100% — every addition used |

## What the Agent Did NOT Do

- Did not re-add +OG after it was ignored (deprioritized via Watching)
- Did not store anything private — only work preferences
- Did not write to memory every message — batched at session end
- Did not let memory override words: had the user said "in English this time",
  English wins (explicit > memory > environment > self-notes > defaults)
