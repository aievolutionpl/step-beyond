export interface ContextEntry { id: string; value: string; source: string }
export interface UserContextEntry extends ContextEntry { kind: string; confidence: number }

export function assembleContext(input: { instruction: string; userEntries: UserContextEntry[]; projectFacts: ContextEntry[] }) {
  return {
    instruction: input.instruction,
    userEntries: structuredClone(input.userEntries),
    projectFacts: structuredClone(input.projectFacts),
    sources: new Map([...input.userEntries, ...input.projectFacts].map((entry) => [entry.id, entry.source])),
  };
}
