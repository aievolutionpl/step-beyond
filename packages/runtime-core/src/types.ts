export type UserMode = 'fast' | 'standard' | 'exploratory' | 'strict';

export interface StrictScopeResult {
  active: boolean;
  matched: string[];
  mode: UserMode;
}

export interface IntentHypothesis {
  id: string;
  goal: string;
  expectedResult: string;
  audience: string;
  constraints: string[];
  definitionOfDone: string[];
  missingInformation: string[];
  confidence: number;
  mistakeCost: number;
  evidenceRefs: string[];
}

export type OperationKind =
  | 'read_context' | 'read_project' | 'execute_local' | 'request_permission'
  | 'publish_external' | 'write_user_model' | 'record_evidence'
  | 'exfiltrate_secret' | 'escalate_authority';

export interface ProposedAction {
  kind: OperationKind;
  withinScope?: boolean;
  reversible?: boolean;
  assumptionRequired?: boolean;
  securitySensitive?: boolean;
  estimatedCost?: number;
}

export type PermissionClass = 'AUTO' | 'AUTO_WITH_DISCLOSURE' | 'ASK' | 'FORBIDDEN';

export interface ActionDecision {
  class: PermissionClass;
  reasonCodes: string[];
  allowedScope: 'understand' | 'propose' | 'execute' | 'publish' | 'none';
}

export interface InitiativeCandidate {
  id: string;
  action: ProposedAction;
  expectedValue: number;
  confidence: number;
  reversibility: number;
  verifiability: number;
  estimatedCost: number;
  risk: number;
  historicalAccuracy: number;
  rationale: string;
}

export type LearningOutcome = 'explicit_accept' | 'explicit_reject' | 'adopted' | 'reverted' | 'corrected' | 'ignored' | 'unknown';

export interface LearningEvent {
  outcome: LearningOutcome;
  subjectRef: string;
  evidenceRef: string;
}

export interface LearningState {
  accepts: number;
  rejects: number;
  adopted: number;
  reverted: number;
  corrected: number;
  ignored: number;
}

export interface VerificationInput {
  claim: string;
  checkExecuted: boolean;
  result: 'pass' | 'fail' | 'not_run';
  unchecked: string[];
  method?: string;
  evidence?: string[];
  environmentBlockers?: string[];
}

export interface VerificationRecord extends VerificationInput {
  id: string;
  status: 'verified' | 'partially_verified' | 'unverified';
}

export type UserModelKind = 'fact' | 'preference' | 'constraint' | 'observation' | 'hypothesis' | 'trajectory' | 'open_loop' | 'negative_feedback';

export interface UserModelEntry {
  id: string;
  kind: UserModelKind;
  value: string;
  source: string;
  sourceRef: string;
  createdAt: string;
  updatedAt: string;
  scope: string;
  confidence: number;
  confirmations: number;
  lastUsedAt: string | null;
  revalidateAt: string | null;
  origin: 'explicit' | 'inferred';
  sensitivity: 'normal' | 'sensitive';
  status: 'active' | 'disputed' | 'expired' | 'deleted';
}

export type PredictionSource = 'explicit' | 'open_loop' | 'trajectory' | 'artifact_gap' | 'session_arc' | 'domain_prior';

/** One predicted next request, with the action that would satisfy it now. */
export interface NextMovePrediction {
  id: string;
  description: string;
  source: PredictionSource;
  action: ProposedAction;
  /** Probability that the user asks for this next, before calibration. */
  confidence: number;
  expectedValue: number;
  /** Normalized cost of doing it now (time, tokens, review burden). */
  effort: number;
  /** True when it can be dropped without touching the requested base result. */
  separable: boolean;
  /** Share of earlier predictions of this kind the user took up; defaults to 1. */
  historicalAccuracy?: number;
  evidenceRefs?: string[];
}

export type NextMoveDecision = 'do_ahead' | 'prepare' | 'propose' | 'hold';

export interface NextMoveBudget { doAhead: number; prepare: number; propose: number }

export interface NextMovePlan {
  doAhead: string[];
  prepare: string[];
  propose: string[];
  hold: string[];
  decisions: Record<string, { decision: NextMoveDecision; reasonCodes: string[]; calibratedConfidence: number }>;
}

/** An observed sequence of user requests, e.g. landing page → OG image → deploy. */
export interface Trajectory { sequence: string[]; seen: number }

export interface PredictionAccuracy { hits: number; misses: number }
