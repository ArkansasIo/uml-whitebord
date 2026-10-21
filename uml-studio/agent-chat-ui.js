(() => {
  function el(tag,props={},children=[]){const n=document.createElement(tag);Object.entries(props).forEach(([k,v])=>k==='className'?n.className=v:k==='textContent'?n.textContent=v:n.setAttribute(k,v));n.append(...children);return n}
  function boot(){
    const launch=el('button',{className:'agent-launch',id:'agentLaunch',textContent:'✦ AI Agent'});
    document.querySelector('.topbar')?.append(launch);
    const dialog=el('dialog',{className:'agent-dialog',id:'agentDialog'});
    const head=el('header',{className:'agent-head'},[el('div',{},[el('strong',{textContent:'Local AI Chat Agent'}),el('small',{textContent:'Open-source, Ollama-powered agent runtime'})]),el('button',{id:'agentClose',textContent:'✕'})]);
    const settings=el('div',{className:'agent-settings'},[el('input',{id:'agentModel',placeholder:'Ollama model, e.g. llama3.2'}),el('label',{},[el('input',{id:'agentApprove',type:'checkbox'}),el('span',{textContent:'auto-approve tools'})])]);
    const messages=el('div',{className:'agent-messages',id:'agentMessages'},[el('div',{className:'agent-empty'},[el('b',{textContent:'Your local architecture agent is ready.'}),el('span',{textContent:'Ask it to inspect, validate, explain, duplicate, or lay out the current UML diagram.'})])]);
    const status=el('div',{className:'agent-status',id:'agentStatus',textContent:'Checking Ollama…'});
    const input=el('textarea',{id:'agentInput',placeholder:'Ask the agent something…'}); const send=el('button',{className:'primary',id:'agentSend',textContent:'Send'});
    const compose=el('form',{className:'agent-compose'},[input,send]);
    dialog.append(head,settings,el('div',{className:'agent-body'},[messages,status,compose]));document.body.append(dialog);
    const cfg=window.AIBinderAgent?.status?.()||{};document.getElementById('agentModel').value=window.AIBinderOllama?.status?.().model||'llama3.2';document.getElementById('agentApprove').checked=!!cfg.autoApprove;
    function add(role,text){messages.querySelector('.agent-empty')?.remove();messages.append(el('div',{className:`agent-msg ${role}`,textContent:text}));messages.scrollTop=messages.scrollHeight}
    async function ping(){const r=await window.AIBinderOllama?.ping?.();status.textContent=r?.ok?`Ollama connected · ${r.models?.join(', ')||'model ready'}`:'Ollama offline — install/start Ollama and load a model.'}
    document.getElementById('agentModel').addEventListener('change',e=>window.AIBinderOllama?.configure({model:e.target.value.trim()||'llama3.2'}));
    document.getElementById('agentApprove').addEventListener('change',e=>window.AIBinderAgent?.configure({autoApprove:e.target.checked}));
    document.getElementById('agentClose').onclick=()=>dialog.close();launch.onclick=()=>{dialog.showModal();ping()};
    compose.onsubmit=async e=>{e.preventDefault();const text=input.value.trim();if(!text)return;input.value='';add('user',text);send.disabled=true;status.textContent='Agent is thinking…';const history=[...messages.querySelectorAll('.agent-msg')].map(n=>({role:n.classList.contains('user')?'user':'assistant',content:n.textContent}));const r=await window.AIBinderAgent.chat(text,history.slice(-10));if(r?.ok)add('agent',r.response);else add('agent',`Agent error: ${r?.error||'unknown error'}`);send.disabled=false;ping()};
    ping();
  }
  document.addEventListener('DOMContentLoaded',boot);
})();
