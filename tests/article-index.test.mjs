import test from "node:test";
import assert from "node:assert/strict";
import { excerptFromBody, isArticleEntry, sortArticles } from "../src/lib/articles.js";

const entry = (id, { title = id, pubDate } = {}) => ({
  id,
  data: { title, pubDate }
});

const ids = (entries) => entries.map((item) => item.id);

test("only entries under the blog directory are articles", () => {
  assert.equal(isArticleEntry(entry("blog/basic/01.大端和小端")), true);
  assert.equal(isArticleEntry(entry("about")), false);
});

test("newest articles come first", () => {
  const sorted = sortArticles([
    entry("blog/basic/01.a", { pubDate: new Date("2026-01-01") }),
    entry("blog/basic/02.b", { pubDate: new Date("2026-03-01") })
  ]);
  assert.deepEqual(ids(sorted), ["blog/basic/02.b", "blog/basic/01.a"]);
});

test("newer article in a new category outranks older ones regardless of its file number", () => {
  const sorted = sortArticles([
    entry("blog/basic/07.C语言位操作方法", { pubDate: new Date("2026-08-04") }),
    entry("blog/设备树/01.设备树基础", { pubDate: new Date("2026-09-01") })
  ]);
  assert.deepEqual(ids(sorted), ["blog/设备树/01.设备树基础", "blog/basic/07.C语言位操作方法"]);
});

test("same publication date puts the larger file number first", () => {
  const sorted = sortArticles([
    entry("blog/basic/03.RTP概念总结", { pubDate: new Date("2026-08-04") }),
    entry("blog/basic/07.C语言位操作方法", { pubDate: new Date("2026-08-04") })
  ]);
  assert.deepEqual(ids(sorted), ["blog/basic/07.C语言位操作方法", "blog/basic/03.RTP概念总结"]);
});

test("same date compares file numbers numerically, not as strings", () => {
  const sorted = sortArticles([
    entry("blog/basic/10.ten", { pubDate: new Date("2026-08-04") }),
    entry("blog/basic/09.nine", { pubDate: new Date("2026-08-04") })
  ]);
  assert.deepEqual(ids(sorted), ["blog/basic/10.ten", "blog/basic/09.nine"]);
});

test("un-numbered files come after numbered ones on the same day", () => {
  const sorted = sortArticles([
    entry("blog/basic/notes", { pubDate: new Date("2026-08-04") }),
    entry("blog/basic/01.first", { pubDate: new Date("2026-08-04") })
  ]);
  assert.deepEqual(ids(sorted), ["blog/basic/01.first", "blog/basic/notes"]);
});

test("sidebar order does not affect the homepage order", () => {
  const sorted = sortArticles([
    { id: "blog/basic/02.b", data: { title: "b", pubDate: new Date("2026-08-04"), sidebar: { order: 99 } } },
    { id: "blog/basic/05.a", data: { title: "a", pubDate: new Date("2026-08-04"), sidebar: { order: 1 } } }
  ]);
  assert.deepEqual(ids(sorted), ["blog/basic/05.a", "blog/basic/02.b"]);
});

test("sorting does not mutate the input array", () => {
  const input = [
    entry("blog/basic/01.a", { pubDate: new Date("2026-01-01") }),
    entry("blog/basic/02.b", { pubDate: new Date("2026-02-01") })
  ];
  sortArticles(input);
  assert.deepEqual(ids(input), ["blog/basic/01.a", "blog/basic/02.b"]);
});

test("excerpt takes the opening prose and skips headings, code blocks and tables", () => {
  const body = [
    "\n# C语言位操作方法\n",
    "C 语言中常用位操作一般用于控制寄存器。",
    "\n常用运算符：\n",
    "| 运算符 | 含义 |",
    "| --- | --- |",
    "\n```c\nvalue |= (1U << n);\n```\n"
  ].join("\n");

  assert.equal(excerptFromBody(body), "C 语言中常用位操作一般用于控制寄存器。常用运算符：");
});

test("excerpt strips inline markdown but keeps the words", () => {
  const body = "大端和小端是**多字节数据**在 `内存` 里的[存放顺序](https://example.com)。";
  assert.equal(excerptFromBody(body), "大端和小端是多字节数据在 内存 里的存放顺序。");
});

test("excerpt truncates long text with an ellipsis", () => {
  const body = "一".repeat(200);
  const excerpt = excerptFromBody(body, 20);
  assert.equal(excerpt, `${"一".repeat(20)}…`);
});

test("excerpt falls back to an empty string without a body", () => {
  assert.equal(excerptFromBody(undefined), "");
  assert.equal(excerptFromBody(""), "");
});

test("excerpt keeps underscores inside identifiers", () => {
  const body = "位操作常配合 `uint8_t`、`uint16_t`、`uint32_t`。";
  assert.equal(excerptFromBody(body), "位操作常配合 uint8_t、uint16_t、uint32_t。");
});

test("excerpt drops a dangling clause left over before a code block", () => {
  const body = [
    "矩阵乘法可以理解为：用一个矩阵的行去匹配另一个矩阵的列，计算加权求和，得到新矩阵中的一个元素。",
    "设：",
    "```text",
    "A 是 m x n 矩阵",
    "```"
  ].join("\n");

  assert.equal(
    excerptFromBody(body),
    "矩阵乘法可以理解为：用一个矩阵的行去匹配另一个矩阵的列，计算加权求和，得到新矩阵中的一个元素。"
  );
});
