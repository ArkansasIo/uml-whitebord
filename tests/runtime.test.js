import test from 'node:test';
import assert from 'node:assert/strict';
import { Module } from '../runtime/module.js';
import { ModuleRegistry } from '../runtime/module-registry.js';
import { PermissionPolicy } from '../runtime/permissions.js';
import { parseBrainScript } from '../brainscript/runtime.js';

test('module lifecycle registers and activates', async () => {
  const permissions = new PermissionPolicy({ demo: ['workspace.read'] });
  const registry = new ModuleRegistry({ permissions });
  const module = new Module({ id: 'demo', name: 'Demo', version: '0.1.0', permissions: ['workspace.read'] });
  registry.register(module); await registry.activate('demo');
  assert.equal(module.state, 'started');
  await registry.execute('demo', { hello: true });
});

test('brain script parses bounded workflow', () => {
  const program = parseBrainScript('workflow Demo {\n agent = development\n steps {\n analyze\n verify\n }\n verification {\n self_verify = true\n }\n}');
  assert.deepEqual(program.steps, ['analyze','verify']);
  assert.equal(program.verification.self_verify, true);
});
