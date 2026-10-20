(() => {
  const KEY='ai-binder-ollama-v1';
  const defaults={baseUrl:'http://127.0.0.1:11434',model:'llama3.2',timeoutMs:30000};
  const load=()=>{try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}}};
  const save=s=>localStorage.setItem(KEY,JSON.stringify(s));
  const emit=(type,message)=>window.AIBinderData?.event(type,message);
  async function generate(prompt,opts={}){const s=load(),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),Number(opts.timeoutMs||s.timeoutMs));try{const r=await fetch(s.baseUrl.replace(/\/$/,'')+'/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:s.model,prompt:String(prompt||''),stream:false}),signal:controller.signal});if(!r.ok)throw new Error(`Ollama HTTP ${r.status}`);const data=await r.json();emit('ollama.generate',s.model);return {ok:true,response:data.response||'',model:data.model||s.model};}catch(e){emit('ollama.error',e.message);return {ok:false,error:e.name==='AbortError'?'Ollama request timed out':e.message};}finally{clearTimeout(timer)}}
  function configure(patch={}){const s={...load(),...patch};save(s);window.AIBinderServices?.configure(s.model);emit('ollama.configure',`${s.baseUrl} · ${s.model}`);return s}
  function status(){return load()}
  async function ping(){const s=load();try{const r=await fetch(s.baseUrl.replace(/\/$/,'')+'/api/tags');if(!r.ok)throw new Error(`Ollama HTTP ${r.status}`);const data=await r.json();emit('ollama.ping','connected');return {ok:true,models:(data.models||[]).map(m=>m.name)};}catch(e){emit('ollama.ping','offline');return {ok:false,error:e.message}}}
  window.AIBinderOllama={generate,configure,status,ping};
})();
