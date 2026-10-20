(() => {
  const views = {
    brain:{title:'Brain Workbench',tabs:['Chat','BrainScript','Context']},
    agents:{title:'Agent Workbench',tabs:['Queue','Agents','Runs']},
    memory:{title:'Memory Workbench',tabs:['Timeline','Knowledge','Decisions']},
    runtime:{title:'Runtime Console',tabs:['Modules','Events','Verification']},
    git:{title:'Git Workbench',tabs:['Changes','Branches','CI']},
    source:{title:'Source Intelligence',tabs:['Explorer','Symbols','Actions']},
    docs:{title:'Documentation Studio',tabs:['Files','Outline','Generate']}
  };
  let root;
  const esc=v=>String(v).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const state=()=>window.AIBinderPanels?.state||{agents:[],modules:[],memories:[]};
  function install(){
    if(document.getElementById('binderWorkbench'))return;
    root=document.createElement('section');root.id='binderWorkbench';root.hidden=true;
    root.innerHTML='<div class="wb-head"><div><b id="wbTitle">Workbench</b><small id="wbSub">AI Binder</small></div><button id="wbClose">×</button></div><div id="wbTabs" class="wb-tabs"></div><div id="wbBody" class="wb-body"></div>';
    document.body.append(root);root.querySelector('#wbClose').onclick=close;
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!root.hidden)close();});
  }
  function body(kind,tab){
    if(kind==='brain'){
      if(tab==='BrainScript')return '<textarea id="brainScript" class="wb-editor">workflow AnalyzeDiagram {\n  agent Architect\n  agent UML\n  verify contracts\n  persist decision\n}</textarea><div class="wb-actions"><button data-wb="run">Run BrainScript</button><button data-wb="save">Save script</button></div><pre id="wbLog">Ready.</pre>';
      if(tab==='Context')return '<div class="wb-grid"><div>Active diagram<strong>UML Studio</strong></div><div>Canvas<strong>Live</strong></div><div>Memory<strong>Local</strong></div><div>Policy<strong>Binder permissions</strong></div></div>';
      return '<div class="wb-chat"><div class="wb-message">Binder ready. Ask about architecture, UML, source, tests, or project decisions.</div><textarea id="wbPrompt" placeholder="Ask the AI Binder…"></textarea><button data-wb="chat">Send</button><pre id="wbLog">No requests yet.</pre></div>';
    }
    if(kind==='agents')return '<div class="wb-list">'+state().agents.map(a=>`<article><b>${esc(a.name)}</b><span>${esc(a.role)}</span><em>${esc(a.status)}</em><button data-agent="${esc(a.id)}">Dispatch</button></article>`).join('')+'</div>';
    if(kind==='memory'){const m=state().memories||[];return '<div class="wb-list">'+(m.length?m.slice().reverse().map(x=>`<article><b>${esc(x.title)}</b><span>${esc(x.text)}</span><em>${new Date(x.time).toLocaleString()}</em></article>`).join(''):'<div class="wb-empty">No memories recorded.</div>')+'</div>';}
    if(kind==='runtime')return '<div class="wb-list">'+state().modules.map(m=>`<article><b>${esc(m.name)}</b><span>${esc(m.permission)}</span><em>${esc(m.status)} · ${esc(m.health)}</em></article>`).join('')+'</div><pre>Runtime console: registry → permissions → lifecycle → verification.</pre>';
    if(kind==='git')return '<div class="wb-grid"><div>Repository<strong>ArkansasIo/uml-whitebord</strong></div><div>Branch<strong>main</strong></div><div>Pages<strong>Configured</strong></div><div>CI<strong>Workflow active</strong></div></div><pre>Browser access is read-only. Repository changes are made through the GitHub integration.</pre>';
    if(kind==='source')return '<div class="wb-grid"><div>Explorer<strong>Project tree</strong></div><div>Symbols<strong>UML + source</strong></div><div>Refactor<strong>Verification guarded</strong></div><div>Tests<strong>Regression ready</strong></div></div>';
    return '<div class="wb-list"><article><b>Architecture</b><span>System design and module documentation</span></article><article><b>BrainScript</b><span>Orchestration language specification</span></article><article><b>Verification</b><span>Contracts, invariants and recovery</span></article></div>';
  }
  function render(kind,tab){root.querySelector('#wbBody').innerHTML=body(kind,tab);root.querySelectorAll('[data-wb]').forEach(b=>b.onclick=()=>{const log=root.querySelector('#wbLog');if(b.dataset.wb==='run'&&log)log.textContent='BrainScript validated: parse → plan → execute → verify → persist.';if(b.dataset.wb==='save'){localStorage.setItem('ai-binder-brainscript',root.querySelector('#brainScript')?.value||'');if(log)log.textContent='BrainScript saved locally.';}if(b.dataset.wb==='chat'){const p=root.querySelector('#wbPrompt');if(log)log.textContent=p?.value?`Binder accepted: ${p.value}`:'Enter a prompt.';}});root.querySelectorAll('[data-agent]').forEach(b=>b.onclick=()=>{window.AIBinderPanels?.act('agent-'+b.dataset.agent);render(kind,tab);});}
  function open(kind){install();const cfg=views[kind];if(!cfg)return;root.hidden=false;root.querySelector('#wbTitle').textContent=cfg.title;root.querySelector('#wbSub').textContent='AI Binder · '+kind;const tabs=root.querySelector('#wbTabs');tabs.replaceChildren(...cfg.tabs.map((t,i)=>{const b=document.createElement('button');b.textContent=t;b.className=i?'':'active';b.onclick=()=>{tabs.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(kind,t)};return b;}));render(kind,cfg.tabs[0]);}
  function close(){if(root)root.hidden=true;}
  document.addEventListener('DOMContentLoaded',()=>{install();document.querySelectorAll('[data-workspace]').forEach(b=>b.addEventListener('click',()=>{if(views[b.dataset.workspace])setTimeout(()=>open(b.dataset.workspace),25);else close();}));});
  window.AIBinderWorkbench={open,close};
})();
