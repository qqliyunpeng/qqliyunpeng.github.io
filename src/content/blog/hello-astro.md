---
title: "用 Astro 开始写作"
description: "这个站点的第一篇文章，用来验证内容集合、标签、代码高亮和目录。"
pubDate: 2026-08-04
tags: ["Astro", "博客", "工程记录"]
draft: false
---

## 为什么用 Astro

Astro 很适合个人博客：页面默认静态输出，加载快，文章可以直接用
Markdown 管理，也方便以后逐步加入组件。

## 写作结构

每篇文章放在 `src/content/blog/` 目录中，通过 frontmatter 描述标题、摘要、
日期和标签。

```ts
const post = {
  title: "用 Astro 开始写作",
  tags: ["Astro", "博客"]
};
```

## 后续计划

这个博客会先服务于持续记录：技术问题、构建过程、读书笔记和项目复盘。
