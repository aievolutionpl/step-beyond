import { detectStrictScope } from './strict-scope.js';
import { resolveIntent } from './intent.js';
import { selectInitiatives } from './initiative.js';
import type { InitiativeCandidate, IntentHypothesis, ProposedAction, VerificationRecord } from './types.js';

export function decideTurn(input: { message: string; hypotheses: IntentHypothesis[]; operations: ProposedAction[]; candidates: InitiativeCandidate[]; verification: VerificationRecord[] }) {
  const strict = detectStrictScope(input.message);
  const intent = resolveIntent(input.hypotheses, input.operations);
  return {
    mode: strict.mode,
    intent,
    initiatives: selectInitiatives(input.candidates, strict.mode),
    verification: input.verification,
  };
}
