import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../uml-studio/diagram-model.js', import.meta.url), 'utf8');
const context = { window: {}, Set, Number, String, Array, Object, Error };
vm.runInNewContext(source, context);
const model = context.window.MLTADiagramModel;

const node = (id, extra = {}) => ({
  id, type: 'class', name: id, description: '', members: ['+ run(): void'],
  x: 10, y: 20, w: 180, h: 100, ...extra
});
const edge = (id, from, to, extra = {}) => ({
  id, from, to, type: 'association', label: '', ...extra
});

test('accepts a valid diagram', () => {
  const result = model.validateDiagram({ title: 'Example', nodes: [node('a'), node('b')], edges: [edge('e1', 'a', 'b')] });
  assert.equal(result.ok, true);
  assert.deepEqual(Array.from(result.errors), []);
});

test('rejects a non-object model and missing arrays', () => {
  assert.equal(model.validateDiagram(null).ok, false);
  const result = model.validateDiagram({ nodes: 'nope', edges: [] });
  assert.equal(result.errors[0].code, 'NODES_NOT_ARRAY');
});

test('detects duplicate node and relationship ids', () => {
  const result = model.validateDiagram({
    nodes: [node('a'), node('a')],
    edges: [edge('e', 'a', 'a'), edge('e', 'a', 'missing')]
  });
  const codes = Array.from(result.errors, x => x.code);
  assert.ok(codes.includes('DUPLICATE_NODE_ID'));
  assert.ok(codes.includes('DUPLICATE_EDGE_ID'));
});

test('detects invalid types, geometry, text, and dangling endpoints', () => {
  const result = model.validateDiagram({
    title: 'x'.repeat(121),
    nodes: [node('a', { type: 'unknown', w: 1, name: 'x'.repeat(121) })],
    edges: [edge('e', 'missing', 'a', { type: 'unknown', label: 'x'.repeat(121) })]
  });
  const codes = Array.from(result.errors, x => x.code);
  for (const code of ['INVALID_NODE_TYPE', 'INVALID_NODE_WIDTH', 'INVALID_NODE_NAME',
    'DANGLING_SOURCE', 'INVALID_EDGE_TYPE', 'INVALID_EDGE_LABEL', 'INVALID_TITLE']) {
    assert.ok(codes.includes(code), `Expected diagnostic ${code}`);
  }
});

test('enforces size limits before large model traversal', () => {
  const result = model.validateDiagram({ nodes: [], edges: [] }, { maxNodes: 0 });
  assert.equal(result.ok, true);
  const oversized = model.validateDiagram({ nodes: [node('a')], edges: [] }, { maxNodes: 0 });
  assert.equal(oversized.errors[0].code, 'NODE_LIMIT_EXCEEDED');
});

test('rejects invalid limit options', () => {
  assert.throws(() => model.validateDiagram({ nodes: [], edges: [] }, { maxNodes: -1 }), /maxNodes must be non-negative/);
  assert.throws(() => model.validateDiagram({ nodes: [], edges: [] }, { maxEdges: -1 }), /maxEdges must be non-negative/);
});

test('normalizes accepted documents into schema version 1', () => {
  const value = model.normalizeDiagram({ title: 'Demo', nodes: [node('a', { x: '5' })], edges: [] });
  assert.equal(value.schemaVersion, 1);
  assert.equal(value.nodes[0].x, 5);
  assert.equal(value.title, 'Demo');
});

test('refuses to normalize an invalid document with diagnostics', () => {
  assert.throws(() => model.normalizeDiagram({ nodes: [], edges: [edge('bad', 'missing', 'target')] }), error => {
    assert.match(error.message, /Diagram validation failed/);
    assert.ok(Array.isArray(error.diagnostics));
    return true;
  });
});
