# Step Beyond Positioning Design

## Goal

Explain the framework's central benefit before its architecture: every meaningful
task receives Step Beyond reasoning, so the agent reconstructs the outcome,
completes missing pieces, predicts a useful next move, and verifies its claims.

## Approved message

The English hero uses:

> **Every task. One step further.**
>
> Step Beyond gives your agent a standing instinct to understand the outcome
> behind the prompt, complete the missing pieces, predict the next useful move,
> and verify the result before delivery.

The Polish hero expresses the same claim in natural Polish:

> **Każde zadanie. Jeden krok dalej.**
>
> Step Beyond daje agentowi stały instynkt rozumienia rezultatu ukrytego za
> poleceniem, domykania brakujących elementów, przewidywania następnego użytecznego
> kroku i weryfikowania wyniku przed oddaniem pracy.

## Explanation block

Each README includes a compact “Step Beyond instinct” section. It asks:

1. What outcome does the user need?
2. What necessary piece is missing?
3. What will the user probably need next?
4. Is the agent authorized to act?
5. What evidence proves the result?

The boundary statement remains explicit:

> Every task gets Step Beyond reasoning. Extra work happens only when it is
> useful, safe, permitted, and verifiable.

This message describes behavior, not measured intelligence. It does not claim
that the skill raises model capability, guarantees successful prediction, or
authorizes unsolicited work. Strict scope and permission rules remain unchanged.

## Placement and parity

`README.md` and `README_PL.md` place the promise directly below the title and
version. `README_CHATGPT.md` uses the same promise after its prompt-only mode
label. All three include the five-question instinct block before technical
architecture or installation details.

An automated documentation-contract test checks the headline, instinct section,
and boundary statement across all three variants.
