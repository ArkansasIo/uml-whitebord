(() => {
  async function run(prompt,opts={}){
    if(opts.local!==false&&window.AIBinderOllama){
      const r=await window.AIBinderOllama.generate(prompt,opts); if(r.ok)return r;
    }
    if(window.AIBinderServices?.request)return window.AIBinderServices.request(prompt);
    return {ok:false,message:'AI Binder service gateway is unavailable.'};
  }
  window.AIBinderBrain={run};
})();
