/* MLTA UML Systems — diagram catalog and model contracts. */
(function(root){
  "use strict";
  const types=[
    {id:"class",name:"Class Diagram",purpose:"Static classes, interfaces, attributes, operations, and typed relationships.",elements:["class","interface","enumeration","association-class"],relationships:["association","dependency","inheritance","composition","aggregation"],properties:["visibility","static","abstract","stereotype","multiplicity","roleName","navigability"]},
    {id:"usecase",name:"Use-Case Diagram",purpose:"Actors, use cases, system boundaries, include/extend, and actor generalization.",elements:["actor","use-case","system-boundary","note"],relationships:["association","include","extend","generalization"],properties:["stereotype","direction","guard"]},
    {id:"sequence",name:"Sequence Diagram",purpose:"Participants, lifelines, ordered messages, activation bars, and interaction fragments.",elements:["participant","lifeline","activation","combined-fragment","message"],relationships:["synchronous-call","asynchronous-call","return","create","destroy"],properties:["messageOrder","guard","duration","messageSignature"]},
    {id:"activity",name:"Activity Diagram",purpose:"Actions, control/object flows, decisions, forks, joins, and swimlanes.",elements:["initial","action","decision","merge","fork","join","activity-final","swimlane"],relationships:["control-flow","object-flow"],properties:["guard","weight","partition","precondition","postcondition"]},
    {id:"state",name:"State-Machine Diagram",purpose:"States, pseudostates, transitions, guards, and entry/exit/do behavior.",elements:["initial","state","composite-state","choice","junction","final","history"],relationships:["transition"],properties:["trigger","guard","effect","entry","exit","doActivity"]},
    {id:"component",name:"Component Diagram",purpose:"Components, provided/required interfaces, ports, and connectors.",elements:["component","port","provided-interface","required-interface","artifact"],relationships:["dependency","realization","connector"],properties:["interfaceContract","visibility","stereotype"]},
    {id:"deployment",name:"Deployment Diagram",purpose:"Nodes, devices, execution environments, artifacts, and deployment paths.",elements:["device","execution-environment","artifact","deployment-specification"],relationships:["communication-path","deployment","dependency"],properties:["protocol","runtime","artifactVersion"]},
    {id:"package",name:"Package Diagram",purpose:"Packages, namespaces, imports, merges, and dependency boundaries.",elements:["package","model","profile"],relationships:["import","merge","dependency","containment"],properties:["namespace","visibility","stereotype"]},
    {id:"object",name:"Object Diagram",purpose:"Runtime object instances, slots, and links at a point in time.",elements:["object-instance","slot","link","note"],relationships:["link","dependency"],properties:["classifier","slotValue","snapshotTime"]},
    {id:"communication",name:"Communication Diagram",purpose:"Object/role collaboration and numbered messages.",elements:["participant","role","message"],relationships:["message-link"],properties:["sequenceNumber","messageSignature","guard"]},
    {id:"timing",name:"Timing Diagram",purpose:"Lifelines, states/values, timing constraints, and time observations.",elements:["lifeline","state-value","time-constraint"],relationships:["message","state-transition"],properties:["timeUnit","duration","constraint"]},
    {id:"interaction-overview",name:"Interaction Overview",purpose:"High-level interaction flow connecting activity nodes and referenced interactions.",elements:["initial","interaction-use","decision","merge","final"],relationships:["control-flow"],properties:["referencedDiagram","guard"]},
    {id:"composite",name:"Composite Structure",purpose:"Parts, ports, connectors, collaborations, and internal structure.",elements:["part","port","connector","collaboration"],relationships:["connector","delegation","assembly"],properties:["multiplicity","roleName","interfaceContract"]},
    {id:"profile",name:"Profile Diagram",purpose:"Stereotypes, metaclasses, extensions, tagged values, and constraints.",elements:["stereotype","metaclass","tagged-value","constraint"],relationships:["extension","generalization"],properties:["baseMetaclass","tagType","constraintExpression"]}
  ];
  const byId=new Map(types.map(t=>[t.id,t]));
  function list(){return types.map(t=>JSON.parse(JSON.stringify(t)));}
  function get(id){const t=byId.get(id);return t?JSON.parse(JSON.stringify(t)):null;}
  function validateModel(model,kind){
    const errors=[];
    if(!model||typeof model!=="object"||!Array.isArray(model.nodes)||!Array.isArray(model.edges))return {ok:false,errors:["Model must contain nodes and edges arrays."]};
    const seen=new Set();
    for(const n of model.nodes){if(!n||typeof n.id!=="string"||!n.id.trim())errors.push("Every element requires a stable ID.");else if(seen.has(n.id))errors.push("Duplicate element ID: "+n.id);else seen.add(n.id);}
    const edgeIds=new Set();
    for(const e of model.edges){if(!e||typeof e.id!=="string"||edgeIds.has(e.id))errors.push("Every relationship requires a unique ID.");else edgeIds.add(e.id);if(!seen.has(e.from)||!seen.has(e.to))errors.push("Relationship has a missing endpoint: "+(e&&e.id||"unknown"));}
    if(kind&&!byId.has(kind))errors.push("Unknown UML diagram type: "+kind);
    return {ok:errors.length===0,errors};
  }
  function installCatalogButton(){
    const toolbar=document.querySelector(".toolbar");
    if(!toolbar||document.getElementById("umlDiagramCatalog"))return;
    const button=document.createElement("button");button.id="umlDiagramCatalog";button.textContent="Diagram Types";button.title="Browse UML diagram families";
    button.addEventListener("click",()=>{
      let dialog=document.getElementById("umlCatalogDialog");
      if(!dialog){
        dialog=document.createElement("dialog");dialog.id="umlCatalogDialog";
        dialog.style.cssText="width:min(760px,calc(100% - 24px));max-height:85vh;overflow:auto;border:1px solid #d8dfeb;border-radius:12px;padding:18px;color:#23314a";
        const heading=document.createElement("div");heading.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:12px";
        const title=document.createElement("h2");title.textContent="UML Diagram Catalog";title.style.margin="0";
        const close=document.createElement("button");close.textContent="Close";close.addEventListener("click",()=>dialog.close());heading.append(title,close);
        const note=document.createElement("p");note.textContent="Catalog and requirements for specialized diagram editors. Entries marked as catalog specifications are not yet full dedicated renderers.";note.style.color="#64748b";
        const grid=document.createElement("div");grid.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px";
        for(const item of types){const card=document.createElement("article");card.style.cssText="padding:12px;border:1px solid #e2e8f0;border-radius:8px";const h=document.createElement("strong");h.textContent=item.name;const p=document.createElement("p");p.textContent=item.purpose;p.style.cssText="font-size:12px;line-height:1.45;color:#52627a";const meta=document.createElement("small");meta.textContent=item.elements.length+" element kinds · "+item.relationships.length+" relationship kinds";meta.style.color="#64748b";card.append(h,p,meta);grid.append(card);}
        dialog.append(heading,note,grid);document.body.append(dialog);
      }
      dialog.showModal();
    });
    toolbar.append(button);
  }
  root.MLTAUMLSystems={version:"1.0.0",list,get,validateModel};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",installCatalogButton);else installCatalogButton();
})(window);
