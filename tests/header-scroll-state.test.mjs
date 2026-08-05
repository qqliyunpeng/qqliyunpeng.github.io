import test from "node:test";
import assert from "node:assert/strict";
import {
  createHeaderScrollState,
  updateHeaderScrollState
} from "../src/scripts/header-scroll-state.js";

test("small downward movements keep the header visible", () => {
  let state = createHeaderScrollState();
  state = updateHeaderScrollState(state, 5);
  state = updateHeaderScrollState(state, 11);
  assert.equal(state.hidden, false);
});

test("twelve pixels of downward movement hide the header", () => {
  let state = createHeaderScrollState();
  state = updateHeaderScrollState(state, 5);
  state = updateHeaderScrollState(state, 12);
  assert.equal(state.hidden, true);
});

test("upward movement restores a hidden header", () => {
  const state = updateHeaderScrollState(
    { lastY: 40, downwardDistance: 0, hidden: true },
    39
  );
  assert.equal(state.hidden, false);
});

test("returning near the page top restores the header", () => {
  const state = updateHeaderScrollState(
    { lastY: 40, downwardDistance: 0, hidden: true },
    4
  );
  assert.equal(state.hidden, false);
});

test("focus inside the header restores it", () => {
  const state = updateHeaderScrollState(
    { lastY: 40, downwardDistance: 0, hidden: true },
    40,
    true
  );
  assert.equal(state.hidden, false);
});
