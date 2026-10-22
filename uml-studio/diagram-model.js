(() => {
  'use strict';

  const NODE_TYPES = new Set([
    'class', 'interface', 'package', 'component', 'usecase',
    'actor', 'database', 'note', 'state'
  ]);
  const EDGE_TYPES = new Set([
    'association', 'dependency', 'inheritance', 'composition', 'aggregation'
  ]);
  const MAX_NODES = 5000;
  const MAX_EDGES = 15000;
  const MAX_TEXT = 2000;
  const finite = value => Number.isFinite(Number(value));
  const text = (value, max = MAX_TEXT) => typeof value === 'string' && value.length <= max;

  function validateDiagram(input, options = {}) {
    const errors = [];
    const warnings = [];
    const add = (code, message, path = '$') => errors.push({ code, message, path });
    const warn = (code, message, path = '$') => warnings.push({ code, message, path });

    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return { ok: false, errors: [{ code: 'MODEL_NOT_OBJECT', message: 'Diagram must be an object.', path: '$' }], warnings };
    }
    if (!Array.isArray(input.nodes)) add('NODES_NOT_ARRAY', 'nodes must be an array.', '$.nodes');
    if (!Array.isArray(input.edges)) add('EDGES_NOT_ARRAY', 'edges must be an array.', '$.edges');
    if (errors.length) return { ok: false, errors, warnings };

    if (input.nodes.length > (options.maxNodes ?? MAX_NODES)) {
      add('NODE_LIMIT_EXCEEDED', 'Diagram contains too many nodes.', '$.nodes');
    }
    if (input.edges.length > (options.maxEdges ?? MAX_EDGES)) {
      add('EDGE_LIMIT_EXCEEDED', 'Diagram contains too many relationships.', '$.edges');
    }

    const nodeIds = new Set();
    for (let i = 0; i < input.nodes.length; i++) {
      const n = input.nodes[i], p = '$.nodes[' + i + ']';
      if (!n || typeof n !== 'object' || Array.isArray(n)) {
        add('NODE_NOT_OBJECT', 'Node must be an object.', p);
        continue;
      }
      if (typeof n.id !== 'string' || !n.id.trim() || n.id.length > 128) {
        add('INVALID_NODE_ID', 'Node id must be a non-empty string of at most 128 characters.', p + '.id');
      } else if (nodeIds.has(n.id)) {
        add('DUPLICATE_NODE_ID', 'Node id is duplicated: ' + n.id, p + '.id');
      } else {
        nodeIds.add(n.id);
      }
      if (!NODE_TYPES.has(n.type)) add('INVALID_NODE_TYPE', 'Unsupported node type: ' + String(n.type), p + '.type');
      if (!text(n.name ?? '', 120)) add('INVALID_NODE_NAME', 'Node name must be text of at most 120 characters.', p + '.name');
      if (!text(n.description ?? '', MAX_TEXT)) add('INVALID_NODE_DESCRIPTION', 'Node description exceeds the allowed length.', p + '.description');
      if (n.members !== undefined && (!Array.isArray(n.members) || n.members.length > 100 || n.members.some(m => !text(m, 300)))) {
        add('INVALID_NODE_MEMBERS', 'members must be an array of at most 100 strings, each at most 300 characters.', p + '.members');
      }
      for (const k of ['x', 'y', 'w', 'h']) {
        if (!finite(n[k])) add('INVALID_NODE_GEOMETRY', k + ' must be a finite number.', p + '.' + k);
      }
      if (finite(n.x) && Number(n.x) < 0) warn('NEGATIVE_COORDINATE', 'Negative x coordinates may not render in all export workflows.', p + '.x');
      if (finite(n.y) && Number(n.y) < 0) warn('NEGATIVE_COORDINATE', 'Negative y coordinates may not render in all export workflows.', p + '.y');
      if (finite(n.w) && (Number(n.w) < 80 || Number(n.w) > 600)) add('INVALID_NODE_WIDTH', 'Width must be between 80 and 600.', p + '.w');
      if (finite(n.h) && (Number(n.h) < 50 || Number(n.h) > 500)) add('INVALID_NODE_HEIGHT', 'Height must be between 50 and 500.', p + '.h');
    }

    const edgeIds = new Set();
    for (let i = 0; i < input.edges.length; i++) {
      const e = input.edges[i], p = '$.edges[' + i + ']';
      if (!e || typeof e !== 'object' || Array.isArray(e)) {
        add('EDGE_NOT_OBJECT', 'Relationship must be an object.', p);
        continue;
      }
      if (typeof e.id !== 'string' || !e.id.trim() || e.id.length > 128) {
        add('INVALID_EDGE_ID', 'Relationship id must be a non-empty string of at most 128 characters.', p + '.id');
      } else if (edgeIds.has(e.id)) {
        add('DUPLICATE_EDGE_ID', 'Relationship id is duplicated: ' + e.id, p + '.id');
      } else {
        edgeIds.add(e.id);
      }
      if (!nodeIds.has(e.from)) add('DANGLING_SOURCE', 'Relationship source does not reference a known node.', p + '.from');
      if (!nodeIds.has(e.to)) add('DANGLING_TARGET', 'Relationship target does not reference a known node.', p + '.to');
      if (e.from === e.to) add('SELF_RELATIONSHIP', 'Self relationships are not supported by this editor.', p);
      if (!EDGE_TYPES.has(e.type)) add('INVALID_EDGE_TYPE', 'Unsupported relationship type: ' + String(e.type), p + '.type');
      if (!text(e.label ?? '', 120)) add('INVALID_EDGE_LABEL', 'Relationship label must be text of at most 120 characters.', p + '.label');
    }

    if (input.title !== undefined && !text(input.title, 120)) add('INVALID_TITLE', 'Diagram title must be text of at most 120 characters.', '$.title');
    if (input.schemaVersion !== undefined && input.schemaVersion !== 1) {
      add('UNSUPPORTED_SCHEMA_VERSION', 'Unsupported schema version: ' + String(input.schemaVersion), '$.schemaVersion');
    }
    return { ok: errors.length === 0, errors, warnings };
  }

  function normalizeDiagram(input) {
    const checked = validateDiagram(input);
    if (!checked.ok) {
      const error = new Error('Diagram validation failed: ' + checked.errors.map(x => x.code).join(', '));
      error.diagnostics = checked.errors;
      throw error;
    }
    return {
      schemaVersion: 1,
      title: String(input.title || 'Untitled UML diagram').slice(0, 120),
      id: Number.isSafeInteger(input.id) && input.id > 0 ? input.id : 1,
      nodes: input.nodes.map(n => ({
        ...n,
        id: n.id,
        name: String(n.name || n.type).slice(0, 120),
        description: String(n.description || '').slice(0, MAX_TEXT),
        members: Array.isArray(n.members) ? n.members.map(String) : [],
        x: Number(n.x), y: Number(n.y), w: Number(n.w), h: Number(n.h)
      })),
      edges: input.edges.map(e => ({ ...e, label: String(e.label || '').slice(0, 120) }))
    };
  }

  window.MLTADiagramModel = { validateDiagram, normalizeDiagram, NODE_TYPES: [...NODE_TYPES], EDGE_TYPES: [...EDGE_TYPES] };
})();