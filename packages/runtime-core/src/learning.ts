import type { LearningEvent, LearningState } from './types.js';

export function applyLearningEvent(state: LearningState, event: LearningEvent): LearningState {
  if (event.outcome === 'unknown') return state;
  const next = { ...state };
  if (event.outcome === 'explicit_accept') next.accepts++;
  if (event.outcome === 'explicit_reject') next.rejects++;
  if (event.outcome === 'adopted') next.adopted++;
  if (event.outcome === 'reverted') next.reverted++;
  if (event.outcome === 'corrected') next.corrected++;
  if (event.outcome === 'ignored') next.ignored++;
  return next;
}

export function proposeHeuristicRevision(heuristicId: string, events: LearningEvent[]) {
  const eligible = events.filter((event) => event.subjectRef === heuristicId && event.outcome !== 'unknown');
  if (eligible.length < 3) return null;
  return {
    id: crypto.randomUUID(), heuristicId, previousVersion: 1, proposedVersion: 2,
    reasonEvents: eligible.map((event) => event.evidenceRef), status: 'proposed' as const,
  };
}
