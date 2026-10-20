(() => {
  function parse(source){
    const text=String(source||'');
    const m=text.match(/workflow\s+([A-Za-z_][\w]*)\s*\{([\s\S]*)\}/);
    if(!m)return {ok:false,errors:['Expected workflow Name { ... }']};
    const lines=m[2].split(/\r?\n/).map(x=>x.trim()).filter(Boolean), steps=[];
    for(const line of lines){
      const parts=line.split(/\s+/); if(parts[0]==='agent'&&parts[1])steps.push({type:'agent',name:parts.slice(1).join(' ')});
      else if(parts[0]==='verify')steps.push({type:'verify',name:parts.slice(1).join(' ')||'default'});
      else if(parts[0]==='persist')steps.push({type:'persist',name:parts.slice(1).join(' ')||'result'});
      else if(parts[0]==='input'||parts[0]==='output')steps.push({type:parts[0],name:parts.slice(1).join(' ')});
      else return {ok:false,errors:[`Unknown instruction: ${line}`]};
    }
    return {ok:true,name:m[1],steps};
  }
  async function execute(source,context={}){
    const parsed=parse(source); if(!parsed.ok)return parsed;
    window.AIBinderData?.event('brainscript.start',parsed.name);
    const results=[];
    for(const step of parsed.steps){
      if(step.type==='agent')results.push({step,status:'queued',detail:'Agent execution boundary reached'});
      else if(step.type==='verify')results.push({step,status:'verified',detail:'Verification boundary reached'});
      else if(step.type==='persist'){window.AIBinderData?.decision(step.name,JSON.stringify(context));results.push({step,status:'persisted'});}
      else results.push({step,status:'accepted'});
    }
    window.AIBinderData?.run(parsed.name,'completed');
    return {ok:true,name:parsed.name,results};
  }
  window.AIBinderBrainScript={parse,execute};
})();
