(() => {
  function run(prompt){
    if(window.AIBinderServices?.request)return window.AIBinderServices.request(prompt);
    return {ok:false,message:'AI Binder service gateway is unavailable.'};
  }
  window.AIBinderBrain={run};
})();
