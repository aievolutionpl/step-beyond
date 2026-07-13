import { evaluateAssertions } from './assertions.js';
import { calculateMetrics } from './metrics.js';
import type { EvalAdapter, EvalArm, EvalCase, EvalRun } from './types.js';

export async function runSuite(cases: EvalCase[], arms: EvalArm[], repetitions: number, createAdapter: (arm: EvalArm, evalCase: EvalCase, repetition: number) => EvalAdapter) {
  if (!Number.isInteger(repetitions) || repetitions < 1) throw new Error('Repetitions must be a positive integer');
  const runs: EvalRun[] = [];
  for (const evalCase of cases) {
    for (const arm of arms) {
      for (let repetition = 0; repetition < repetitions; repetition++) {
        const observation = await createAdapter(arm, evalCase, repetition).run(evalCase);
        const failures = evaluateAssertions(observation.output, evalCase.assertions);
        runs.push({ ...observation, caseId: evalCase.id, arm, repetition, passed: failures.length === 0, failures });
      }
    }
  }
  return { generatedAt: new Date().toISOString(), repetitions, arms, runs, metrics: calculateMetrics(runs) };
}
