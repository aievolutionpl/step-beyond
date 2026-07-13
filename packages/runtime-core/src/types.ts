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
