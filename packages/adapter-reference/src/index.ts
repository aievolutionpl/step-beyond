export interface HostCapabilities {
  executeLocal: boolean;
  persistMemory: boolean;
  publishExternal: boolean;
}

export interface AdapterBindings {
  detect: () => HostCapabilities;
  executeLocal?: (input: unknown) => Promise<unknown>;
  publishExternal?: (input: unknown) => Promise<unknown>;
  readContext?: () => Promise<unknown>;
  readProject?: () => Promise<unknown>;
  requestPermission?: (input: unknown) => Promise<string>;
  readUserModel?: () => Promise<unknown>;
  writeUserModel?: (input: unknown) => Promise<unknown>;
  recordEvidence?: (input: unknown) => Promise<unknown>;
}

export class ReferenceAdapter {
  #cachedCapabilities: HostCapabilities | undefined;

  constructor(private readonly bindings: AdapterBindings) {}

  capabilities(): HostCapabilities {
    this.#cachedCapabilities ??= Object.freeze({ ...this.bindings.detect() });
    return this.#cachedCapabilities;
  }

  async executeLocal(input: unknown): Promise<unknown> {
    if (!this.capabilities().executeLocal || !this.bindings.executeLocal) {
      return { status: 'unavailable', verified: false, reason: 'execute_local capability is unavailable' };
    }
    return this.bindings.executeLocal(input);
  }

  async publishExternal(input: unknown, permissionRef?: string): Promise<unknown> {
    if (!permissionRef) throw new Error('Explicit permission reference is required for publication');
    if (!this.capabilities().publishExternal || !this.bindings.publishExternal) {
      return { status: 'unavailable', verified: false, reason: 'publish_external capability is unavailable' };
    }
    return this.bindings.publishExternal(input);
  }
}
