(() => {
  const KEY='ai-binder-service-state-v1';
  const defaults={provider:'offline',model:'local/default',connection:'not-configured',requests:0,lastRequest:null};
  const load=()=>{try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}}};
  const save=s=>localStorage.setItem(KEY,JSON.stringify(s));
  const state=load();
  function request(prompt){
    const q=String(prompt||'').trim();
    if(!q) throw new Error('Prompt is required.');
    state.requests++;state.lastRequest=Date.now();save(state);
    window.AIBinderWorkbenchData?.event('brain.request',q);
    return {ok:true,mode:'offline',model:state.model,message:`Request accepted by AI Binder offline gateway: ${q}`,next:'Connect an inference adapter to execute the model.'};
  }
  function configure(model){state.model=String(model||'local/default').trim()||'local/default';save(state);window.AIBinderWorkbenchData?.event('brain.configure',state.model);return state;}
  function status(){return {...state};}
  window.AIBinderServices={request,configure,status};
})();
