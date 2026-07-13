import type { EvalAssertion } from './types.js';

function readPath(value: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, part) => {
    if (part === 'length' && (typeof current === 'string' || Array.isArray(current))) return current.length;
    if (current && typeof current === 'object') return (current as Record<string, unknown>)[part];
    return undefined;
  }, value);
}

export function evaluateAssertions(output: unknown, assertions: EvalAssertion[]): string[] {
  const failures: string[] = [];
  for (const assertion of assertions) {
    const actual = readPath(output, assertion.path);
    const passes = assertion.operator === 'equals'
      ? Object.is(actual, assertion.value)
      : Array.isArray(actual) || typeof actual === 'string'
        ? actual.includes(assertion.value as never)
        : false;
    if (!passes) failures.push(`${assertion.path}: expected ${assertion.operator} ${JSON.stringify(assertion.value)}, got ${JSON.stringify(actual)}`);
  }
  return failures;
}
