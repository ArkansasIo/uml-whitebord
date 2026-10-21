(() => {
  const STORAGE='ai-binder-agent-v1';
  const defaults={name:'UML Agent',system:'You are a local-first UML architecture agent. Be concise, inspect the current diagram before proposing changes, and never claim a mutation happened unless the tool reports success.',maxSteps:4,autoApprove:false};
  const load=()=>{try{return {...defaults,...JSON.parse(localStorage.getItem(STORAGE)||'{}')}}catch{return {...defaults}}};
  const save=s=>localStorage.setItem(STORAGE,JSON.stringify(s));
  const emit=(type,message)=>window.AIBinderData?.event(type,message);
  const state=()=>{try{const d=JSON.parse(localStorage.getItem('mlta-uml-studio')||'null');return {title:document.getElementById('title')?.value||d?.title||'Untitled',shapes:d?.nodes||[],connectors:d?.edges||[]}}catch{return {title:document.getElementById('title')?.value||'Untitled',shapes:[],connectors:[]}}};
  const tools={
    inspect_diagram:()=>({ok:true,diagram:state()}),
    validate_diagram:()=>{const errors=window.UMLFeatureTools?.validate?.();return {ok:Array.isArray(errors)&&errors.length===0,errors:Array.isArray(errors)?errors:['Validation tool unavailable']};},
    auto_layout:()=>{window.UMLFeatureTools?.autoLayout?.();return {ok:true,message:'Automatic layout requested.'};},
    duplicate_selection:()=>{window.UMLFeatureTools?.duplicate?.();return {ok:true,message:'Duplicate selection requested.'};}
  };
  async function runTool(name,args={}){if(!tools[name])return {ok:false,error:`Unknown tool: ${name}`};emit('agent.tool',name);try{return await tools[name](args)}catch(e){return {ok:false,error:e.message}}}
  function buildPrompt(history,user){const s=state();return `${load().system}\n\nCurrent diagram JSON:\n${JSON.stringify(s).slice(0,14000)}\n\nAvailable tools: inspect_diagram, validate_diagram, auto_layout, duplicate_selection.\nWhen a tool is needed, output exactly one line: TOOL:<name> then continue with a short explanation.\nConversation:\n${history.map(x=>`${x.role}: ${x.content}`).join('\n')}\nuser: ${user}`}
  async function chat(user,history=[]){
    const settings=load();
    if(!window.AIBinderOllama?.generate)return {ok:false,error:'Local Ollama adapter is unavailable.'};
    let prompt=buildPrompt(history,user);
    for(let step=0;step<settings.maxSteps;step++){
      const result=await window.AIBinderOllama.generate(prompt);
      if(!result.ok)return result;
      const match=result.response.match(/TOOL:\s*([a-z_]+)/i);
      if(!match)return {ok:true,response:result.response,steps:step+1};
      const tool=match[1].toLowerCase();
      const output=await runTool(tool);
      prompt += `\nagent: ${result.response}\ntool(${tool}): ${JSON.stringify(output)}\nContinue from the tool result. Do not repeat the TOOL line unless another tool is required.`;
    }
    return {ok:true,response:'I reached the agent step limit. Review the current diagram and run the requested tool again if needed.',steps:settings.maxSteps};
  }
  function configure(patch={}){const s={...load(),...patch};save(s);return s}
  window.AIBinderAgent={chat,configure,status:load,tools,inspect:state};
})();
