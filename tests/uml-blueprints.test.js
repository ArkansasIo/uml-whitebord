import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../uml-studio/blueprint-system.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../uml-studio/index.html", import.meta.url), "utf8");
const schema = JSON.parse(readFileSync(new URL("../uml-studio/blueprint.schema.json", import.meta.url), "utf8"));

test("blueprint library is loaded by the UML Studio page", () => {
  assert.match(html, /blueprint-system\.js/);
  assert.match(source, /window\.MLTAUMLBlueprintSystem/);
  assert.match(source, /applyBlueprint/);
});

test("starter templates cover application, backend, game, data, and AI systems", () => {
  for (const name of ["Application Class Model", "REST API Architecture", "RPG / MMORPG Core", "Database Domain Model", "AI Agent Runtime", "Use-Case System", "Component Architecture", "Deployment Topology", "Activity Flow", "State Machine", "Package Layers", "Object Snapshot", "Message Flow (Sequence Planning)"]) {
    assert.ok(source.includes(name), `Missing blueprint: ${name}`);
  }
});

test("blueprint format is versioned and bounded", () => {
  assert.equal(schema.properties.schemaVersion.const, 1);
  assert.equal(schema.properties.nodes.maxItems, 250);
  assert.equal(schema.properties.edges.maxItems, 500);
  assert.ok(schema.properties.nodes.items.properties.type.enum.includes("component"));
  assert.ok(schema.properties.edges.items.properties.type.enum.includes("composition"));
});

test("template validation rejects unsupported relationships and dangling references", () => {
  assert.match(source, /Unsupported relationship type/);
  assert.match(source, /invalid relationship/i);
  assert.match(source, /NODE_LIMIT|exceeds safe diagram limits/i);
});
