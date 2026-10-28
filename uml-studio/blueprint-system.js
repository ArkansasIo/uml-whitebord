/* MLTA UML Blueprint System — schema v1.0 */
(function () {
  "use strict";
  const templates = [
    { id:"class-app", name:"Application Class Model", category:"Software", description:"Layered application classes with service and repository boundaries.", nodes:[
      {id:"n1",type:"class",name:"Application",description:"Composition root and lifecycle",members:["+ start(): void","+ shutdown(): void"],x:80,y:90,w:190,h:115},
      {id:"n2",type:"interface",name:"IUserService",description:"User application contract",members:["+ getUser(id: UUID): User","+ createUser(input: CreateUser): User"],x:360,y:60,w:220,h:115},
      {id:"n3",type:"class",name:"UserService",description:"Application service",members:["- repository: IUserRepository","+ getUser(id: UUID): User"],x:360,y:250,w:220,h:120},
      {id:"n4",type:"interface",name:"IUserRepository",description:"Persistence boundary",members:["+ findById(id: UUID): User","+ save(user: User): void"],x:680,y:250,w:220,h:115},
      {id:"n5",type:"database",name:"User Store",description:"Persistent user records",members:[],x:990,y:250,w:170,h:100}
    ],edges:[{id:"e1",from:"n1",to:"n2",type:"dependency",label:"uses"},{id:"e2",from:"n2",to:"n3",type:"inheritance",label:"implements"},{id:"e3",from:"n3",to:"n4",type:"dependency",label:"depends on"},{id:"e4",from:"n4",to:"n5",type:"association",label:"persists"}]},
    { id:"rest-api", name:"REST API Architecture", category:"Backend", description:"Client, API, service, repository, and database boundaries.", nodes:[
      {id:"n1",type:"component",name:"Web / Mobile Client",description:"Presentation layer",members:[],x:60,y:160,w:190,h:100},
      {id:"n2",type:"component",name:"HTTP API",description:"Routing, auth, validation",members:[],x:330,y:160,w:190,h:100},
      {id:"n3",type:"component",name:"Domain Service",description:"Business rules",members:[],x:600,y:160,w:190,h:100},
      {id:"n4",type:"component",name:"Repository",description:"Persistence adapter",members:[],x:870,y:160,w:180,h:100},
      {id:"n5",type:"database",name:"Database",description:"Transactional storage",members:[],x:1120,y:160,w:160,h:100}
    ],edges:[{id:"e1",from:"n1",to:"n2",type:"dependency",label:"HTTPS / JSON"},{id:"e2",from:"n2",to:"n3",type:"dependency",label:"validated command"},{id:"e3",from:"n3",to:"n4",type:"dependency",label:"repository port"},{id:"e4",from:"n4",to:"n5",type:"association",label:"SQL"}]},
    { id:"rpg-mmorpg", name:"RPG / MMORPG Core", category:"Games", description:"Blueprint starter for a data-driven RPG/MMORPG gameplay architecture.", nodes:[
      {id:"n1",type:"class",name:"Character",description:"Player/NPC identity and progression",members:["+ levelUp(): void","+ addExperience(amount: int): void"],x:60,y:80,w:200,h:120},
      {id:"n2",type:"component",name:"Stats Component",description:"Attributes, resources, derived stats",members:[],x:350,y:60,w:190,h:100},
      {id:"n3",type:"component",name:"Combat System",description:"Abilities, hit resolution, damage",members:[],x:350,y:230,w:190,h:100},
      {id:"n4",type:"component",name:"Inventory / Equipment",description:"Items, slots, weight, durability",members:[],x:640,y:60,w:210,h:100},
      {id:"n5",type:"component",name:"Quest / Progression",description:"Quests, achievements, rewards",members:[],x:640,y:230,w:210,h:100},
      {id:"n6",type:"component",name:"Authoritative Game Server",description:"Validate state-changing actions",members:[],x:960,y:145,w:230,h:110},
      {id:"n7",type:"database",name:"Player / World Store",description:"Persisted character and world state",members:[],x:1270,y:145,w:190,h:100}
    ],edges:[{id:"e1",from:"n1",to:"n2",type:"composition",label:"owns"},{id:"e2",from:"n1",to:"n3",type:"dependency",label:"combat intent"},{id:"e3",from:"n1",to:"n4",type:"composition",label:"owns"},{id:"e4",from:"n1",to:"n5",type:"dependency",label:"progression"},{id:"e5",from:"n3",to:"n6",type:"dependency",label:"server validated"},{id:"e6",from:"n4",to:"n6",type:"dependency",label:"inventory commands"},{id:"e7",from:"n6",to:"n7",type:"association",label:"save / load"}]},
    { id:"database-domain", name:"Database Domain Model", category:"Data", description:"A simple account, role, and permission model.", nodes:[
      {id:"n1",type:"class",name:"User",description:"Account identity",members:["+ id: UUID","+ email: string","+ status: UserStatus"],x:80,y:100,w:210,h:125},
      {id:"n2",type:"class",name:"Role",description:"Named permission bundle",members:["+ id: UUID","+ name: string"],x:400,y:100,w:200,h:110},
      {id:"n3",type:"class",name:"Permission",description:"Atomic capability",members:["+ key: string","+ description: string"],x:720,y:100,w:220,h:110},
      {id:"n4",type:"database",name:"Relational Store",description:"users, roles, permissions, join tables",members:[],x:1040,y:110,w:210,h:100}
    ],edges:[{id:"e1",from:"n1",to:"n2",type:"association",label:"many-to-many"},{id:"e2",from:"n2",to:"n3",type:"association",label:"many-to-many"},{id:"e3",from:"n1",to:"n4",type:"dependency",label:"persist"}]},
    { id:"ai-agent", name:"AI Agent Runtime", category:"AI Systems", description:"Tool-using agent with policy checks and observable execution.", nodes:[
      {id:"n1",type:"component",name:"User Request",description:"Untrusted prompt / task",members:[],x:60,y:140,w:170,h:90},
      {id:"n2",type:"component",name:"Planner",description:"Creates a bounded action plan",members:[],x:300,y:140,w:170,h:90},
      {id:"n3",type:"component",name:"Policy / Permission Gate",description:"Authorize tools and validate arguments",members:[],x:540,y:140,w:210,h:100},
      {id:"n4",type:"component",name:"Tool Executor",description:"Runs approved tools only",members:[],x:830,y:140,w:180,h:90},
      {id:"n5",type:"component",name:"Audit / Trace",description:"Record decisions, outputs, failures",members:[],x:540,y:330,w:210,h:90},
      {id:"n6",type:"database",name:"Memory Store",description:"Scoped, access-controlled memory",members:[],x:830,y:330,w:180,h:90}
    ],edges:[{id:"e1",from:"n1",to:"n2",type:"dependency",label:"task"},{id:"e2",from:"n2",to:"n3",type:"dependency",label:"proposed actions"},{id:"e3",from:"n3",to:"n4",type:"dependency",label:"approved actions"},{id:"e4",from:"n4",to:"n5",type:"dependency",label:"events"},{id:"e5",from:"n2",to:"n6",type:"dependency",label:"scoped retrieval"},{id:"e6",from:"n4",to:"n6",type:"association",label:"approved writes"}]}
  ];
  function clone(value){return JSON.parse(JSON.stringify(value));}
  function validate(template){
    if(!template || !Array.isArray(template.nodes) || !Array.isArray(template.edges)) return "Blueprint has no node or edge arrays.";
    if(template.nodes.length > 250 || template.edges.length > 500) return "Blueprint exceeds safe diagram limits.";
    const ids=new Set();
    for(const n of template.nodes){
      if(!n || typeof n.id!=="string" || ids.has(n.id)) return "Blueprint contains a missing or duplicate node ID.";
      if(!["class","interface","package","component","usecase","actor","database","note","state"].includes(n.type)) return "Unsupported node type: "+n.type;
      ids.add(n.id);
      for(const key of ["x","y","w","h"]) if(!Number.isFinite(n[key])) return "Node geometry is invalid.";
    }
    const edgeIds=new Set();
    for(const e of template.edges){
      if(!e || typeof e.id!=="string" || edgeIds.has(e.id) || !ids.has(e.from) || !ids.has(e.to) || e.from===e.to) return "Blueprint contains an invalid relationship.";
      if(!["association","dependency","inheritance","composition","aggregation"].includes(e.type)) return "Unsupported relationship type: "+e.type;
      edgeIds.add(e.id);
    }
    return "";
  }
  function open(){
    if(document.getElementById("blueprintDialog")) return document.getElementById("blueprintDialog").showModal();
    const d=document.createElement("dialog"); d.id="blueprintDialog";
    d.innerHTML='<form method="dialog" class="blueprint-head"><strong>UML Blueprint Library</strong><button aria-label="Close">✕</button></form><p class="blueprint-help">Choose a starter model. Applying a blueprint replaces the current diagram; export your work first if needed.</p><label class="blueprint-label">Blueprint<select id="blueprintSelect"></select></label><div id="blueprintInfo" class="blueprint-info"></div><div class="blueprint-actions"><button id="blueprintExport" type="button">Download JSON</button><button id="blueprintApply" class="primary" type="button">Apply blueprint</button></div>';
    d.style.cssText="width:min(560px,calc(100% - 32px));border:1px solid #d7deea;border-radius:14px;padding:20px;color:#24324a;box-shadow:0 20px 70px #0b163033";
    d.querySelector(".blueprint-head").style.cssText="display:flex;justify-content:space-between;align-items:center";
    const sel=d.querySelector("#blueprintSelect");
    templates.forEach(t=>{const o=document.createElement("option");o.value=t.id;o.textContent=t.category+" — "+t.name;sel.appendChild(o);});
    const info=d.querySelector("#blueprintInfo");
    function current(){return templates.find(t=>t.id===sel.value)||templates[0];}
    function describe(){const t=current();info.textContent=t.description+" "+t.nodes.length+" nodes, "+t.edges.length+" relationships.";}
    sel.addEventListener("change",describe);describe();
    d.querySelector("#blueprintApply").addEventListener("click",()=>{
      const t=clone(current()),error=validate(t);
      if(error){alert(error);return;}
      if(!window.confirm('Apply "'+t.name+'"? The current diagram will be replaced.'))return;
      if(!window.MLTAUML || typeof window.MLTAUML.applyBlueprint!=="function"){alert("Blueprint integration is unavailable. Reload the page and try again.");return;}
      const result=window.MLTAUML.applyBlueprint(t);
      if(result){d.close();if(typeof window.MLTAUML.toast==="function")window.MLTAUML.toast("Blueprint applied: "+t.name);}
    });
    d.querySelector("#blueprintExport").addEventListener("click",()=>{
      const t=clone(current()),blob=new Blob([JSON.stringify({schemaVersion:1,title:t.name,nodes:t.nodes,edges:t.edges,id:t.nodes.length+1},null,2)],{type:"application/json"});
      const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=t.id+".json";a.click();URL.revokeObjectURL(url);
    });
    document.body.appendChild(d);d.showModal();
  }
  function install(){
    const toolbar=document.querySelector(".toolbar");
    if(!toolbar || document.getElementById("openBlueprints")) return;
    const b=document.createElement("button");b.id="openBlueprints";b.textContent="◇ Blueprints";b.title="Open UML blueprint library";b.addEventListener("click",open);
    toolbar.insertBefore(b,toolbar.querySelector("i"));
  }
  window.MLTAUMLBlueprintSystem={version:"1.0.0",list:()=>templates.map(({id,name,category,description,nodes,edges})=>({id,name,category,description,nodeCount:nodes.length,relationshipCount:edges.length})),validate,open};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install);else install();
})();