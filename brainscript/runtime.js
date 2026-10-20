const TOKEN = /^[A-Za-z_][A-Za-z0-9_-]*$/;
export function parseBrainScript(source) {
  const lines = source.split(/\r?\n/).map((raw, i) => ({ raw: raw.trim(), line: i + 1 })).filter(x => x.raw && !x.raw.startsWith('#') && !x.raw.startsWith('//'));
  const workflow = { type: 'workflow', id: null, agent: null, inputs: [], steps: [], verification: { contract: false, tests: false, self_verify: false, recovery: false } };
  let section = null;
  for (const { raw, line } of lines) {
    if (raw.startsWith('workflow ')) { const id = raw.slice(9).trim().replace(/\s*\{?$/, ''); if (!TOKEN.test(id)) throw new Error(`Invalid workflow id at line ${line}`); workflow.id = id; section = 'root'; continue; }
    if (raw === 'steps {' || raw === 'verification {') { section = raw.startsWith('steps') ? 'steps' : 'verification'; continue; }
    if (raw === '}') { section = 'root'; continue; }
    if (section === 'steps' && TOKEN.test(raw)) { workflow.steps.push(raw); continue; }
    if (section === 'verification') { const m = raw.match(/^(contract|tests|self_verify|recovery)\s*=\s*(true|false)$/); if (!m) throw new Error(`Invalid verification statement at line ${line}`); workflow.verification[m[1]] = m[2] === 'true'; continue; }
    let m = raw.match(/^agent\s*=\s*([A-Za-z_][\w-]*)$/); if (m) { workflow.agent = m[1]; continue; }
    m = raw.match(/^inputs\s*=\s*\[(.*)\]$/); if (m) { workflow.inputs = m[1].split(',').map(v => v.trim()).filter(Boolean); continue; }
  }
  if (!workflow.id) throw new Error('BrainScript requires a workflow declaration');
  return workflow;
}

export class BrainScriptRuntime {
  constructor(registry) { this.registry = registry; }
  async run(program, context = {}) {
    const agent = program.agent ?? 'development';
    const results = [];
    for (const step of program.steps) results.push(await this.registry.execute(agent, { step, inputs: program.inputs, context }, context));
    return { workflow: program.id, results, verification: program.verification };
  }
}
