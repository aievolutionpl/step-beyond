import type { IntentHypothesis, ProposedAction } from './types.js';

export type IntentResolution =
  | { kind: 'act' | 'act_with_disclosure' | 'ask_permission'; selectedId: string; questions: [] }
  | { kind: 'clarify'; selectedId: string; questions: [string] };

export function resolveIntent(hypotheses: IntentHypothesis[], operations: ProposedAction[]): IntentResolution {
  if (hypotheses.length < 2) throw new Error('At least two intent hypotheses are required');
  const distinctGoals = new Set(hypotheses.map((item) => item.goal.trim().toLocaleLowerCase()));
  if (distinctGoals.size < 2) throw new Error('Intent hypotheses must be materially distinct');
  for (const item of hypotheses) {
    if (item.confidence < 0 || item.confidence > 1 || item.mistakeCost < 0 || item.mistakeCost > 1) {
      throw new Error('Confidence and mistake cost must be normalized');
    }
  }
  const selected = [...hypotheses].sort((a, b) => b.confidence - a.confidence)[0]!;
  if (operations.some((item) => item.kind === 'publish_external' || item.securitySensitive || (item.estimatedCost ?? 0) > 0.5)) {
    return { kind: 'ask_permission', selectedId: selected.id, questions: [] };
  }
  if (selected.confidence >= 0.8 && selected.mistakeCost <= 0.3) {
    return { kind: 'act', selectedId: selected.id, questions: [] };
  }
  if (selected.confidence >= 0.5 && selected.mistakeCost <= 0.5 && operations.every((item) => item.reversible !== false)) {
    return { kind: 'act_with_disclosure', selectedId: selected.id, questions: [] };
  }
  return { kind: 'clarify', selectedId: selected.id, questions: ['Which outcome should I optimize for?'] };
}
