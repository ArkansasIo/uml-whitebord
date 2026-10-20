import { Module } from './module.js';
import { ModuleRegistry } from './module-registry.js';
import { PermissionPolicy } from './permissions.js';
import { EventBus, AuditLog } from './events.js';
import { VerificationPipeline } from '../verification/pipeline.js';

export function createRuntime() {
  const events = new EventBus();
  const audit = new AuditLog();
  const permissions = new PermissionPolicy({
    ui: ['ui.read','ui.write'], brain: ['brain.infer'], development: ['workspace.read'], verification: ['verify.run']
  });
  const registry = new ModuleRegistry({ permissions, events, audit });
  const verification = new VerificationPipeline();
  return { Module, registry, permissions, events, audit, verification };
}
