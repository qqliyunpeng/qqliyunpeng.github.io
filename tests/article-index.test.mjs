import test from "node:test";
import assert from "node:assert/strict";
import { isArticleEntry, sortArticles } from "../src/lib/articles.js";

const entry = (id, { title = id, pubDate, order } = {}) => ({
  id,
  data: { title, pubDate, sidebar: order === undefined ? undefined : { order } }
});

test("only entries under the blog directory are articles", () => {
  assert.equal(isArticleEntry(entry("blog/basic/01.大端和小端")), true);
  assert.equal(isArticleEntry(entry("about")), false);
});

test("newest articles come first", () => {
  const sorted = sortArticles([
    entry("blog/a", { pubDate: new Date("2026-01-01") }),
    entry("blog/b", { pubDate: new Date("2026-03-01") })
  ]);
  assert.deepEqual(
    sorted.map((item) => item.id),
    ["blog/b", "blog/a"]
  );
});

test("same publication date falls back to sidebar order", () => {
  const sorted = sortArticles([
    entry("blog/second", { pubDate: new Date("2026-08-04"), order: 2 }),
    entry("blog/first", { pubDate: new Date("2026-08-04"), order: 1 })
  ]);
  assert.deepEqual(
    sorted.map((item) => item.id),
    ["blog/first", "blog/second"]
  );
});

test("articles without sidebar order come after ordered ones", () => {
  const sorted = sortArticles([
    entry("blog/no-order", { pubDate: new Date("2026-08-04") }),
    entry("blog/ordered", { pubDate: new Date("2026-08-04"), order: 9 })
  ]);
  assert.deepEqual(
    sorted.map((item) => item.id),
    ["blog/ordered", "blog/no-order"]
  );
});

test("sorting does not mutate the input array", () => {
  const input = [
    entry("blog/a", { pubDate: new Date("2026-01-01"), order: 1 }),
    entry("blog/b", { pubDate: new Date("2026-02-01"), order: 2 })
  ];
  sortArticles(input);
  assert.deepEqual(
    input.map((item) => item.id),
    ["blog/a", "blog/b"]
  );
});
