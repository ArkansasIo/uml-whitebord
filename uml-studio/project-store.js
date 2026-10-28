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
  root.MLTAUMLProjectStore={version:VERSION,create,save,list,load,remove,exportProject,importProject};
})(window);
