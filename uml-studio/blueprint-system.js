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
    ,
    {id:"use-case",name:"Use-Case System",category:"UML",description:"Actors and use-case scope starter.",nodes:[
      {id:"n1",type:"actor",name:"Guest",description:"Unauthenticated visitor",members:[],x:60,y:160,w:90,h:125},
      {id:"n2",type:"usecase",name:"Register Account",description:"Create a new account",members:[],x:300,y:70,w:180,h:90},
      {id:"n3",type:"usecase",name:"Sign In",description:"Authenticate user",members:[],x:300,y:200,w:180,h:90},
      {id:"n4",type:"usecase",name:"Recover Account",description:"Recover access",members:[],x:580,y:200,w:180,h:90},
      {id:"n5",type:"note",name:"System Boundary",description:"Identity and account access",members:[],x:270,y:25,w:530,h:310}
    ],edges:[{id:"e1",from:"n1",to:"n2",type:"association",label:"starts"},{id:"e2",from:"n1",to:"n3",type:"association",label:"authenticates"},{id:"e3",from:"n3",to:"n4",type:"dependency",label:"recovery flow"}]},
    {id:"component-architecture",name:"Component Architecture",category:"UML",description:"Components, service contracts, and storage boundaries.",nodes:[
      {id:"n1",type:"component",name:"Presentation",description:"Web and mobile clients",members:[],x:60,y:150,w:180,h:100},
      {id:"n2",type:"component",name:"Application API",description:"Routes and application contracts",members:[],x:330,y:150,w:190,h:100},
      {id:"n3",type:"component",name:"Domain Services",description:"Business invariants",members:[],x:620,y:150,w:190,h:100},
      {id:"n4",type:"component",name:"Persistence Adapter",description:"Repository implementation",members:[],x:910,y:150,w:190,h:100},
      {id:"n5",type:"database",name:"Database",description:"Persistent state",members:[],x:1190,y:150,w:160,h:100}
    ],edges:[{id:"e1",from:"n1",to:"n2",type:"dependency",label:"HTTP API"},{id:"e2",from:"n2",to:"n3",type:"dependency",label:"commands"},{id:"e3",from:"n3",to:"n4",type:"dependency",label:"repository port"},{id:"e4",from:"n4",to:"n5",type:"association",label:"queries"}]},
    {id:"deployment",name:"Deployment Topology",category:"UML",description:"Runtime nodes, deployed components, and data storage.",nodes:[
      {id:"n1",type:"package",name:"Client Devices",description:"Browser and mobile clients",members:[],x:60,y:90,w:210,h:130},
      {id:"n2",type:"component",name:"Web Frontend",description:"Static assets / SPA",members:[],x:350,y:100,w:180,h:100},
      {id:"n3",type:"component",name:"Application Server",description:"Authenticated API",members:[],x:650,y:100,w:190,h:100},
      {id:"n4",type:"database",name:"Primary Database",description:"Durable application records",members:[],x:960,y:100,w:190,h:100},
      {id:"n5",type:"note",name:"Security Boundary",description:"TLS, identity, network policy, secrets management",members:[],x:630,y:260,w:330,h:100}
    ],edges:[{id:"e1",from:"n1",to:"n2",type:"dependency",label:"HTTPS"},{id:"e2",from:"n2",to:"n3",type:"dependency",label:"API requests"},{id:"e3",from:"n3",to:"n4",type:"association",label:"private network"}]},
    {id:"activity-flow",name:"Activity Flow",category:"UML",description:"Activity-flow planning skeleton using supported generic shapes.",nodes:[
      {id:"n1",type:"state",name:"Start",description:"Entry point",members:[],x:70,y:150,w:120,h:70},
      {id:"n2",type:"component",name:"Validate Input",description:"Validate command and permissions",members:[],x:280,y:135,w:190,h:100},
      {id:"n3",type:"component",name:"Execute Action",description:"Perform domain operation",members:[],x:570,y:135,w:190,h:100},
      {id:"n4",type:"component",name:"Handle Failure",description:"Return safe error and diagnostics",members:[],x:570,y:300,w:190,h:100},
      {id:"n5",type:"state",name:"Complete",description:"Terminal outcome",members:[],x:880,y:150,w:140,h:70}
    ],edges:[{id:"e1",from:"n1",to:"n2",type:"dependency",label:"input"},{id:"e2",from:"n2",to:"n3",type:"dependency",label:"valid"},{id:"e3",from:"n2",to:"n4",type:"dependency",label:"invalid"},{id:"e4",from:"n3",to:"n5",type:"dependency",label:"success"},{id:"e5",from:"n4",to:"n5",type:"dependency",label:"handled"}]},
    {id:"state-machine",name:"State Machine",category:"UML",description:"Entity lifecycle and guarded transitions starter.",nodes:[
      {id:"n1",type:"state",name:"Draft",description:"Editable, not submitted",members:[],x:60,y:150,w:150,h:75},
      {id:"n2",type:"state",name:"Submitted",description:"Awaiting validation",members:[],x:330,y:150,w:170,h:75},
      {id:"n3",type:"state",name:"Approved",description:"Accepted by policy",members:[],x:640,y:70,w:170,h:75},
      {id:"n4",type:"state",name:"Rejected",description:"Failed validation or review",members:[],x:640,y:240,w:170,h:75},
      {id:"n5",type:"note",name:"Transition guards",description:"submit [complete]; approve [authorized]; reject [invalid]",members:[],x:330,y:320,w:390,h:85}
    ],edges:[{id:"e1",from:"n1",to:"n2",type:"dependency",label:"submit"},{id:"e2",from:"n2",to:"n3",type:"dependency",label:"approve [valid]"},{id:"e3",from:"n2",to:"n4",type:"dependency",label:"reject [invalid]"}]},
    {id:"package-layers",name:"Package Layers",category:"UML",description:"Layered package boundaries and dependency direction.",nodes:[
      {id:"n1",type:"package",name:"Presentation",description:"Views and user interaction",members:[],x:100,y:70,w:230,h:100},
      {id:"n2",type:"package",name:"Application",description:"Use cases and orchestration",members:[],x:400,y:70,w:230,h:100},
      {id:"n3",type:"package",name:"Domain",description:"Entities and business rules",members:[],x:700,y:70,w:230,h:100},
      {id:"n4",type:"package",name:"Infrastructure",description:"Database, network, external adapters",members:[],x:700,y:260,w:260,h:100}
    ],edges:[{id:"e1",from:"n1",to:"n2",type:"dependency",label:"calls"},{id:"e2",from:"n2",to:"n3",type:"dependency",label:"uses domain"},{id:"e3",from:"n4",to:"n3",type:"dependency",label:"implements ports"}]},
    {id:"object-snapshot",name:"Object Snapshot",category:"UML",description:"Example object instances and runtime links.",nodes:[
      {id:"n1",type:"class",name:"user:User",description:"id = U-1001; status = Active",members:["id = U-1001","status = Active"],x:80,y:120,w:220,h:120},
      {id:"n2",type:"class",name:"order:Order",description:"id = O-204; total = 89.50",members:["id = O-204","total = 89.50"],x:400,y:120,w:220,h:120},
      {id:"n3",type:"class",name:"item:OrderItem",description:"quantity = 2",members:["quantity = 2"],x:720,y:120,w:220,h:110}
    ],edges:[{id:"e1",from:"n1",to:"n2",type:"association",label:"places"},{id:"e2",from:"n2",to:"n3",type:"composition",label:"contains"}]},
    {id:"sequence-message-flow",name:"Message Flow (Sequence Planning)",category:"UML",description:"Interaction planning placeholder; use the catalog contract for dedicated lifelines and messages.",nodes:[
      {id:"n1",type:"actor",name:"User",description:"Message initiator",members:[],x:60,y:80,w:90,h:125},
      {id:"n2",type:"component",name:"UI",description:"Collects intent",members:[],x:260,y:90,w:150,h:90},
      {id:"n3",type:"component",name:"API",description:"Validates request",members:[],x:520,y:90,w:150,h:90},
      {id:"n4",type:"component",name:"Service",description:"Executes domain operation",members:[],x:780,y:90,w:170,h:90},
      {id:"n5",type:"database",name:"Store",description:"Persists result",members:[],x:1060,y:90,w:150,h:90}
    ],edges:[{id:"e1",from:"n1",to:"n2",type:"dependency",label:"1. intent"},{id:"e2",from:"n2",to:"n3",type:"dependency",label:"2. request"},{id:"e3",from:"n3",to:"n4",type:"dependency",label:"3. validated call"},{id:"e4",from:"n4",to:"n5",type:"association",label:"4. persistence"}]}
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