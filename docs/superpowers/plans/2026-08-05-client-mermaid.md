# Client-Side Mermaid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render Markdown Mermaid blocks as theme-aware SVG diagrams through a browser-only dynamic import.

**Architecture:** A standalone client module owns Mermaid detection, lazy loading, rendering, theme observation, and failure fallback. `PageFrame.astro` only imports and starts the module, while global Starlight CSS controls diagram sizing.

**Tech Stack:** Astro 7, Starlight 0.41, Mermaid, browser DOM APIs, Node.js built-in test runner

---

### Task 1: Define Theme Selection

**Files:**
- Create: `tests/mermaid-renderer.test.mjs`
- Create: `src/scripts/mermaid-renderer.js`

- [ ] Write a failing test that expects `getMermaidTheme("dark")` to return
  `"dark"` and all other values to return `"default"`.
- [ ] Run `node --test tests/mermaid-renderer.test.mjs` and verify it fails
  because the module is missing.
- [ ] Implement:

```js
export function getMermaidTheme(theme) {
  return theme === "dark" ? "dark" : "default";
}
```

- [ ] Run the test and verify it passes.

### Task 2: Add Lazy Mermaid Rendering

**Files:**
- Modify: `src/scripts/mermaid-renderer.js`
- Modify: `src/components/PageFrame.astro`
- Modify: `src/styles/starlight.css`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] Install Mermaid with `npm install mermaid`.
- [ ] Add `renderMermaidDiagrams()` that returns immediately when
  `document.querySelectorAll("pre > code.language-mermaid")` is empty.
- [ ] Dynamically import `mermaid`, initialize strict security and the current
  theme, then render each source independently with `mermaid.render()`.
- [ ] Preserve an invalid source block and set `data-mermaid-error` plus a
  Chinese accessible label when its render rejects.
- [ ] Observe root `data-theme` changes and rerender successful diagrams from
  their stored source.
- [ ] Import and call `renderMermaidDiagrams()` from the processed script in
  `src/components/PageFrame.astro`.
- [ ] Add `.mermaid-diagram` styles for centered, responsive SVG output and
  horizontal overflow.

The renderer implementation must use this public entry point:

```js
export async function renderMermaidDiagrams() {
  const blocks = [...document.querySelectorAll("pre > code.language-mermaid")];
  if (blocks.length === 0) return;
  const { default: mermaid } = await import("mermaid");
  // Render blocks independently and observe data-theme changes.
}
```

### Task 3: Validate And Commit

**Files:**
- Verify all modified files.

- [ ] Run `node --test tests/mermaid-renderer.test.mjs` and expect all tests to
  pass.
- [ ] Run `npm run check` and expect zero errors.
- [ ] Run `npm run build` and expect a successful static build with a separate
  Mermaid JavaScript chunk.
- [ ] Run `git diff --check` and inspect the focused diff.
- [ ] Commit implementation files with
  `feat: add lazy client-side Mermaid rendering`.
