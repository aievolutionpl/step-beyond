# Content Creation — Step Beyond Examples

## Bad (literal agent)
```
User: "Write a post about AI automation for my Facebook group"
Agent: [writes a single post]
```

## Good (Step Beyond v4)
```
User: "Write a post about AI automation for my Facebook group"

Agent (internal):
  CONTEXT: attributable user-model trajectory: "post → carousel → reels-script"
          2×). Watching: this user's last 2 posts both closed with a
          "part 2" tease, and both got comments asking for the follow-up.
  INTENT:  produce a concrete Facebook post that fits the observed series.
  DECIDE:  draft locally; do not publish. Treat next-post work as optional.
  BUILD:   write the requested post in the confirmed voice.
  INITIATIVE: score hook alternatives, a CTA, and the next-post idea against
              the active mode threshold and permission class.
  EXECUTE: include only the selected local additions.
  VERIFY:  scan for filler and source every factual claim or number.

Agent (delivered):
  ✅ Post written: "Większość firm próbuje automatyzować 5 rzeczy naraz..."
  ➕ Added: 3 alternative hooks (curiosity, contrarian, story-driven),
     engagement CTA, comment-starter question
  ➕ Next-post idea: "Part 2 — jak zmierzyć czy automatyzacja działa (metryki)"
     (this user's last 2 posts both earned follow-up demand this way)
  ➕ Image brief: split-screen before/after, dark navy + gold brand palette
  ✔ Verified: slop scan clean, numbers sourced, brand palette from memory
```

## Why

A post may belong to a broader content sequence, but that is a hypothesis rather
than permission to build a campaign. The agent uses observed trajectory evidence,
selects proportionally, and leaves publication to the user unless authorized.

---

## More Examples

```
"create a carousel about X"   → 10-slide carousel + cover slide + Stories version +
                                 Instagram caption + hashtag set

"plan this week's content"    → 7 days + visual briefs + posting schedule +
                                 Story ideas + engagement tactics

"write an email sequence"     → 5-email sequence + subject line A/B variants +
                                 send time recommendations + tracking plan
```

---

## What Triggers Step Beyond Here

- "post," "content," "carousel," "write," "caption"
- "email," "newsletter," "sequence"
- "plan," "calendar," "schedule"
