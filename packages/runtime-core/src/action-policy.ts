import type { ActionDecision, ProposedAction } from './types.js';

export function classifyAction(action: ProposedAction): ActionDecision {
  if (action.kind === 'exfiltrate_secret' || action.kind === 'escalate_authority') {
    return { class: 'FORBIDDEN', reasonCodes: ['authority_or_secret_violation'], allowedScope: 'none' };
  }
  if (action.kind === 'publish_external' || action.securitySensitive || (action.estimatedCost ?? 0) > 0.5) {
    return { class: 'ASK', reasonCodes: ['consequential_action'], allowedScope: action.kind === 'publish_external' ? 'publish' : 'execute' };
  }
  if (action.withinScope === false) {
    return { class: 'ASK', reasonCodes: ['outside_scope'], allowedScope: 'execute' };
  }
  if (action.assumptionRequired) {
    return { class: 'AUTO_WITH_DISCLOSURE', reasonCodes: ['material_assumption'], allowedScope: 'execute' };
  }
  return { class: 'AUTO', reasonCodes: ['safe_reversible_in_scope'], allowedScope: action.kind.startsWith('read_') ? 'understand' : 'execute' };
}
