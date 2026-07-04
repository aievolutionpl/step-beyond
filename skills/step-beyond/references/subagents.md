# 🤖 Subagent Orchestration — Scaling Step Beyond

> **When subagents exist, use them for two things: parallel building and unbiased verification. When they don't, run solo — the pipeline is the same.**

---

## 1. Detect Capability (once per session)

```
Claude Code / Agent SDK   → Task/Agent tool, custom subagents
CrewAI / AutoGen / LangGraph → crew members, group chat agents, graph nodes
OpenAI Agents SDK         → handoffs, agent-as-tool
Custom ReAct loop         → spawn-with-fresh-context, if implemented
None of the above         → SOLO MODE: full pipeline yourself +
                            Fresh-Eyes Protocol (references/verification.md §3)
```

Subagents are an **accelerator, not a requirement**. Every Step Beyond behavior works solo.

---

## 2. The Roles

| Role | Gets | Does | Returns |
|------|------|------|---------|
| **ORCHESTRATOR** (you) | User request + memory | RECALL, EXPAND, plan, delegate, assemble, DELIVER, LEARN | — |
| **BUILDER** | Intent brief + Profile constraints | Base + L1 polish | Working deliverable |
| **EXTENDER** ×N | One L2 spec each | One addition each, in parallel | Working addition |
| **VERIFIER** | Deliverable + checklists **only** | Verify Loop (all four checks) | Pass / itemized failures |
| **CRITIC** (big deliverables only) | Deliverable + "find what a demanding reviewer would flag" | Hostile pass | Weakest 3 points |

### The Verifier Firewall (the rule that matters most)

```
VERIFIER receives:  the deliverable, the ORIGINAL user request,
                    the domain verify table, the slop index
VERIFIER never receives:  the builder's reasoning, your plan,
                          your justifications, your excitement
```

A verifier that reads the builder's reasoning inherits the builder's blind spots. Fresh context **is** the feature — that's what a solo agent can't fake and the single biggest reason to spawn one.

---

## 3. Orchestration Pattern

```
                    ┌── EXTENDER: +contact page ──┐
USER ──▶ RECALL     │                             │
         EXPAND ──▶ BUILDER: base + L1  ──────────┼──▶ VERIFIER ──▶ ASSEMBLE
         (plan)     │                             │    (fresh ctx)   DELIVER
                    └── EXTENDER: +OG image ──────┘                  LEARN
```

**Rules:**

1. **Parallelize only independent additions.** +contact page ∥ +OG image: fine. +dark-mode theme while base CSS is being written: sequential — it depends on the base.
2. **The ceiling is global.** 5 additions across ALL agents, not per agent. The orchestrator owns the budget; subagents get specs, never discretion to add more.
3. **The orchestrator owns delivery and memory.** One voice to the user. One LEARN write. Subagents never talk to the user or touch the pattern file.
4. **Verify failures route back to the builder** (max 2 fix cycles per Verify Loop), then re-verify. The verifier never fixes — fixing makes it an author, and authors can't verify.
5. **Critic is for big deliverables only** — full sites, long documents, multi-file changes. For a single function it's ceremony.

---

## 4. When to Spawn vs. Go Solo

```
SPAWN when:
  independent additions ≥ 2        → parallel EXTENDERs pay for themselves
  deliverable > ~5 files/sections  → fresh-context VERIFIER catches what you can't
  research request                 → parallel searchers, orchestrator synthesizes

SOLO when:
  single-file / single-artifact task   → spawn overhead > benefit
  tight latency (user waiting on chat) → subagent startup costs seconds
  platform bills per-agent             → respect the $ ceiling
```

Spawning has real cost: startup latency, token duplication (each agent re-reads context), coordination overhead. **A subagent that saves no wall-clock time and adds no fresh perspective is slop in agent form.**

---

## 5. Prompt Templates

**EXTENDER** (one per addition):
```
Build exactly this, nothing more: {L2 spec, e.g. "contact page: form
(name/email/message), validation, success state"}.
Constraints from user profile: {stack, brand, language}.
Match the conventions of: {base deliverable location}.
Verify your piece works before returning. Return: files + 1-line status.
Do NOT add extras — additions are budgeted by the orchestrator.
```

**VERIFIER**:
```
You are reviewing a deliverable you did not build. Original request: "{verbatim
user request}". Deliverable: {location/content}.
Run: (1) base check per this table: {domain verify row},
(2) every addition works, (3) slop scan per this list: {domain slop section},
(4) flag any claim in this draft delivery message not backed by observation:
"{draft message}".
Return: PASS, or an itemized list: what fails, where, how observed.
Do not fix anything. Do not praise anything.
```

---

## 6. Failure Modes

| Failure | Symptom | Prevention |
|---------|---------|-----------|
| Ceiling breach by committee | 3 subagents each add "just one" extra | Additions are specs from orchestrator only |
| Verifier capture | Verifier saw the plan, rubber-stamps it | The Firewall — deliverable + checklists only |
| Delegation theater | 4 agents, task was one file | The spawn/solo table above |
| Frankenstein assembly | Parallel pieces with different conventions | Every EXTENDER gets the same Profile + base conventions |
| Lost budget tracking | Orchestrator loses count across agents | Budget lives in one place: the orchestrator's plan |
