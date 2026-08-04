# Astro Personal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a Chinese-first Astro personal blog for `https://qqliyunpeng.github.io/`.

**Architecture:** The site is a static Astro app using Content Collections for blog posts, small focused components for layout and metadata, and GitHub Actions for GitHub Pages deployment. Pagefind indexes the built output for static search after `astro build`.

**Tech Stack:** Astro, TypeScript, Markdown/MDX, `@astrojs/rss`, `@astrojs/sitemap`, Pagefind, GitHub Actions, npm.

---

See the implementation in this repository for the realized file structure and validation commands.
