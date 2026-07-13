import { appendFile, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { UserModelEntry } from '@step-beyond/runtime-core';

interface AuditEvent {
  revision: string;
  action: 'append' | 'correct' | 'remove' | 'rollback';
  reason: string;
  at: string;
  before: UserModelEntry[];
  after: UserModelEntry[];
}

const sensitivePatterns = [
  /\bsk-[a-z0-9_-]{8,}\b/iu,
  /\b(?:api[_ -]?key|password|secret|token)\s*[:=]\s*\S+/iu,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u,
];

export class JsonUserModelStore {
  readonly #snapshotPath: string;
  readonly #auditPath: string;

  constructor(private readonly directory: string, namespace: string) {
    if (!/^[a-z0-9][a-z0-9_-]*$/iu.test(namespace)) throw new Error('Invalid namespace');
    this.#snapshotPath = join(directory, `${namespace}.json`);
    this.#auditPath = join(directory, `${namespace}.audit.jsonl`);
  }

  async list(options: { includeDeleted?: boolean } = {}): Promise<UserModelEntry[]> {
    const entries = await this.#readSnapshot();
    return options.includeDeleted ? entries : entries.filter((entry) => entry.status !== 'deleted');
  }

  async append(entry: UserModelEntry): Promise<{ revision: string }> {
    this.#validateEntry(entry);
    const before = await this.#readSnapshot();
    if (before.some((item) => item.id === entry.id)) throw new Error(`Entry ${entry.id} already exists`);
    return this.#commit('append', 'new entry', before, [...before, structuredClone(entry)]);
  }

  async correct(id: string, value: string, reason: string): Promise<{ revision: string }> {
    this.#validateValue(value);
    const before = await this.#readSnapshot();
    const target = before.find((entry) => entry.id === id);
    if (!target) throw new Error(`Entry ${id} not found`);
    const now = new Date().toISOString();
    const after = before.map((entry) => entry.id === id ? { ...entry, value, updatedAt: now, source: 'user', origin: 'explicit' as const, status: 'active' as const } : entry);
    return this.#commit('correct', reason, before, after);
  }

  async remove(id: string, reason: string): Promise<{ revision: string }> {
    const before = await this.#readSnapshot();
    if (!before.some((entry) => entry.id === id)) throw new Error(`Entry ${id} not found`);
    const now = new Date().toISOString();
    const after = before.map((entry) => entry.id === id ? { ...entry, status: 'deleted' as const, updatedAt: now } : entry);
    return this.#commit('remove', reason, before, after);
  }

  async audit(): Promise<AuditEvent[]> {
    try {
      const text = await readFile(this.#auditPath, 'utf8');
      return text.trim() ? text.trim().split(/\r?\n/u).map((line) => JSON.parse(line) as AuditEvent) : [];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw error;
    }
  }

  async rollback(revision: string): Promise<{ revision: string }> {
    const events = await this.audit();
    const target = events.find((event) => event.revision === revision);
    if (!target) throw new Error(`Revision ${revision} not found`);
    return this.#commit('rollback', `rollback ${revision}`, await this.#readSnapshot(), structuredClone(target.before));
  }

  async #readSnapshot(): Promise<UserModelEntry[]> {
    try {
      return JSON.parse(await readFile(this.#snapshotPath, 'utf8')) as UserModelEntry[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw error;
    }
  }

  async #commit(action: AuditEvent['action'], reason: string, before: UserModelEntry[], after: UserModelEntry[]): Promise<{ revision: string }> {
    await mkdir(this.directory, { recursive: true });
    const revision = crypto.randomUUID();
    const temp = `${this.#snapshotPath}.${revision}.tmp`;
    await writeFile(temp, `${JSON.stringify(after, null, 2)}\n`, 'utf8');
    await rename(temp, this.#snapshotPath);
    const event: AuditEvent = { revision, action, reason, at: new Date().toISOString(), before, after };
    await appendFile(this.#auditPath, `${JSON.stringify(event)}\n`, 'utf8');
    return { revision };
  }

  #validateEntry(entry: UserModelEntry): void {
    if (entry.kind === 'fact' && entry.origin === 'inferred') throw new Error('Inferred hypotheses cannot be persisted as facts');
    if (entry.sensitivity === 'sensitive') throw new Error('Sensitive value cannot be persisted');
    this.#validateValue(entry.value);
  }

  #validateValue(value: string): void {
    if (sensitivePatterns.some((pattern) => pattern.test(value))) throw new Error('Sensitive value cannot be persisted');
  }
}
