import test from "node:test";
import assert from "node:assert/strict";
import {
  getMermaidSource,
  getMermaidTheme
} from "../src/scripts/mermaid-renderer.js";

test("dark Starlight theme selects Mermaid dark theme", () => {
  assert.equal(getMermaidTheme("dark"), "dark");
});

test("other Starlight themes select Mermaid default theme", () => {
  assert.equal(getMermaidTheme("light"), "default");
  assert.equal(getMermaidTheme(undefined), "default");
});

test("Expressive Code line separators become Mermaid source lines", () => {
  assert.equal(getMermaidSource("graph TD\u007f  A --> B"), "graph TD\n  A --> B");
});
