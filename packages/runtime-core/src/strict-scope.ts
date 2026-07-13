import type { StrictScopeResult } from './types.js';

const absolutePhrases = [
  'nic więcej',
  'bez dodatków',
  'nothing else',
  'no extras',
  'do not add anything',
] as const;

const leadingCommands = [
  {
    label: 'tylko',
    pattern: /(?:^\s*tylko\b|\b(?:popraw|zrób|daj|napisz|zmień)\b[^.!?]{0,40}\btylko\b)/iu,
  },
  { label: 'just', pattern: /^\s*just\b/iu },
  { label: 'only', pattern: /^\s*only\b/iu },
] as const;

export function detectStrictScope(message: string): StrictScopeResult {
  const normalized = message.toLocaleLowerCase();
  const matched: string[] = [];

  for (const command of leadingCommands) {
    if (command.pattern.test(normalized)) matched.push(command.label);
  }
  for (const phrase of absolutePhrases) {
    if (normalized.includes(phrase)) matched.push(phrase);
  }

  return {
    active: matched.length > 0,
    matched,
    mode: matched.length > 0 ? 'strict' : 'standard',
  };
}
