import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const systems = readFileSync(new URL("../uml-studio/uml-systems.js", import.meta.url), "utf8");
const store = readFileSync(new URL("../uml-studio/project-store.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../uml-studio/index.html", import.meta.url), "utf8");

test("UML catalog declares core structural and behavioral diagram families", () => {
  for (const id of ["class","usecase","sequence","activity","state","component","deployment","package","object","communication","timing","interaction-overview","composite","profile"]) {
    assert.ok(systems.includes('id:"'+id+'"'), "Missing diagram type "+id);
  }
  assert.match(systems, /validateModel/);
});

test("project store is bounded and supports project lifecycle operations", () => {
  for (const method of ["create","save","list","load","remove","exportProject","importProject"]) assert.match(store, new RegExp(method));
  assert.match(store, /at most 500 diagrams/);
  assert.match(store, /element limits/);
});

test("UML and project modules are loaded by the studio", () => {
  assert.match(html, /uml-systems\.js/);
  assert.match(html, /project-store\.js/);
});
