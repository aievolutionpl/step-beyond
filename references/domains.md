# 🔬 Domain Decision Trees (Token-Optimized)

> Match the request to a domain, execute the tree. Each tree: **TRIGGER** (pattern match) → **RECALL** (what to pull from memory) → **L1/L2/L3** (the levels) → **VERIFY** (how this domain proves it works) → **NEVER** (hard constraints).
>
> Memory beats these defaults: a user's Reinforced list replaces the generic L2 line; their Banned list filters everything. See `references/memory.md`.

---

## IMAGE

```
TRIGGER: image|photo|graphic|generate|render|visual|picture
RECALL:  brand palette, banned styles, platform (IG? print?), past accepted crops
L1: context, depth, light, brand colors — NEVER void, gradient, isometric
L2: +alt crop (square/9:16), +social format variant
L3: +Stories/Reels cut if Instagram context
VERIFY: inspect output — hands, text-in-image, artifacts, ratio, requested elements
NEVER: void background, waxy skin, gibberish text, wrong finger count shipped
```

## WEB

```
TRIGGER: page|landing|website|site|build|create.*site
RECALL:  stack, brand colors/fonts, hosting, past accepted (+dark-mode? +sitemap?)
L1: responsive, real fonts, semantic HTML, no design slop
L2: +contact, +privacy, +favicon, +OG image, +404
L3: +dark mode if brand=dark, +mobile menu, +sitemap
VERIFY: open it, click every link, submit forms, 375px viewport, console clean
NEVER: single file, no meta, generic fonts, missing favicon, "#" links, lorem ipsum
```

## CONTENT

```
TRIGGER: post|content|carousel|write|article|newsletter|copy
RECALL:  language, tone, banned words (emoji?), platform, past hook styles accepted
L1: active voice, concrete numbers, no AI-slop words, varied rhythm
L2: +3 hook variants, +CTA options, +visual brief
L3: +next-post idea if series detected
VERIFY: slop scan (hard), every number sourced, read-aloud rhythm check
NEVER: "in today's", "let's dive", "game-changer", passive voice, em-dash chains
```

## CODE

```
TRIGGER: code|function|component|class|api|endpoint|script|program
RECALL:  stack, conventions, test framework, past accepted (+tests? +docs?)
L1: types, error handling, edge cases, input validation
L2: +tests, +documentation, +type exports
L3: +integration example, +Storybook story (UI), +deployment config
VERIFY: run it, run tests, feed it the edge case you claim to handle
NEVER: bare functions, no types, silent failures, hardcoded secrets, dead code
```

## RESEARCH

```
TRIGGER: research|find|analyze|investigate|competitor|market|look into
RECALL:  industry, what they did with past research, preferred output format
L1: sources cited, quantitative data, no hallucination
L2: +actionable recommendations, +competitive gaps, +priority matrix
L3: +executive summary, +pitch-ready slide
VERIFY: every claim → a source you actually consulted; numbers cross-checked
NEVER: unsourced claims, vague insights, "more research needed"
```

## EMAIL

```
TRIGGER: email|mailing|outreach|newsletter|campaign|draft
RECALL:  sender voice, audience, past subject styles accepted, language
L1: personal tone, no spam triggers, clear identity
L2: +subject variants, +follow-up template, +preview text
L3: +A/B test plan, +send time recommendation
VERIFY: render check, links resolve, variables filled, spam-trigger scan
NEVER: "hope this finds you well", all-caps subjects, spam words
```

## TECHNICAL

```
TRIGGER: cron|automation|script|workflow|deploy|pipeline|CI|CD
RECALL:  infra, alerting stack, past accepted (+monitoring? +runbook?)
L1: errors, retries, validation, idempotency
L2: +monitoring, +logging, +health check, +docs
L3: +alert webhook, +dashboard, +runbook
VERIFY: run once end-to-end; kill mid-run — does it recover? logs written?
NEVER: silent failures, no retry, hardcoded config, missing logs
```

## VIDEO

```
TRIGGER: video|reel|tiktok|shorts|clip|recording|edit
RECALL:  platform, brand intro/outro, caption language, past accepted formats
L1: correct aspect, compression, clean audio
L2: +thumbnail, +captions (.srt/.vtt), +chapters
L3: +teaser cut for social, +GIF preview
VERIFY: play it — first 3s, audio sync, captions match speech, file size sane
NEVER: wrong ratio, missing thumbnail, uncompressed output
```

## AUDIO

```
TRIGGER: audio|podcast|voice|TTS|text-to-speech|voiceover|narration
RECALL:  preferred voice, language, distribution channel
L1: correct voice, language match, clean output
L2: +transcript, +show notes, +intro/outro markers
L3: +audiogram (waveform video) for social
VERIFY: listen — pronunciation of names/brands, no clipping, correct language
NEVER: wrong language model, uncompressed for chat platforms
```

## DATA

```
TRIGGER: data|chart|graph|visualiz|dashboard|analyze.*data|plot
RECALL:  BI tools, brand palette, audience (exec? analyst?), export prefs
L1: labeled axes, correct scale, legend, accessible colors
L2: +alternative chart type, +CSV/PNG export, +summary stats
L3: +interactive dashboard, +slide-ready version
VERIFY: numbers sum/reconcile with source, scale honest, chart type fits claim
NEVER: misleading scale, missing labels, inaccessible palette, truncated y-axis
```

## SOCIAL

```
TRIGGER: social|IG|FB|Instagram|Facebook|Twitter|LinkedIn|TikTok|post on
RECALL:  platforms used, hashtag sets, posting times, banned (emoji? hashtag spam?)
L1: platform-correct ratio, alt text, readable text size
L2: +caption, +hashtags, +posting time, +alt text
L3: +Stories version, +Reels cut, +cross-platform variant
VERIFY: preview at platform size — text readable on mobile, ratio exact
NEVER: wrong aspect ratio, missing alt text, illegible text
```

---

## No Match?

Request fits no tree → run the generic pipeline: EXPAND hard (the intent brief does the work the tree would), L2 = "what would this user's Reinforced list suggest for adjacent domains", VERIFY = "exercise it the way the user will". Then note the new domain pattern in memory — two sessions of the same novel domain is a tree worth writing (add it to your pattern file's Profile).
