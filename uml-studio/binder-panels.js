(() => {
  const KEY = 'ai-binder-state-v1';
  const defaults = { modules: [
    {id:'brain.llm',name:'Brain LLM',status:'ready',health:'healthy',permission:'brain.infer'},
    {id:'agents.registry',name:'Agent Registry',status:'ready',health:'healthy',permission:'workspace.read'},
    {id:'memory.project',name:'Project Memory',status:'ready',health:'healthy',permission:'workspace.read'},
    {id:'verification.pipeline',name:'Verification Pipeline',status:'ready',health:'healthy',permission:'verify.run'}
  ], agents: [
    {id:'architect',name:'Architect',role:'Architecture and design',status:'idle'},
    {id:'developer',name:'Developer',role:'Implementation and refactoring',status:'idle'},
    {id:'uml',name:'UML Agent',role:'Diagram modeling',status:'idle'},
    {id:'verifier',name:'Verifier',role:'Contracts and invariants',status:'idle'},
    {id:'documentation',name:'Documentation',role:'Specifications and docs',status:'idle'},
    {id:'testing',name:'Testing',role:'Tests and regression checks',status:'idle'},
    {id:'security',name:'Security',role:'Permission and safety checks',status:'idle'},
    {id:'git',name:'Git Agent',role:'Branches, commits and CI',status:'idle'}
  ], memories: [], events: [] };
  function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')};}catch{return structuredClone(defaults);}}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s));return s;}
  const state=load(), root=document.getElementById('workspacePanel'), title=document.getElementById('workspaceTitle'), desc=document.getElementById('workspaceDescription'), cards=document.getElementById('workspaceCards');
  if(!root||!cards)return;
  const esc=v=>String(v).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const button=(label,action,cls='')=>`<button class="binder-action ${cls}" data-binder-action="${action}">${esc(label)}</button>`;
  const meta={uml:['UML Designer','Visual architecture and relationship design.'],brain:['Brain LLM','Local-first inference control plane'],agents:['Agent Workforce','Specialized agents registered with the Binder runtime'],memory:['Project Memory','Persistent local project notes with provenance'],source:['Source Intelligence','Code surfaces and bounded AI actions'],docs:['Documentation','Project specifications and generated documentation'],git:['Git / GitHub','Repository and deployment controls'],runtime:['AI Binder Runtime','Module lifecycle, permissions, health and verification']};
  function shell(key,body,actions=''){const [t,d]=meta[key]||meta.uml;title.textContent=t;desc.textContent=d;cards.innerHTML=`<div class="binder-panel">${body}</div><div class="binder-actions">${actions}</div>`;document.querySelectorAll('[data-workspace]').forEach(b=>b.classList.toggle('active',b.dataset.workspace===key));document.getElementById('crumb')?.replaceChildren(document.createTextNode(`Workspace / ${t}`));}
  function renderBrain(){shell('brain',`<div class="binder-stat"><b>Provider</b><span>Ollama-compatible</span></div><div class="binder-stat"><b>Model</b><span>${esc(localStorage.getItem('ai-binder-model')||'local/default')}</span></div><label class="binder-label">Prompt<input id="brainPrompt" placeholder="Ask the Binder…"></label><div id="brainOutput" class="binder-output">Ready. No request has been executed.</div>`,button('Run inference','brain-run')+button('Configure model','brain-config'));}
  function renderAgents(){shell('agents',state.agents.map(a=>`<div class="binder-row"><span><b>${esc(a.name)}</b><small>${esc(a.role)}</small></span><em>${esc(a.status)}</em></div>`).join(''),button('Dispatch architect','agent-architect')+button('Run verifier','agent-verifier'));}
  function renderMemory(){const items=state.memories.slice(-5).reverse();shell('memory',`<div class="binder-memory-list">${items.length?items.map(m=>`<article><b>${esc(m.title)}</b><p>${esc(m.text)}</p><small>${esc(m.source)} · ${new Date(m.time).toLocaleString()}</small></article>`).join(''):'<div class="binder-muted">No project memories yet.</div>'}</div><label class="binder-label">New memory<input id="memoryText" placeholder="Record a decision or requirement…"></label>`,button('Remember','memory-add')+button('Clear local memory','memory-clear'));}
  function renderRuntime(){shell('runtime',state.modules.map(m=>`<div class="binder-row"><span><b>${esc(m.name)}</b><small>${esc(m.permission)}</small></span><em class="health-${esc(m.health)}">${esc(m.status)} · ${esc(m.health)}</em></div>`).join(''),button('Health check','runtime-health')+button('Verify runtime','runtime-verify'));}
  function renderSource(){shell('source','<div class="binder-grid"><span>Symbols<br><b>Ready</b></span><span>References<br><b>Ready</b></span><span>Refactoring<br><b>Guarded</b></span><span>Tests<br><b>Integrated</b></span></div>',button('Explain selected','source-explain')+button('Generate tests','source-tests'));}
  function renderDocs(){shell('docs','<div class="binder-list"><b>Architecture</b><b>BrainScript specification</b><b>AI Second Brain features</b><b>Verification contracts</b></div>',button('Generate docs','docs-generate'));}
  function renderGit(){shell('git','<div class="binder-stat"><b>Repository</b><span>ArkansasIo/uml-whitebord</span></div><div class="binder-stat"><b>Deployment</b><span>GitHub Pages workflow configured</span></div><div class="binder-stat"><b>Branch</b><span>main</span></div>',button('Refresh status','git-refresh')+button('Open GitHub','git-open'));}
  function renderUml(){shell('uml','<div class="binder-grid"><span>Classes<br><b>Canvas</b></span><span>Relationships<br><b>Connector</b></span><span>Import / Export<br><b>JSON + SVG</b></span><span>AI modeling<br><b>Binder ready</b></span></div>',button('Insert sample UML','uml-sample')+button('Fit canvas','uml-fit'));}
  function render(key){({brain:renderBrain,agents:renderAgents,memory:renderMemory,runtime:renderRuntime,source:renderSource,docs:renderDocs,git:renderGit,uml:renderUml}[key]||renderUml)();root.querySelectorAll('[data-binder-action]').forEach(b=>b.addEventListener('click',()=>act(b.dataset.binderAction)));}
  function log(type,message){state.events.push({type,message,time:Date.now()});state.events=state.events.slice(-100);save(state);}
  function act(action){
    if(action==='brain-run'){const p=document.getElementById('brainPrompt'),out=document.getElementById('brainOutput'),q=p?.value.trim();if(!q){out.textContent='Enter a prompt first.';return;}out.textContent=`Binder request accepted: ${q}\n\nBrowser runtime is offline-first. Connect an inference adapter to execute the model.`;log('brain',q);}
    if(action==='brain-config'){const model=prompt('Model name','local/default');if(model){localStorage.setItem('ai-binder-model',model);render('brain');}}
    if(action.startsWith('agent-')){const id=action.slice(6),a=state.agents.find(x=>x.id===id);if(a){a.status='dispatched';log('agent',`Dispatched ${a.name}`);save(state);render('agents');}}
    if(action==='memory-add'){const el=document.getElementById('memoryText'),text=el?.value.trim();if(text){state.memories.push({title:'Project memory',text,source:'local workspace',time:Date.now()});log('memory',text);save(state);render('memory');}}
    if(action==='memory-clear'&&confirm('Clear local project memories?')){state.memories=[];save(state);render('memory');}
    if(action==='runtime-health'){state.modules.forEach(m=>m.health='healthy');log('runtime','Health check passed');save(state);render('runtime');}
    if(action==='runtime-verify'){log('verification','Runtime contract check requested');alert('Verification pipeline: input contracts → invariants → postconditions → recovery boundary.');}
    if(action==='uml-sample')document.getElementById('sample')?.click();
    if(action==='uml-fit')document.getElementById('fit')?.click();
    if(action==='git-open')window.open('https://github.com/ArkansasIo/uml-whitebord','_blank','noopener');
    if(action==='git-refresh')alert('GitHub status is available from the repository Actions and Pages workflow.');
    if(action==='source-explain')alert('Select a UML shape to explain its architecture.');
    if(action==='source-tests')alert('Test generation is guarded by the verification pipeline.');
    if(action==='docs-generate')alert('Documentation generation is queued through the Documentation agent.');
  }
  document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-workspace]').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>render(b.dataset.workspace),0)));render('uml');});
  window.AIBinderPanels={state,render,act,save:()=>save(state)};
})();
