# Research & Analysis — Step Beyond Examples

## Bad (literal agent)
```
User: "Research our top 3 competitors in the project management space"
Agent: [writes vague, unsourced paragraphs — "Competitor A is well known for
        its user-friendly interface" — nothing you could act on, nothing you
        could check]
```

## Good (Step Beyond v3)
```
User: "Research our top 3 competitors in the project management space"

Agent (internal):
  RECALL:  patterns.md → industry: B2B SaaS. Past research delivered as a
           table + exec summary (accepted 2×, reinforced).
  EXPAND:  this isn't trivia — it's a decision input. Audience is probably
           this user's team or leadership, not just the user. Done means
           something someone could act on this week, not a list of facts.
  BUILD:   3 sourced competitor profiles — pricing (from their public pricing
           page), positioning (from their own homepage copy), 1 concrete
           gap each (a feature they're missing, cited from a review site or
           changelog).
  EXTEND:  +competitive gaps ranked by how defensible each is
           +priority matrix (effort vs. impact) for closing the top gap
  VERIFY:  claim audit — every stated fact traces to a specific source
           actually consulted (pricing page, changelog, review aggregator);
           no fact ships without one. Numbers cross-checked against a
           second source where the first seemed off.
  L3:      RESEARCH trajectory signal: "researches competitors → they'll act
           on it" → +ranked action plan (reinforced format: table + exec
           summary), declared with the ~2min read-time cost.

Agent (delivered):
  ✅ 3 competitor profiles — pricing, positioning, one sourced gap each
  ➕ Competitive gaps ranked by defensibility
  ➕ Priority matrix (effort vs. impact)
  ➕ Ranked action plan + exec summary (~2min read) — reinforced format
  ✔ Verified: every claim maps to a source consulted; 2 numbers cross-checked
    against a second source after the first looked stale
```

## Why

Research is the domain where unsourced "insight" is the single most common form of AI slop — plausible-sounding sentences nobody can check. The Claim Audit matters more here than almost anywhere else: a research deliverable's entire value is that someone can trust it enough to act on it. Bundling the ranked action plan isn't scope creep — it's the RESEARCH domain's own trajectory signal (`references/domains.md`): people who ask for research are, almost always, about to make a decision with it.

---

## More Examples

```
"analyze this market"       → sized market + sourced trends + 2-3 entry
                               points ranked by feasibility

"compare these 3 tools"     → feature matrix (every cell sourced) +
                               pricing comparison + a recommendation with
                               the reasoning shown, not just asserted

"summarize this industry report" → summary + the 3 numbers that actually
                               matter for this business + what changed
                               since the last version (if one exists)
```

---

## What Triggers Step Beyond Here

- "research," "find," "analyze," "investigate," "competitor," "market," "look into"
- Any request whose deliverable is a set of claims someone else will rely on
