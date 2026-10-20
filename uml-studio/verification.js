(() => {
  function validateScript(text){
    const errors=[];
    const source=String(text||'');
    if(!/workflow\s+[A-Za-z_][\w-]*\s*\{/.test(source)) errors.push('Missing workflow declaration.');
    if((source.match(/\{/g)||[]).length !== (source.match(/\}/g)||[]).length) errors.push('Unbalanced workflow braces.');
    const allowed=/^(workflow|agent|verify|persist|input|output|if|retry|timeout|end)\b/i;
    source.split(/\n/).map(x=>x.trim()).filter(Boolean).forEach((line,i)=>{
      if(line==='{'||line==='}') return;
      if(!allowed.test(line) && !/^[A-Za-z_][\w-]*\s*\{?$/.test(line)) errors.push(`Line ${i+1}: unsupported instruction.`);
    });
    return {ok:errors.length===0,errors};
  }
  function verify(result){
    const checks=[['input-contract',!!result],['process-invariants',result?.ok!==false],['output-postcondition',typeof result?.message==='string']];
    return {ok:checks.every(x=>x[1]),checks};
  }
  window.AIBinderVerification={validateScript,verify};
})();
