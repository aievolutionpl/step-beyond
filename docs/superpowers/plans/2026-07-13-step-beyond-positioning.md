# Step Beyond Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the approved “Every task. One step further.” promise at the front of all README variants without weakening v4 scope, permission, or evidence rules.

**Architecture:** Add one documentation-contract test, then update the three README introductions and add one compact instinct section. Keep the existing lifecycle, capability map, and evidence limitations unchanged.

**Tech Stack:** Markdown, TypeScript, `node:test`, `tsx`.

## Global constraints

- Do not claim that the skill changes the model's measured intelligence.
- Do not promise successful predictions or automatic extra work.
- Preserve strict scope, permission-first initiative, and verification states.
- Keep EN, PL, and ChatGPT claims equivalent.

### Task 1: README positioning parity

**Files:**
- Modify: `packages/runtime-core/test/documentation-contract.test.ts`
- Modify: `README.md`
- Modify: `README_PL.md`
- Modify: `README_CHATGPT.md`

- [ ] Add a failing test that requires the approved English or Polish headline,
  the five-question instinct section, and the boundary sentence in each README.
- [ ] Run `npx tsx --test packages/runtime-core/test/documentation-contract.test.ts`
  and confirm the new test fails because the copy is absent.
- [ ] Add the approved hero copy and instinct block before technical detail.
- [ ] Run the focused test and `npm run validate`.
- [ ] Scan the README files for unsupported intelligence, prediction, or universal
  success claims.
- [ ] Commit as `docs: sharpen Step Beyond product promise`.

### Task 2: Publish the stacked pull request

**Files:** none

- [ ] Confirm a clean worktree and review `git diff origin/docs/v4-project-polish...HEAD`.
- [ ] Push `docs/step-beyond-positioning`.
- [ ] Open a draft PR with base `docs/v4-project-polish` so it contains only the
  positioning change.
- [ ] Verify the PR title, base, head, URL, and draft status.
