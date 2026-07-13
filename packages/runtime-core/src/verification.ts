import type { VerificationInput, VerificationRecord } from './types.js';

export function createVerificationRecord(input: VerificationInput): VerificationRecord {
  const status = !input.checkExecuted || input.result !== 'pass'
    ? 'unverified'
    : input.unchecked.length > 0
      ? 'partially_verified'
      : 'verified';
  return { id: crypto.randomUUID(), ...input, status };
}

export function renderVerifiedClaims<T>(artifact: T, records: VerificationRecord[]) {
  return {
    artifact,
    claims: records.filter((record) => record.status !== 'unverified').map((record) => ({ claim: record.claim, status: record.status })),
  };
}
