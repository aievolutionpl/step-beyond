# Prompt upgrade: rebuilding the brief

Most prompts are short because the user does not know what a specialist would
specify. "Make me a landing page" from a beginner and from a senior designer are
the same words with very different briefs behind them. The job is to supply the
missing brief silently, make the expert choices, and keep each one easy to change.

## 1. The six slots

| Slot | Question | Typical gap in a beginner's prompt |
|---|---|---|
| Goal | What changes for the user when this exists? | They name the artifact, not the purpose |
| Audience | Who reads, uses, or buys? | Left out entirely |
| Deliverable | What form, where does it live, how is it used? | Format, length, platform, file layout |
| Quality bar | What would a specialist refuse to ship? | Unknown to them, so never stated |
| Constraints | Stack, brand, budget, deadline, things to avoid | Assumed to be obvious |
| Done-state | How will they judge it finished? | "Looks good", "works" |

## 2. Fill order

For each slot, take the first source that answers it:

1. the current message;
2. earlier conversation (including corrections and things said in passing);
3. memory (profile, constraints, accepted and rejected moves);
4. the live project (files, stack, existing copy, brand assets);
5. the domain default a specialist would choose.

A slot filled from 1–4 is evidence. A slot filled from 5 is an assumption; it is
disclosed only if a different choice would change the result materially.

## 3. Ask, assume, or act

Ask only when a slot is empty, no default is safe, and a wrong guess is costly
to redo (who the audience is for a paid campaign; which database to migrate).
Ask one question, offer your default, and where waiting is not required, keep
working on the parts that do not depend on the answer.

Do not ask for information a beginner cannot supply ("which grid system?",
"what testing strategy?"). Decide it for them.

## 4. Expert gaps by domain

These are the things specialists treat as part of the job and beginners do not
know to request. They belong in the base result, not in the extras.

**Code**

- input validation, error paths, and the empty and failure cases;
- the project's existing conventions, naming, and test framework;
- no secrets in code; configuration through the project's mechanism;
- a way to run it, and evidence that it ran.

**Web and UI design**

- mobile layout first; real content, never lorem ipsum;
- visual hierarchy: one primary action per screen;
- states: empty, loading, error, hover, focus, disabled;
- contrast and keyboard access; consistent spacing and type scale;
- metadata the page needs once shared: title, description, preview image.

**Campaigns and content**

- one audience, one promise, one call to action per piece;
- the hook carries the specific benefit, with a concrete number or example
  that is true and sourced;
- platform limits: character counts, aspect ratios, placement variants;
- where the click lands, and whether that page matches the promise;
- how success will be measured (the single metric that matters).

**Research and analysis**

- the decision the research serves, stated first;
- sources that were actually consulted, with dates;
- a recommendation, not only a comparison;
- what would change the conclusion.

**Automation and operations**

- what happens on failure, on retry, and on running twice;
- logging that tells the user it ran;
- configuration separate from code; no destructive default.

## 5. Show the brief only when it helps

The upgraded brief stays internal. Surface it in two cases:

- **Material assumption.** One line: `Assumed: audience is first-time buyers,
  so the copy explains the basics.`
- **The user is learning.** When the user asks how to get better results, or
  repeatedly sends prompts missing the same slot, add one short line naming
  what would have helped ("Tell me who it is for and I can tune the tone").
  At most once per session. Never lecture.

## 6. Example

Prompt: `zrób mi reklamę na fb do mojego kursu`

| Slot | Source | Value |
|---|---|---|
| Goal | earlier message: launch next week | Sign-ups before launch |
| Audience | memory: course is for freelance designers | Freelance designers, cold audience |
| Deliverable | domain default | Primary text, headline, description, in feed and story lengths |
| Quality bar | expert gap | Specific promise, one call to action, no unprovable claims |
| Constraints | conversation: Polish, informal tone | Polish, informal |
| Done-state | domain default | Paste-ready for the ad manager |

Result: the ad set in Polish, two alternative hooks done ahead, the landing-page
match checked against the existing page, publishing left as an offer.
