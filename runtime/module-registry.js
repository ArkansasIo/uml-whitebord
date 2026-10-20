import { ModuleError } from './module.js';

export class ModuleRegistry {
  constructor({ permissions, events, audit, maxRecoveryRetries = 2 } = {}) {
    this.modules = new Map(); this.permissions = permissions; this.events = events; this.audit = audit; this.maxRecoveryRetries = maxRecoveryRetries;
  }
  register(module) {
    if (this.modules.has(module.definition.id)) throw new ModuleError(`Duplicate module: ${module.definition.id}`, 'DUPLICATE_MODULE');
    this.modules.set(module.definition.id, module); this.audit?.append('module.register', { id: module.definition.id }); this.events?.emit('module.registered', module.definition); return module;
  }
  get(id) { return this.modules.get(id); }
  list() { return [...this.modules.values()].map(m => ({ ...m.definition, state: m.state, health: m.health })); }
  _depsReady(module) { return (module.definition.dependencies ?? []).every(id => this.modules.has(id) && ['configured','started'].includes(this.modules.get(id).state)); }
  async activate(id, context = {}) {
    const module = this.get(id); if (!module) throw new ModuleError(`Unknown module: ${id}`, 'NOT_FOUND');
    if (!this._depsReady(module)) throw new ModuleError(`Dependencies are not ready for ${id}`, 'DEPENDENCY_NOT_READY');
    await module.configure(context); await module.start(context); await module.healthCheck(context); this.audit?.append('module.started', { id }); return module;
  }
  async execute(id, input, context = {}) {
    const module = this.get(id); if (!module || module.state !== 'started') throw new ModuleError(`Module is not started: ${id}`, 'NOT_STARTED');
    for (const permission of module.definition.permissions ?? []) this.permissions?.require(id, permission);
    const result = await module.execute(input, context); this.audit?.append('module.execute', { id }); return result;
  }
  async verify(id, result, context = {}) { const module = this.get(id); if (!module) throw new ModuleError(`Unknown module: ${id}`, 'NOT_FOUND'); const verification = await module.verify(result, context); this.audit?.append('module.verify', { id, ok: verification?.ok !== false }); return verification; }
}
