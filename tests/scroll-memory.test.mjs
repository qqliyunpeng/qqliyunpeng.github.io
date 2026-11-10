import test from "node:test";
import assert from "node:assert/strict";
import {
  saveScrollPosition,
  scrollMemoryKey,
  takeScrollPosition
} from "../src/scripts/scroll-memory.js";

const createStorage = () => {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key)
  };
};

test("memory key ignores the hash fragment", () => {
  assert.equal(scrollMemoryKey("/blog/basic/03rtp/", ""), "scroll:/blog/basic/03rtp/");
  assert.equal(scrollMemoryKey("/blog/basic/03rtp/", "?from=home"), "scroll:/blog/basic/03rtp/?from=home");
});

test("round trips a saved scroll position", () => {
  const storage = createStorage();
  const key = scrollMemoryKey("/blog/basic/03rtp/", "");

  saveScrollPosition(storage, key, 4855.4);

  assert.equal(takeScrollPosition(storage, key), 4855);
});

test("consumes the position so a later fresh visit starts at the top", () => {
  const storage = createStorage();
  const key = scrollMemoryKey("/blog/basic/03rtp/", "");
  saveScrollPosition(storage, key, 1200);

  assert.equal(takeScrollPosition(storage, key), 1200);
  assert.equal(takeScrollPosition(storage, key), null);
});

test("returns null when nothing was saved", () => {
  const storage = createStorage();
  assert.equal(takeScrollPosition(storage, scrollMemoryKey("/a/", "")), null);
});

test("returns null for a corrupted stored value", () => {
  const storage = createStorage();
  const key = scrollMemoryKey("/a/", "");
  storage.setItem(key, "not-a-number");

  assert.equal(takeScrollPosition(storage, key), null);
});

test("returns null for a negative stored value", () => {
  const storage = createStorage();
  const key = scrollMemoryKey("/a/", "");
  storage.setItem(key, "-40");

  assert.equal(takeScrollPosition(storage, key), null);
});

test("survives a storage that throws, as in private mode", () => {
  const throwingStorage = {
    getItem: () => {
      throw new Error("denied");
    },
    setItem: () => {
      throw new Error("denied");
    },
    removeItem: () => {
      throw new Error("denied");
    }
  };
  const key = scrollMemoryKey("/a/", "");

  assert.equal(saveScrollPosition(throwingStorage, key, 10), false);
  assert.equal(takeScrollPosition(throwingStorage, key), null);
});
