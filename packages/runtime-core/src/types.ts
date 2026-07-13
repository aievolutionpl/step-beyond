export type UserMode = 'fast' | 'standard' | 'exploratory' | 'strict';

export interface StrictScopeResult {
  active: boolean;
  matched: string[];
  mode: UserMode;
}
