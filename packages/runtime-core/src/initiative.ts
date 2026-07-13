import { classifyAction } from './action-policy.js';
import type { InitiativeCandidate, UserMode } from './types.js';

const thresholds: Record<Exclude<UserMode, 'strict'>, number> = { fast: 0.8, standard: 0.6, exploratory: 0.4 };
const clamp = (value: number): number => Math.max(0, Math.min(1, value));

export function scoreInitiative(candidate: InitiativeCandidate): number {
  const numerator = clamp(candidate.expectedValue) * clamp(candidate.confidence) * clamp(candidate.reversibility) * clamp(candidate.verifiability) * clamp(candidate.historicalAccuracy);
  return clamp(numerator / Math.max(clamp(candidate.estimatedCost) + clamp(candidate.risk), 0.01));
}

export function selectInitiatives(candidates: InitiativeCandidate[], mode: UserMode) {
  const result = { selected: [] as string[], proposed: [] as string[], rejected: [] as string[], requiresPermission: [] as string[] };
  if (mode === 'strict') {
    result.rejected.push(...candidates.map((item) => item.id));
    return result;
  }
  const eligible: Array<{ candidate: InitiativeCandidate; score: number }> = [];
  for (const candidate of candidates) {
    const permission = classifyAction(candidate.action);
    if (permission.class === 'ASK') result.requiresPermission.push(candidate.id);
    else if (permission.class === 'FORBIDDEN') result.rejected.push(candidate.id);
    else eligible.push({ candidate, score: scoreInitiative(candidate) });
  }
  eligible.sort((a, b) => b.score - a.score);
  for (const item of eligible) {
    if (item.score >= thresholds[mode]) result.selected.push(item.candidate.id);
    else result.rejected.push(item.candidate.id);
  }
  if (mode === 'fast' && result.selected.length > 1) {
    result.rejected.push(...result.selected.splice(1));
  }
  return result;
}
