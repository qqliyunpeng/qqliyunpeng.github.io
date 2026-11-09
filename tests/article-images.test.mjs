import test from "node:test";
import assert from "node:assert/strict";
import { firstImageFromBody, resolveImageSource } from "../src/lib/articles.js";

test("takes the first markdown image in the body", () => {
  const body = ["# 标题", "", "开头一段。", "", "![架构图](assets/arch.png)", "", "![第二张](assets/2.png)"].join("\n");
  assert.deepEqual(firstImageFromBody(body), { src: "assets/arch.png", alt: "架构图" });
});

test("keeps an empty alt when the markdown image has none", () => {
  assert.deepEqual(firstImageFromBody("![](assets/section.webp)"), { src: "assets/section.webp", alt: "" });
});

test("ignores a title after the markdown image path", () => {
  assert.deepEqual(firstImageFromBody('![图](a.png "标题")'), { src: "a.png", alt: "图" });
});

test("takes an html img tag", () => {
  assert.deepEqual(firstImageFromBody('<img src="assets/a.png" alt="截图" width="80" />'), {
    src: "assets/a.png",
    alt: "截图"
  });
});

test("skips images inside fenced code blocks", () => {
  const body = ["```md", "![示例](fake.png)", "```", "![真图](real.png)"].join("\n");
  assert.deepEqual(firstImageFromBody(body), { src: "real.png", alt: "真图" });
});

test("skips images inside indented code blocks", () => {
  const body = ["    ![示例](fake.png)", "", "![真图](real.png)"].join("\n");
  assert.deepEqual(firstImageFromBody(body), { src: "real.png", alt: "真图" });
});

test("skips reference style and data uri images", () => {
  const body = ["![引用][ref]", "![内联](data:image/png;base64,AAAA)", "![真图](real.png)"].join("\n");
  assert.deepEqual(firstImageFromBody(body), { src: "real.png", alt: "真图" });
});

test("returns null when the body has no image", () => {
  assert.equal(firstImageFromBody("只有文字。"), null);
  assert.equal(firstImageFromBody(undefined), null);
});

test("resolves a relative path against the article directory", () => {
  assert.deepEqual(resolveImageSource("assets/section.webp", "blog/basic/05.ELF文件构成"), {
    kind: "local",
    path: "blog/basic/assets/section.webp"
  });
});

test("normalises . and .. segments in relative paths", () => {
  assert.deepEqual(resolveImageSource("./assets/a.png", "blog/basic/01.a"), {
    kind: "local",
    path: "blog/basic/assets/a.png"
  });
  assert.deepEqual(resolveImageSource("../shared/a.png", "blog/basic/01.a"), {
    kind: "local",
    path: "blog/shared/a.png"
  });
  assert.deepEqual(resolveImageSource("a//b.png", "blog/basic/01.a"), {
    kind: "local",
    path: "blog/basic/a/b.png"
  });
});

test("keeps absolute urls and root paths as they are", () => {
  assert.deepEqual(resolveImageSource("https://example.com/a.png", "blog/basic/01.a"), {
    kind: "external",
    path: "https://example.com/a.png"
  });
  assert.deepEqual(resolveImageSource("//cdn.example.com/a.png", "blog/basic/01.a"), {
    kind: "external",
    path: "//cdn.example.com/a.png"
  });
  assert.deepEqual(resolveImageSource("/images/a.png", "blog/basic/01.a"), {
    kind: "external",
    path: "/images/a.png"
  });
});

test("refuses to climb out of the content directory", () => {
  assert.deepEqual(resolveImageSource("../../../etc/passwd", "blog/basic/01.a"), { kind: "external", path: "" });
  assert.deepEqual(resolveImageSource("", "blog/basic/01.a"), { kind: "external", path: "" });
});
