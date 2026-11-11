import { classifyAction } from './action-policy.js';
import type {
  LearningOutcome,
  NextMoveBudget,
  NextMoveDecision,
  NextMovePlan,
  NextMovePrediction,
  PredictionAccuracy,
  PredictionSource,
  Trajectory,
  UserMode,
} from './types.js';

const clamp = (value: number): number => Math.max(0, Math.min(1, value));
const normalize = (step: string): string => step.trim().toLocaleLowerCase().replace(/\s+/gu, ' ');

/** How much a prediction source is trusted before any user-specific calibration. */
export const sourceWeights: Record<PredictionSource, number> = {
  explicit: 1,
  open_loop: 0.95,
  trajectory: 0.9,
  artifact_gap: 0.85,
  session_arc: 0.75,
  domain_prior: 0.55,
};

interface Thresholds { doAhead: number; prepare: number; propose: number; maxEffort: number }

const thresholds: Record<Exclude<UserMode, 'strict'>, Thresholds> = {
  fast: { doAhead: 0.8, prepare: 0.65, propose: 0.5, maxEffort: 0.2 },
  standard: { doAhead: 0.7, prepare: 0.5, propose: 0.35, maxEffort: 0.35 },
  exploratory: { doAhead: 0.6, prepare: 0.4, propose: 0.25, maxEffort: 0.5 },
};

/** Attention budget: a surprise stays valuable only while it is scarce. */
export const defaultBudgets: Record<Exclude<UserMode, 'strict'>, NextMoveBudget> = {
  fast: { doAhead: 1, prepare: 0, propose: 1 },
  standard: { doAhead: 2, prepare: 1, propose: 1 },
  exploratory: { doAhead: 3, prepare: 2, propose: 2 },
};

/** Laplace-smoothed share of earlier predictions that the user actually took up. */
export function predictionAccuracy(state: PredictionAccuracy): number {
  return (state.hits + 1) / (state.hits + state.misses + 2);
}

/** `unknown` is neutral. `ignored` is weak negative evidence, never a full miss. */
export function updatePredictionAccuracy(state: PredictionAccuracy, outcome: LearningOutcome): PredictionAccuracy {
  if (outcome === 'explicit_accept' || outcome === 'adopted') return { ...state, hits: state.hits + 1 };
  if (outcome === 'explicit_reject' || outcome === 'reverted' || outcome === 'corrected') {
    return { ...state, misses: state.misses + 1 };
  }
  if (outcome === 'ignored') return { ...state, misses: state.misses + 0.5 };
  return state;
}

export function calibratedConfidence(prediction: NextMovePrediction): number {
  return clamp(prediction.confidence) * sourceWeights[prediction.source] * clamp(prediction.historicalAccuracy ?? 1);
}

/**
 * Predict the next step from observed step sequences. A trajectory contributes
 * when the tail of `history` matches the steps directly before one of its
 * positions; longer matches and more observations raise confidence.
 */
export function predictFromTrajectories(history: string[], trajectories: Trajectory[]) {
  const recent = history.map(normalize).filter(Boolean);
  const best = new Map<string, { step: string; confidence: number; matched: number; seen: number }>();
  if (recent.length === 0) return [];
  for (const trajectory of trajectories) {
    const steps = trajectory.sequence.map(normalize);
    const seen = Math.max(0, trajectory.seen);
    if (seen === 0) continue;
    for (let index = 1; index < steps.length; index++) {
      let matched = 0;
      while (
        matched < index && matched < recent.length
        && recent[recent.length - 1 - matched] === steps[index - 1 - matched]
      ) matched++;
      if (matched === 0) continue;
      const step = steps[index]!;
      if (!step || recent.includes(step)) continue;
      const confidence = clamp((seen / (seen + 2)) * (0.6 + 0.4 * (matched / index)));
      const existing = best.get(step);
      if (!existing || confidence > existing.confidence) {
        best.set(step, { step: trajectory.sequence[index]!.trim(), confidence, matched, seen });
      }
    }
  }
  return [...best.values()].sort((a, b) => b.confidence - a.confidence);
}

/**
 * Place every predicted next request on the ladder:
 * `do_ahead` (execute now, disclosed), `prepare` (stage, do not apply),
 * `propose` (one concrete offer), or `hold` (say nothing).
 * Permission classification runs first and no confidence can bypass it.
 */
export function planNextMoves(
  predictions: NextMovePrediction[],
  mode: UserMode,
  budget?: Partial<NextMoveBudget>,
): NextMovePlan {
  const plan: NextMovePlan = { doAhead: [], prepare: [], propose: [], hold: [], decisions: {} };
  const place = (id: string, decision: NextMoveDecision, reasonCodes: string[], confidence: number) => {
    const key = decision === 'do_ahead' ? 'doAhead' : decision;
    plan[key].push(id);
    plan.decisions[id] = { decision, reasonCodes, calibratedConfidence: confidence };
  };

  if (mode === 'strict') {
    for (const item of predictions) place(item.id, 'hold', ['strict_scope'], calibratedConfidence(item));
    return plan;
  }

  const limits = { ...defaultBudgets[mode], ...budget };
  const level = thresholds[mode];
  const ranked = [...predictions]
    .map((item) => ({ item, confidence: calibratedConfidence(item) }))
    .sort((a, b) => b.confidence * clamp(b.item.expectedValue) - a.confidence * clamp(a.item.expectedValue));

  for (const { item, confidence } of ranked) {
    const permission = classifyAction(item.action);
    let decision: NextMoveDecision;
    const reasons: string[] = [...permission.reasonCodes];

    if (permission.class === 'FORBIDDEN') {
      place(item.id, 'hold', reasons, confidence);
      continue;
    }
    if (permission.class === 'ASK') {
      decision = confidence >= level.propose ? 'propose' : 'hold';
      reasons.push(decision === 'propose' ? 'requires_permission' : 'below_propose_threshold');
    } else if (confidence >= level.doAhead && item.separable && clamp(item.effort) <= level.maxEffort) {
      decision = 'do_ahead';
      reasons.push('confident_cheap_separable');
    } else if (confidence >= level.prepare) {
      decision = 'prepare';
      if (confidence >= level.doAhead) reasons.push(item.separable ? 'effort_above_do_ahead_cap' : 'not_separable');
      else reasons.push('below_do_ahead_threshold');
    } else if (confidence >= level.propose) {
      decision = 'propose';
      reasons.push('below_prepare_threshold');
    } else {
      decision = 'hold';
      reasons.push('below_propose_threshold');
    }

    // Demote instead of dropping when a rung's attention budget is spent.
    if (decision === 'do_ahead' && plan.doAhead.length >= limits.doAhead) {
      decision = 'prepare';
      reasons.push('do_ahead_budget_spent');
    }
    if (decision === 'prepare' && plan.prepare.length >= limits.prepare) {
      decision = 'propose';
      reasons.push('prepare_budget_spent');
    }
    if (decision === 'propose' && plan.propose.length >= limits.propose) {
      decision = 'hold';
      reasons.push('propose_budget_spent');
    }
    place(item.id, decision, reasons, confidence);
  }
  return plan;
}
