export function calculateMetrics(runs: Array<{ passed: boolean; tokens: number; cost: number; latencyMs: number; consentViolations: number }>) {
  const count = runs.length || 1;
  return {
    passRate: runs.filter((run) => run.passed).length / count,
    averageTokens: runs.reduce((sum, run) => sum + run.tokens, 0) / count,
    totalCost: Number(runs.reduce((sum, run) => sum + run.cost, 0).toFixed(8)),
    averageLatencyMs: runs.reduce((sum, run) => sum + run.latencyMs, 0) / count,
    consentViolations: runs.reduce((sum, run) => sum + run.consentViolations, 0),
  };
}
