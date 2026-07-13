export interface ContextEntry { id: string; value: string; source: string; relevance?: number; tokenCost?: number }
export interface UserContextEntry extends ContextEntry { kind: string; confidence: number }

export function assembleContext(input: { instruction: string; userEntries: UserContextEntry[]; projectFacts: ContextEntry[]; maxContextTokens?: number }) {
  const budget = input.maxContextTokens ?? Number.POSITIVE_INFINITY;
  const ranked = [...input.userEntries, ...input.projectFacts]
    .sort((a, b) => (b.relevance ?? 0.5) - (a.relevance ?? 0.5));
  const selected = new Set<string>();
  const omitted: string[] = [];
  let estimatedTokens = 0;
  for (const entry of ranked) {
    const cost = Math.max(1, entry.tokenCost ?? Math.ceil(entry.value.length / 4));
    if (estimatedTokens + cost <= budget) {
      selected.add(entry.id);
      estimatedTokens += cost;
    } else {
      omitted.push(entry.id);
    }
  }
  const userEntries = input.userEntries.filter((entry) => selected.has(entry.id));
  const projectFacts = input.projectFacts.filter((entry) => selected.has(entry.id));
  return {
    instruction: input.instruction,
    userEntries: structuredClone(userEntries),
    projectFacts: structuredClone(projectFacts),
    sources: new Map([...userEntries, ...projectFacts].map((entry) => [entry.id, entry.source])),
    estimatedTokens,
    omitted,
  };
}
