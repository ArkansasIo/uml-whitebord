export class PermissionError extends Error {
  constructor(message, capability) { super(message); this.name = 'PermissionError'; this.capability = capability; }
}

export class PermissionPolicy {
  constructor(grants = {}) { this.grants = new Map(Object.entries(grants).map(([k,v]) => [k, new Set(v)])); }
  allows(moduleId, capability) { return this.grants.get(moduleId)?.has(capability) === true; }
  require(moduleId, capability) {
    if (!this.allows(moduleId, capability)) throw new PermissionError(`Permission denied: ${moduleId} -> ${capability}`, capability);
    return true;
  }
  grant(moduleId, capability) { if (!this.grants.has(moduleId)) this.grants.set(moduleId, new Set()); this.grants.get(moduleId).add(capability); }
  revoke(moduleId, capability) { this.grants.get(moduleId)?.delete(capability); }
}
