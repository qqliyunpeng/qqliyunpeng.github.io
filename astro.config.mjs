import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://qqliyunpeng.github.io",
  integrations: [
    starlight({
      title: "qqliyunpeng",
      description: "记录技术实践、工程问题和长期思考。",
      defaultLocale: "root",
      locales: {
        root: {
          label: "简体中文",
          lang: "zh-CN"
        }
      },
      sidebar: [
        {
          label: "开始",
          items: [
            { label: "首页", slug: "index" },
            { label: "关于", slug: "about" }
          ]
        },
        {
          label: "文章",
          items: [{ label: "用 Astro 开始写作", slug: "blog/hello-astro" }]
        },
        {
          label: "基本知识",
          items: [
            {
              label: "全部笔记",
              items: [{ autogenerate: { directory: "blog/basic" } }]
            }
          ]
        }
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/qqliyunpeng"
        }
      ],
      customCss: ["./src/styles/starlight.css"],
      components: {
        PageFrame: "./src/components/PageFrame.astro"
      },
      disable404Route: true,
      credits: false
    }),
    sitemap()
  ],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true
    }
  }
});
