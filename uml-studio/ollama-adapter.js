(() => {
  const KEY='ai-binder-ollama-v1';
  const defaults={baseUrl:'http://127.0.0.1:11434',model:'llama3.2',timeoutMs:30000};
  const load=()=>{try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}}};
  const save=s=>localStorage.setItem(KEY,JSON.stringify(s));
  async function generate(prompt,opts={}){
    const s=load(), controller=new AbortController(), timer=setTimeout(()=>controller.abort(),Number(opts.timeoutMs||s.timeoutMs));
    try{
      const r=await fetch(s.baseUrl.replace(/\/$/,'')+'/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:s.model,prompt:String(prompt||''),stream:false}),signal:controller.signal});
      if(!r.ok)throw new Error(`Ollama HTTP ${r.status}`);
      const data=await r.json();window.AIBinderWorkbenchData?.event('ollama.generate',s.model);return {ok:true,response:data.response||'',model:data.model||s.model};
    }catch(e){window.AIBinderWorkbenchData?.event('ollama.error',e.message);return {ok:false,error:e.name==='AbortError'?'Ollama request timed out':e.message};}finally{clearTimeout(timer)}
  }
  function configure(patch={}){const s={...load(),...patch};save(s);window.AIBinderServices?.configure(s.model);return s}
  function status(){return load()}
  window.AIBinderOllama={generate,configure,status};
})();
