(() => {
  function install() {
    if (document.getElementById('commandPalette')) return;
    const wrap=document.createElement('div'); wrap.id='commandPalette'; wrap.hidden=true;
    wrap.innerHTML='<div class="command-backdrop"></div><section class="command-box" role="dialog" aria-label="Command palette"><input id="commandInput" autocomplete="off" placeholder="Type a command…"><div id="commandList"></div><small>Ctrl/Cmd+K · Esc</small></section>';
    document.body.appendChild(wrap);
    const commands=[
      ['UML: New class',()=>document.getElementById('addClass')?.click()],
      ['UML: New note',()=>document.getElementById('addNote')?.click()],
      ['UML: Insert sample',()=>document.getElementById('sample')?.click()],
      ['Canvas: Fit',()=>document.getElementById('fit')?.click()],
      ['Brain: Open',()=>window.AIBinderPanels?.render('brain')],
      ['Agents: Open',()=>window.AIBinderPanels?.render('agents')],
      ['Memory: Open',()=>window.AIBinderPanels?.render('memory')],
      ['Runtime: Health check',()=>{window.AIBinderPanels?.render('runtime');setTimeout(()=>window.AIBinderPanels?.act('runtime-health'),0)}],
      ['Git: Open repository',()=>window.open('https://github.com/ArkansasIo/uml-whitebord','_blank','noopener')]
    ];
    const input=wrap.querySelector('#commandInput'), list=wrap.querySelector('#commandList'); let selected=0, filtered=commands;
    function draw(){list.replaceChildren(...filtered.map(([name,fn],i)=>{const b=document.createElement('button');b.textContent=name;b.className=i===selected?'selected':'';b.onclick=()=>{fn();close()};return b;}));}
    function open(){wrap.hidden=false;input.value='';selected=0;filtered=commands;draw();setTimeout(()=>input.focus(),0)}
    function close(){wrap.hidden=true}
    input.addEventListener('input',()=>{const q=input.value.toLowerCase();filtered=commands.filter(([n])=>n.toLowerCase().includes(q));selected=0;draw()});
    input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();selected=Math.min(selected+1,Math.max(filtered.length-1,0));draw()}else if(e.key==='ArrowUp'){e.preventDefault();selected=Math.max(selected-1,0);draw()}else if(e.key==='Enter'){e.preventDefault();filtered[selected]?.[1]();close()}else if(e.key==='Escape')close()});
    wrap.querySelector('.command-backdrop').onclick=close;
    document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();open()}else if(e.key==='Escape'&&!wrap.hidden)close()});
  }
  document.addEventListener('DOMContentLoaded',install);
})();
