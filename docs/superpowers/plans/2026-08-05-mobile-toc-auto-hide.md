# Mobile Table of Contents Auto-Hide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide Starlight's mobile “本页内容” bar with the existing auto-hiding header and restore both only near the page top.

**Architecture:** Reuse the existing `data-header-hidden` attribute emitted by `PageFrame.astro`; no JavaScript state changes are needed. Add a mobile-only transform and transition for `mobile-starlight-toc`, leaving layout padding and desktop behavior unchanged.

**Tech Stack:** Astro 7, Starlight 0.41, component-scoped CSS, Node.js test runner

---

### Task 1: Connect the Mobile Table of Contents to Header Visibility

**Files:**
- Modify: `src/components/PageFrame.astro:113-239`
- Test: `tests/header-scroll-state.test.mjs`

- [ ] **Step 1: Run the existing scroll-state tests as a baseline**

Run:

```bash
node --test tests/header-scroll-state.test.mjs
```

Expected: all five tests pass, confirming that the shared state hides after
`12px` of downward movement and restores only near the top or for header focus.

- [ ] **Step 2: Add the mobile table of contents transition**

In `src/components/PageFrame.astro`, add this rule after the existing hidden
header rule:

```css
    @media (max-width: 49.999rem) {
      :global(mobile-starlight-toc nav) {
        transition-duration: var(--sidebar-collapse-duration);
        transition-property: transform;
        transition-timing-function: ease;
      }

      :global(html[data-header-hidden] mobile-starlight-toc nav) {
        transform: translateY(calc(-1 * (var(--sl-nav-height) + var(--sl-mobile-toc-height))));
      }
    }
```

This moves the fixed mobile table of contents above the viewport with the
header while preserving `.main-frame` padding so article content does not jump.

- [ ] **Step 3: Respect reduced-motion preferences**

Add the global mobile table of contents element to the existing reduced-motion
selector:

```css
    @media (prefers-reduced-motion: reduce) {
      .header,
      :global(mobile-starlight-toc nav),
      .sidebar-pane,
      .main-frame,
      .sidebar-collapse-toggle {
        transition-duration: 0s;
      }
    }
```

- [ ] **Step 4: Run targeted validation**

Run:

```bash
node --test tests/header-scroll-state.test.mjs
npm run build
```

Expected: five unit tests pass; Astro check reports no errors; the production
build completes successfully.

- [ ] **Step 5: Inspect the generated CSS**

Run:

```bash
rg -n "mobile-starlight-toc|data-header-hidden|49\\.999rem|prefers-reduced-motion" dist/_astro -g "*.css"
```

Expected: generated CSS includes the mobile-only hidden transform and the
reduced-motion rule. The transform selector targets `mobile-starlight-toc`, not
desktop `starlight-toc`.

- [ ] **Step 6: Commit the implementation**

```bash
git add src/components/PageFrame.astro
git commit -m "feat: auto-hide mobile table of contents"
```
