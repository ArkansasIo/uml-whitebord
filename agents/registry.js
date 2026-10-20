export const AGENTS = [
  { id: 'architect', name: 'Architect', capabilities: ['design','review'] },
  { id: 'uml', name: 'UML Designer', capabilities: ['uml'] },
  { id: 'blueprint', name: 'Blueprint Designer', capabilities: ['blueprint'] },
  { id: 'development', name: 'Developer', capabilities: ['code','refactor'] },
  { id: 'documentation', name: 'Documentation Agent', capabilities: ['docs'] },
  { id: 'testing', name: 'Test Agent', capabilities: ['test'] },
  { id: 'security', name: 'Security Agent', capabilities: ['security'] },
  { id: 'git', name: 'Git Agent', capabilities: ['git'] },
  { id: 'verification', name: 'Verification Agent', capabilities: ['verify'] }
];

export function createAgentModules(Module) { return AGENTS.map(agent => new Module({ id: agent.id, name: agent.name, version: '0.1.0', dependencies: [], permissions: [], capabilities: agent.capabilities })); }
