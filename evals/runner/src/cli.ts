import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { runSuite, type EvalArm, type EvalCase } from './index.js';

interface ReplayCase extends EvalCase { replay: Record<EvalArm, unknown> }
const inputPath = resolve('evals/cases/runtime/policy.json');
const outputPath = resolve('evals/results/runtime-smoke.json');
const cases = JSON.parse(await readFile(inputPath, 'utf8')) as ReplayCase[];
const arms: EvalArm[] = ['baseline', 'current', 'prompt-only', 'runtime', 'runtime-ablation'];
const report = await runSuite(cases, arms, 2, (arm) => ({
  run: async (evalCase) => ({
    output: (evalCase as ReplayCase).replay[arm], transcript: [evalCase.prompt], artifacts: {},
    tokens: 0, cost: 0, latencyMs: 0, consentViolations: 0,
  }),
}));
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ ...report, methodology: 'deterministic replay smoke test; not a live-model benchmark' }, null, 2)}\n`, 'utf8');
console.log(`runtime eval: ${report.runs.filter((run) => run.passed).length}/${report.runs.length} assertions passed; report=${outputPath}`);
