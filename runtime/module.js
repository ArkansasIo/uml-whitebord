export const LIFECYCLE = Object.freeze([
  'register','configure','start','execute','verify','self-verify','recover/retry','persist','report','stop'
]);

export class ModuleError extends Error {
  constructor(message, code = 'MODULE_ERROR', details = {}) { super(message); this.name = 'ModuleError'; this.code = code; this.details = details; }
}

export class Module {
  constructor(definition, implementation = {}) {
    if (!definition?.id) throw new ModuleError('Module id is required', 'INVALID_MODULE');
    this.definition = structuredClone(definition);
    this.implementation = implementation;
    this.state = 'registered';
    this.health = { status: 'unknown', checkedAt: null, details: null };
  }
  async configure(context) { return this._run('configure', context); }
  async start(context) { return this._run('start', context); }
  async execute(input, context) { return this._run('execute', { input, context }); }
  async verify(result, context) { return this._run('verify', { result, context }); }
  async stop(context) { return this._run('stop', context); }
  async healthCheck(context) {
    const fn = this.implementation.healthCheck;
    const details = fn ? await fn(context) : { status: this.state === 'started' ? 'healthy' : 'ready' };
    this.health = { status: details.status ?? 'healthy', checkedAt: new Date().toISOString(), details };
    return this.health;
  }
  async _run(action, payload) {
    const fn = this.implementation[action];
    if (fn) return fn(payload);
    if (action === 'configure') this.state = 'configured';
    if (action === 'start') this.state = 'started';
    if (action === 'stop') this.state = 'stopped';
    return { ok: true, action, module: this.definition.id };
  }
}
