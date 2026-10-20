(() => {
  const KEY = 'ai-binder-workbench-v1';
  const defaults = { tasks: [], runs: [], decisions: [], events: [], scripts: [] };
  const clone = v => JSON.parse(JSON.stringify(v));
  function load(){ try { return {...clone(defaults), ...JSON.parse(localStorage.getItem(KEY)||'{}')}; } catch { return clone(defaults); } }
  const state = load();
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); window.dispatchEvent(new CustomEvent('binder:data-changed')); return state; }
  function add(collection, value){ state[collection].push({...value, id:value.id||crypto.randomUUID?.()||String(Date.now()), time:value.time||Date.now()}); save(); return value; }
  function event(type, message){ add('events',{type,message}); }
  function queue(agent, prompt){ return add('tasks',{agent,prompt,status:'queued'}); }
  function run(name,status='completed'){ return add('runs',{name,status}); }
  function decision(title,text){ return add('decisions',{title,text}); }
  window.AIBinderData = { state, save, add, event, queue, run, decision };
})();
