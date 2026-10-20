import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig, Lifecycle, requireNonEmptyString } from "../src/index.js";

test("loadConfig accepts valid configuration", () => {
  const result = loadConfig({
    APP_NAME: "sample",
    NODE_ENV: "test",
    PORT: "4321",
    LOG_LEVEL: "debug",
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.port, 4321);
    assert.equal(result.value.appName, "sample");
  }
});

test("loadConfig rejects invalid ports", () => {
  const result = loadConfig({ PORT: "70000" });
  assert.equal(result.ok, false);
});

test("requireNonEmptyString trims valid values and rejects blank values", () => {
  const valid = requireNonEmptyString("  hello  ", "name");
  assert.deepEqual(valid, { ok: true, value: "hello" });
  assert.equal(requireNonEmptyString("   ", "name").ok, false);
});

test("Lifecycle enforces valid transitions", () => {
  const lifecycle = new Lifecycle();
  lifecycle.transition("starting");
  lifecycle.transition("ready");
  lifecycle.transition("stopping");
  lifecycle.transition("stopped");
  assert.equal(lifecycle.state, "stopped");
  assert.throws(() => lifecycle.transition("ready"));
});
