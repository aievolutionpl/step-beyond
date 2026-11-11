import { planNextMoves } from './anticipation.js';
import { detectStrictScope } from './strict-scope.js';
import { resolveIntent } from './intent.js';
import { selectInitiatives } from './initiative.js';
import type { InitiativeCandidate, IntentHypothesis, NextMovePrediction, ProposedAction, UserMode, VerificationRecord } from './types.js';

export function decideTurn(input: {
  message: string;
  hypotheses: IntentHypothesis[];
  operations: ProposedAction[];
  candidates: InitiativeCandidate[];
  verification: VerificationRecord[];
  /** Predicted next requests. Omit when the host has no prediction for this turn. */
  predictions?: NextMovePrediction[];
  /** Session mode chosen by the user or host. Strict scope in the message always wins. */
  mode?: Exclude<UserMode, 'strict'>;
}) {
  const strict = detectStrictScope(input.message);
  const mode: UserMode = strict.active ? 'strict' : input.mode ?? strict.mode;
  const intent = resolveIntent(input.hypotheses, input.operations);
  // Nothing runs ahead of an unanswered clarification or permission request.
  const blocked = intent.kind === 'clarify' || intent.kind === 'ask_permission';
  return {
    mode,
    intent,
    initiatives: selectInitiatives(input.candidates, mode),
    nextMoves: planNextMoves(input.predictions ?? [], blocked ? 'strict' : mode),
    verification: input.verification,
  };
}
