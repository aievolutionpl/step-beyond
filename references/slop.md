# 🚫 AI Slop Index — Detection Lists by Domain

> **Slop is the residue of a model writing for no one. It pattern-matches "content" without carrying information. Users smell it instantly — and it marks the whole deliverable as machine-made filler.**

This is the reference checklist for the SLOP SCAN step of the Verify Loop. Match the deliverable's domain, scan against the list, rewrite offenders, rescan once.

---

## 1. Text Slop

### Banned words & phrases
```
delve · tapestry · game-changer · revolutionize · seamless · leverage (as verb)
unlock · elevate · supercharge · robust · cutting-edge · in today's fast-paced world
in the ever-evolving landscape · let's dive in · it's important to note
whether you're a X or a Y · look no further · at the end of the day
in conclusion (as a paragraph opener) · hope this email finds you well
```

### Structural slop
| Pattern | Why it reads as slop | Fix |
|---------|---------------------|-----|
| Every paragraph 2–3 sentences, same rhythm | No human writes in metronome | Vary: one-liner next to a five-line block |
| Rule-of-three everywhere ("fast, simple, and powerful") | Filler triplet reflex | Keep one item, make it concrete |
| **Bolding** every third phrase | Emphasis inflation = no emphasis | Bold ≤1 thing per section, or nothing |
| Bullet lists where prose was needed | Fragmenting kills argument flow | Bullets only for genuinely enumerable items |
| Em-dash chains — like this — everywhere — constantly | Signature LLM tic | Max ~1 per paragraph; prefer commas/periods |
| Summary paragraph restating the intro | Zero information delta | Cut it. End on the last real point |
| Hedging stacks ("может", "arguably", "it could be said") | Fear of asserting | Assert or omit |

### The test
Read one paragraph. Ask: **does it contain a fact, number, decision, or instruction the reader didn't have?** No → cut or rewrite. Every sentence must carry cargo.

---

## 2. Code Slop

```
NARRATION COMMENTS     // increment the counter        ← says what the line says
DEAD ABSTRACTION       AbstractFactoryProvider for one implementation
CATCH-AND-IGNORE       try { ... } catch (e) {}        ← silent failure
ANY-TYPING             function f(data: any): any     ← types as decoration
LEFTOVERS              console.log("here2"), commented-out blocks, unused imports
TODO CONFETTI          // TODO: handle errors          ← shipped as "done"
COPY-PASTE TRIPLETS    handleClickA/B/C differing by one string → parametrize
DEFENSIVE THEATER      null-checks on values that cannot be null, triple validation
HARDCODED SECRETS      const API_KEY = "sk-..."        ← never, no exceptions
FRAMEWORK COSPLAY      Redux for two fields, microservices for a script
```

**The test:** every line either does work or documents a *constraint the code can't express*. Everything else is slop.

---

## 3. Web / Design Slop

```
THE GRADIENT HERO      purple-to-blue gradient + centered white text + two buttons
GLASSMORPHISM DEFAULT  frosted cards on everything, no reason
FONT APATHY            Inter/Arial everywhere with zero typographic hierarchy
EMOJI ICONOGRAPHY      🚀 ✨ 💡 as feature icons on a business site
THREE-CARD REFLEX      identical feature cards: icon, title, two lines — ×3
FAKE SOCIAL PROOF      "John D. — CEO" testimonials that don't exist
PLACEHOLDER RESIDUE    lorem ipsum, "Your Company", broken image slots, "#" links
FOOTER GHOSTS          links to pages that were never built
DARK-ON-DARK           4.4:1 contrast "aesthetic" that fails WCAG
STOCK METAPHORS        handshake photos, lightbulbs, generic rocket illustrations
```

**The test:** could this exact page sell any product in any industry? If yes, it sells none. Specificity is the anti-slop: real product names, real numbers, the actual brand palette (check memory Profile).

---

## 4. Image Slop

```
VOID BACKGROUNDS       subject floating on white/gradient nothing
WAXY SKIN              plastic, poreless faces
HAND CHECK             count the fingers. every time.
TEXT-IN-IMAGE          gibberish lettering on signs, labels, screens
HDR OVERSATURATION     everything glowing, cyan-orange color grade
ISOMETRIC DEFAULT      3D isometric illustration when nobody asked
CORPORATE MEMPHIS      flat purple people with giant limbs
```

**The test:** would this pass as a photo/illustration a human deliberately made *for this purpose*? Context, light source, imperfection = real. Void, glow, symmetry = slop.

---

## 5. Data / Chart Slop

```
TRUNCATED Y-AXIS       bar chart starting at 47 to fake a trend
CHART-TYPE MISMATCH    pie chart with 12 slices, line chart for categories
UNLABELED ANYTHING     axes, units, legend — missing any one = unreadable
RAINBOW PALETTE        10 unrelated colors for 3 series
DECIMAL THEATER        "34.2847%" from a sample of 12
DASHBOARD SPRAWL       9 charts where 2 answer the question
```

---

## 6. Scan Procedure (used by Verify Loop step ③)

```
1. MATCH    domain of deliverable → section above
2. SCAN     against the list — mechanically, not from memory
3. SCORE    0 hits → pass. 1–2 → rewrite those parts. 3+ → the approach is
            slop, not the sentences: rebuild the section, don't polish it
4. RESCAN   once. Then stop — infinite polishing is its own failure mode.
```

**Priming note for agents:** these lists are *samples of the pattern*, not the complete universe. Internalize the shape — generic, purposeless, information-free — and catch instances the lists don't name.
