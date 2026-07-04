# 🧠 Memory Protocol — Pattern Learning Across Sessions

> **"Prediction without memory is guessing. Prediction with memory is knowing."**

Step Beyond's L2/L3 predictions get dramatically better when the agent remembers what this specific user accepted, rejected, and ignored. This protocol makes that memory work with **any** storage the agent has — Obsidian, an MCP memory server, mem0, Notion, `CLAUDE.md`, or a plain markdown file. No storage at all? Degrade gracefully to session-only tracking.

---

## 1. Detect Your Memory (once per session)

Check in priority order. Use the first one available:

```
1. DEDICATED MEMORY TOOL   — memory MCP server, mem0, agent memory API
2. KNOWLEDGE VAULT         — Obsidian vault, Notion workspace, wiki
3. PROJECT MEMORY          — CLAUDE.md, AGENTS.md, .cursorrules, repo docs
4. FILE FALLBACK           — create `step-beyond/patterns.md` where you have write access
5. NONE                    — session-only tracking (feedback loop still runs, just doesn't persist)
```

**One artifact, everywhere:** whatever the store, the payload is the same portable markdown document — the **User Pattern File**. Any agent (and any human) can read it. See `templates/user-patterns.md` for the starter.

---

## 2. The User Pattern File (Schema)

```markdown
# Step Beyond — User Patterns
updated: 2026-07-04

## Profile            ← stable facts. Read every session.
- stack: Next.js + Tailwind
- brand: dark navy #0B1E3B + gold #D4AF37
- language: PL (replies), EN (code)
- tone: direct, no emoji in technical docs

## Reinforced         ← accepted 2×+. These become DEFAULT L2 for their domain.
- web: +dark-mode          (accepted 3×, last 2026-07-01)
- content: +hook-variants  (accepted 2×, last 2026-06-28)

## Banned             ← rejected 2×+. NEVER add these again.
- content: emoji           (rejected 2×: "bez emoji")
- image: 5-crop-variants   (rejected: "too many")

## Watching           ← 1 signal. Not yet promoted. Try once more when relevant.
- web: +sitemap            (accepted 1×)
- data: +csv-export        (ignored 1×)

## Trajectories       ← observed multi-session sequences. Fuel for L3.
- post → carousel → reels-script     (seen 2×)
- landing → contact → analytics      (seen 1×)

## Open Loops         ← optional. Unfinished threads awaiting user input.
- landing: address/prices are placeholders — waiting for real data
```

**Section rules:**

| Section | What goes in | How it's used |
|---------|-------------|---------------|
| **Profile** | Stable facts: stack, brand, language, tone, platform | Feeds EXPAND (intent brief) + L1 constraints |
| **Reinforced** | Enhancements accepted 2×+ | Pre-selected as L2 — no re-guessing |
| **Banned** | Rejected 2×+ or explicit "never do X" | Hard filter — blocks the addition entirely |
| **Watching** | Single signals, unconfirmed | Candidate pool — one more signal promotes or drops |
| **Trajectories** | Request sequences seen across sessions | Direct input to L3 prediction |
| **Open Loops** *(optional)* | Unfinished threads: placeholder data awaiting real values, offered additions awaiting a response | Next session starts by closing loops before adding anything new |

---

## 3. Lifecycle Rules (Promotion / Demotion / Decay)

```
PROMOTE   accept 2×                → Watching → Reinforced
BAN       reject 2× OR explicit    → anywhere → Banned ("never", "stop doing X" = instant ban)
DROP      ignored 3×               → Watching → deleted
DECAY     Reinforced unconfirmed   → after ~10 sessions or 30 days → back to Watching
PRUNE     file > 100 lines         → delete weakest Watching entries first
```

**What counts as a signal:**

| Signal | Reads as |
|--------|---------|
| User uses/deploys/ships the addition | **accept** |
| Explicit praise ("perfect", "exactly") | **accept** (strong — counts double) |
| User deletes/reverts the addition | **reject** |
| "too much", "I didn't ask for that" | **reject** (strong — counts double) |
| No reaction, addition unused | **ignore** |

---

## 4. Read Protocol (RECALL — pipeline step 0)

At session start, or lazily on the first matching request:

```
1. Load User Pattern File (or query memory tool for "step-beyond patterns")
2. Profile   → merge into every intent brief (EXPAND step)
3. Reinforced→ pre-load as default L2 for matching domains
4. Banned    → add to the hard filter — checked before EVERY addition
5. Trajectories → if current request matches step N of a known sequence,
                  step N+1 is your L3 candidate (highest-confidence prediction)
```

**Cost control:** read once, cache in working context. Do not re-read per message.

---

## 5. Write Protocol (LEARN — pipeline step 6)

**Batch, don't stream.** Write on: session end, explicit strong signal (praise/rejection), or every ~5 turns in long sessions. Never write per-message — that's token waste and store spam.

```
1. Diff session observations against the current file
2. Apply lifecycle rules (promote / ban / drop / decay)
3. Update `updated:` date
4. Write back to the SAME location you read from
```

**Never store:** secrets, API keys, credentials, personal data beyond work preferences, anything the user asked to keep private. Memory is for *work patterns*, not surveillance.

---

## 6. Precedence (Conflict Resolution)

```
EXPLICIT INSTRUCTION  >  MEMORY  >  DOMAIN DEFAULTS
```

- User says "with emoji" while `content: emoji` is Banned → do it with emoji, **this once**. Note the exception; 2 exceptions → un-ban.
- Memory says `stack: Next.js`, user says "in plain HTML" → plain HTML. Profile stays (one-off ≠ profile change).
- Memory silent on a domain → fall back to domain decision trees (`references/domains.md`).

---

## 7. Per-Store Notes

### Obsidian
- Location: `{vault}/step-beyond/patterns.md` (or the user's convention, e.g. `Areas/AI/`)
- Add frontmatter `tags: [step-beyond, agent-memory]` so it's findable
- Respect existing vault structure — ask once, remember the answer (in Profile)

### Memory MCP / mem0 / vector stores
- Store the file as one document/entity keyed `step-beyond:patterns`
- On tools with entity-relation graphs: entities = patterns, relations = `reinforced-for(domain)`, `banned-for(domain)`
- Retrieval query: `"step-beyond user patterns preferences"`

### CLAUDE.md / AGENTS.md / .cursorrules
- Append under a marked section: `<!-- step-beyond:patterns:start -->` … `:end`
- Keep it under 40 lines here (this file loads every session — token budget matters)
- Overflow goes to a linked `step-beyond-patterns.md`

### No store at all
- Track in working context for this session
- At session end, offer once: *"Want me to save what I learned about your preferences? (creates patterns.md)"*

---

## 8. Memory → Prediction (Why This Matters)

| Without memory | With memory |
|----------------|-------------|
| L2 = statistical guess from domain tree | L2 = this user's Reinforced list |
| L3 = generic trajectory ("pages get deployed") | L3 = *their* trajectory ("landing → contact → analytics") |
| Re-asks brand colors every session | Brand in Profile — applied silently at L1 |
| Repeats rejected additions | Banned filter blocks them permanently |
| Enhancement acceptance ~60% | Target: **>85% after 5 sessions** |

The feedback loop in SKILL.md describes *what* to track. This protocol makes it *survive the session*. That difference is the whole game.
