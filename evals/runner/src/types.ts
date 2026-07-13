export type EvalArm = 'baseline' | 'current' | 'prompt-only' | 'runtime' | 'runtime-ablation';
export interface EvalAssertion { path: string; operator: 'equals' | 'includes'; value: unknown }
export interface EvalCase { id: string; prompt: string; assertions: EvalAssertion[] }
export interface EvalObservation {
  output: unknown; transcript: string[]; artifacts: Record<string, unknown>;
  tokens: number; cost: number; latencyMs: number; consentViolations: number;
}
export interface EvalAdapter { run(evalCase: EvalCase): Promise<EvalObservation> }
export interface EvalRun extends EvalObservation {
  caseId: string; arm: EvalArm; repetition: number; passed: boolean; failures: string[];
}
