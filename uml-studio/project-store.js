/* MLTA Project Store — offline-first multi-diagram project storage. */
(function(root){
  "use strict";
  const PREFIX="mlta-uml-project:";
  const INDEX="mlta-uml-project-index";
  const VERSION=1;
  const copy=v=>JSON.parse(JSON.stringify(v));
  const id=()=> "p-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9);
  function readIndex(){try{const v=JSON.parse(root.localStorage.getItem(INDEX)||"[]");return Array.isArray(v)?v:[];}catch{return [];}}
  function writeIndex(items){root.localStorage.setItem(INDEX,JSON.stringify(items));}
  function normalizeProject(p){
    if(!p||typeof p!=="object")throw new Error("Project must be an object.");
    const project={schemaVersion:VERSION,id:String(p.id||id()),name:String(p.name||"Untitled project").slice(0,120),description:String(p.description||"").slice(0,2000),updatedAt:new Date().toISOString(),diagrams:Array.isArray(p.diagrams)?p.diagrams.map(d=>({id:String(d.id||id()),title:String(d.title||"Untitled diagram").slice(0,120),type:String(d.type||"class"),model:copy(d.model||{nodes:[],edges:[]})})):[]};
    if(project.diagrams.length>500)throw new Error("A project may contain at most 500 diagrams.");
    const seen=new Set();
    for(const d of project.diagrams){if(seen.has(d.id))throw new Error("Duplicate diagram ID: "+d.id);seen.add(d.id);if(!d.model||!Array.isArray(d.model.nodes)||!Array.isArray(d.model.edges))throw new Error("Diagram model must contain nodes and edges.");if(d.model.nodes.length>5000||d.model.edges.length>15000)throw new Error("Diagram exceeds element limits.");}
    return project;
  }
  function save(project){const p=normalizeProject(project);root.localStorage.setItem(PREFIX+p.id,JSON.stringify(p));const items=readIndex().filter(x=>x.id!==p.id);items.unshift({id:p.id,name:p.name,updatedAt:p.updatedAt,diagramCount:p.diagrams.length});writeIndex(items.slice(0,200));return copy(p);}
  function list(){return readIndex().map(copy);}
  function load(projectId){const raw=root.localStorage.getItem(PREFIX+String(projectId));if(!raw)return null;return normalizeProject(JSON.parse(raw));}
  function remove(projectId){root.localStorage.removeItem(PREFIX+String(projectId));writeIndex(readIndex().filter(x=>x.id!==projectId));return true;}
  function exportProject(project){return JSON.stringify(normalizeProject(project),null,2);}
  function importProject(raw){const p=normalizeProject(typeof raw==="string"?JSON.parse(raw):raw);return save(p);}
  function create(name){return save({name:name||"Untitled project",description:"",diagrams:[]});}
  function captureCurrent(projectId){
    const project=load(projectId);if(!project)throw new Error("Project not found.");
    const raw=root.localStorage.getItem("mlta-uml-studio");if(!raw)throw new Error("No saved current diagram found. Save a diagram in the editor first.");
    const model=JSON.parse(raw);if(!Array.isArray(model.nodes)||!Array.isArray(model.edges))throw new Error("Current saved diagram is invalid.");
    const title=String(model.title||"Untitled diagram").slice(0,120);
    const diagram={id:"d-"+Date.now().toString(36),title,type:"class",model:{nodes:model.nodes,edges:model.edges}};
    project.diagrams.push(diagram);return save(project);
  }
  function download(name,content,type){
    const blob=new Blob([content],{type:type||"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function installProjectButton(){
    const toolbar=document.querySelector(".toolbar");
    if(!toolbar||document.getElementById("umlProjectsButton"))return;
    const button=document.createElement("button");button.id="umlProjectsButton";button.textContent="Projects";button.title="Manage local UML projects";
    button.addEventListener("click",()=>{
      let dialog=document.getElementById("umlProjectsDialog");
      if(!dialog){
        dialog=document.createElement("dialog");dialog.id="umlProjectsDialog";
        dialog.style.cssText="width:min(640px,calc(100% - 24px));max-height:85vh;overflow:auto;border:1px solid #d8dfeb;border-radius:12px;padding:18px;color:#23314a";
        const head=document.createElement("div");head.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:10px";
        const title=document.createElement("h2");title.textContent="Local UML Projects";title.style.margin="0";
        const close=document.createElement("button");close.textContent="Close";close.addEventListener("click",()=>dialog.close());head.append(title,close);
        const note=document.createElement("p");note.textContent="Projects are stored in this browser only. Capture a saved diagram into a project, or export/import a portable project JSON file.";note.style.color="#64748b";
        const actions=document.createElement("div");actions.style.cssText="display:flex;flex-wrap:wrap;gap:8px;margin:12px 0";
        const createButton=document.createElement("button");createButton.textContent="New project";
        const importButton=document.createElement("button");importButton.textContent="Import project JSON";
        const file=document.createElement("input");file.type="file";file.accept=".json,application/json";file.hidden=true;
        const listBox=document.createElement("div");listBox.id="umlProjectsList";
        createButton.addEventListener("click",()=>{const name=prompt("Project name","New UML project");if(name===null)return;try{create(name);renderList();}catch(e){alert(e.message);}});
        importButton.addEventListener("click",()=>file.click());
        file.addEventListener("change",async()=>{const f=file.files&&file.files[0];if(!f)return;try{importProject(await f.text());renderList();}catch(e){alert("Project import failed: "+e.message);}finally{file.value="";}});
        actions.append(createButton,importButton,file);dialog.append(head,note,actions,listBox);document.body.append(dialog);
        function renderList(){
          listBox.replaceChildren();const projects=list();
          if(!projects.length){const empty=document.createElement("p");empty.textContent="No projects yet. Create one to begin.";listBox.append(empty);return;}
          for(const p of projects){const row=document.createElement("section");row.style.cssText="border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin:8px 0";
            const name=document.createElement("strong");name.textContent=p.name;const meta=document.createElement("p");meta.textContent=(p.diagramCount||0)+" diagrams · updated "+new Date(p.updatedAt).toLocaleString();meta.style.cssText="font-size:12px;color:#64748b";
            const controls=document.createElement("div");controls.style.cssText="display:flex;gap:6px;flex-wrap:wrap";
            const capture=document.createElement("button");capture.textContent="Capture current saved diagram";capture.addEventListener("click",()=>{try{captureCurrent(p.id);renderList();}catch(e){alert(e.message);}});
            const exportButton=document.createElement("button");exportButton.textContent="Export JSON";exportButton.addEventListener("click",()=>{try{const project=load(p.id);download((project.name||"uml-project").toLowerCase().replace(/[^a-z0-9]+/g,"-")+".json",exportProject(project));}catch(e){alert(e.message);}});
            const deleteButton=document.createElement("button");deleteButton.textContent="Delete";deleteButton.addEventListener("click",()=>{if(confirm('Delete project "'+p.name+'"?')){remove(p.id);renderList();}});
            controls.append(capture,exportButton,deleteButton);row.append(name,meta,controls);listBox.append(row);
          }
        }
        dialog._renderProjectList=renderList;
      }
      dialog._renderProjectList();dialog.showModal();
    });
    toolbar.append(button);
  }
  root.MLTAUMLProjectStore={version:VERSION,create,save,list,load,remove,exportProject,importProject,captureCurrent};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",installProjectButton);else installProjectButton();
})(window);
