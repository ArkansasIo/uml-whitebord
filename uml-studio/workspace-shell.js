const WORKSPACES = {
  uml: { title: 'UML Designer', description: 'Visual architecture and relationship design.', cards: [['Class diagrams','Model domain types and relationships.'],['Architecture','Map services, APIs and dependencies.']] },
  brain: { title: 'Brain LLM', description: 'Local-first AI assistance through the Binder runtime.', cards: [['Model router','Select a local or remote model without changing the workspace.'],['Context','Build prompts from the active project and diagram.']] },
  agents: { title: 'Agent Workforce', description: 'Coordinate specialized agents through the module registry.', cards: [['Architect','Design and review system structure.'],['Developer','Implement bounded changes and tests.'],['Verifier','Check contracts, invariants and postconditions.']] },
  memory: { title: 'Project Memory', description: 'Persistent project knowledge, decisions and provenance.', cards: [['Timeline','Review project events and decisions.'],['Knowledge graph','Connect requirements, code, UML and documents.']] },
  source: { title: 'Source', description: 'Code intelligence and generated implementation surfaces.', cards: [['Symbols','Navigate indexed source symbols.'],['AI actions','Explain, refactor, test and document code.']] },
  docs: { title: 'Documentation', description: 'Specifications, research, notes and generated documentation.', cards: [['Documents','Open project Markdown and specifications.'],['AI documentation','Generate docs from verified project state.']] },
  git: { title: 'Git / GitHub', description: 'Repository state, changes, branches and deployment.', cards: [['Changes','Review working-tree and commit state.'],['Automation','Connect CI, Pages and release workflows.']] },
  runtime: { title: 'AI Binder Runtime', description: 'Module lifecycle, permissions, health and verification.', cards: [['Registry','Authoritative module execution boundary.'],['Verification','Contract, invariant and postcondition checks.']] }
};

function renderWorkspace(key) {
  const item = WORKSPACES[key] || WORKSPACES.uml;
  document.querySelectorAll('[data-workspace]').forEach((button) => button.classList.toggle('active', button.dataset.workspace === key));
  const title = document.getElementById('workspaceTitle');
  const description = document.getElementById('workspaceDescription');
  const cards = document.getElementById('workspaceCards');
  if (!title || !description || !cards) return;
  title.textContent = item.title;
  description.textContent = item.description;
  cards.replaceChildren(...item.cards.map(([name, detail]) => {
    const card = document.createElement('div');
    card.className = 'workspace-card';
    const strong = document.createElement('strong');
    strong.textContent = name;
    const span = document.createElement('span');
    span.textContent = detail;
    card.append(strong, span);
    return card;
  }));
  document.getElementById('crumb')?.replaceChildren(document.createTextNode(`Workspace / ${item.title}`));
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-workspace]').forEach((button) => button.addEventListener('click', () => renderWorkspace(button.dataset.workspace)));
  renderWorkspace('uml');
});

window.AIBinderWorkspace = { workspaces: WORKSPACES, renderWorkspace };
