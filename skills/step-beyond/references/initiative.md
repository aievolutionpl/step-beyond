# Adaptive Initiative

Initiative advances the user's actual goal without broadening authority.
Permission classification always runs first.

For each optional candidate, identify expected value, confidence, reversibility,
verifiability, historical accuracy, cost, risk, and a request-specific rationale.

```text
score = value * confidence * reversibility * verifiability
        * historical_accuracy / max(cost + risk, epsilon)
```

`fast`, `standard`, and `exploratory` modes adjust the threshold. `strict` mode
disables every optional action and unsolicited proposal. No score can bypass an
`ASK` or `FORBIDDEN` decision.

Good initiative closes a concrete gap or likely failure mode. Generic additions
that could be attached to any task are omitted. Large, public, expensive,
irreversible, credential-related, or security-sensitive moves require permission
even when valuable.

## Two kinds of candidate

- **Completion candidates** make the requested result better or safer to use
  (tests for the function, alt text for the image). They are scored with the
  formula above and either executed or omitted.
- **Next-move predictions** are what the user is likely to request next. They
  are placed on the `DO_AHEAD` / `PREPARE` / `PROPOSE` / `HOLD` ladder described
  in `anticipation.md`.

Both kinds share one attention budget per turn and one disclosure line in the
delivery. Historical accuracy comes from observed hits and misses for this user,
not from how confident the prediction felt.
