# Desktop Sidebar Collapse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a desktop-only, edge-mounted control that collapses the complete left sidebar, expands the reading area, and remembers the selected state.

**Architecture:** Override Starlight's supported `PageFrame` component while preserving its existing markup and mobile menu behavior. The custom frame owns the toggle button, an early inline state initializer, the click handler, and scoped responsive styles; `astro.config.mjs` only registers the override.

**Tech Stack:** Astro 7, Starlight 0.41, TypeScript in Astro inline scripts, CSS custom properties, browser `localStorage`

---

## File Structure

- Create `src/components/PageFrame.astro`: preserve Starlight's page frame and add all desktop sidebar-collapse behavior.
- Modify `astro.config.mjs`: register the custom `PageFrame` override.
- Modify `src/styles/starlight.css`: add the shared sidebar transition duration custom property.

### Task 1: Register The Custom Page Frame

**Files:**
- Create: `src/components/PageFrame.astro`
- Modify: `astro.config.mjs`

- [ ] **Step 1: Register the component before creating it**

Add this option beside `customCss` in the Starlight configuration:

```js
      components: {
        PageFrame: "./src/components/PageFrame.astro"
      },
```

- [ ] **Step 2: Run the targeted check and verify it fails**

Run: `npm run check`

Expected: FAIL because `src/components/PageFrame.astro` does not exist.

- [ ] **Step 3: Create the minimal compatible page frame**

Create `src/components/PageFrame.astro` from the installed Starlight
`PageFrame.astro`, preserving its `MobileMenuToggle`, slots, markup, and styles:

```astro
---
import MobileMenuToggle from "virtual:starlight/components/MobileMenuToggle";

const { hasSidebar } = Astro.locals.starlightRoute;
---

<div class="page sl-flex">
  <header class="header"><slot name="header" /></header>
  {
    hasSidebar && (
      <nav class="sidebar print:hidden" aria-label={Astro.locals.t("sidebarNav.accessibleLabel")}>
        <MobileMenuToggle />
        <div id="starlight__sidebar" class="sidebar-pane">
          <div class="sidebar-content sl-flex">
            <slot name="sidebar" />
          </div>
        </div>
      </nav>
    )
  }
  <div class="main-frame"><slot /></div>
</div>
```

Copy the installed component's existing `<style>` block below this markup
without unrelated formatting changes.

- [ ] **Step 4: Run the targeted check and verify the override is valid**

Run: `npm run check`

Expected: PASS with zero Astro errors.

- [ ] **Step 5: Commit the compatible override**

```bash
git add astro.config.mjs src/components/PageFrame.astro
git commit -m "refactor: add custom Starlight page frame"
```

### Task 2: Add Persistent Desktop Collapse Behavior

**Files:**
- Modify: `src/components/PageFrame.astro`
- Modify: `src/styles/starlight.css`

- [ ] **Step 1: Add the early saved-state initializer**

Insert this inline script before the `.page` element so the saved state is
applied before the sidebar markup renders:

```astro
<script is:inline>
  (() => {
    try {
      if (localStorage.getItem("starlight-sidebar-collapsed") === "true") {
        document.documentElement.dataset.sidebarCollapsed = "true";
      }
    } catch {}
  })();
</script>
```

- [ ] **Step 2: Add the accessible edge control**

Place the button after `.sidebar-pane` inside the sidebar navigation:

```astro
<button
  class="sidebar-collapse-toggle print:hidden"
  type="button"
  aria-controls="starlight__sidebar"
  aria-expanded="true"
  aria-label="收起左侧栏"
>
  <span class="sidebar-collapse-icon" aria-hidden="true">‹</span>
</button>
```

- [ ] **Step 3: Add the click and persistence logic**

Place this component script after the page markup:

```astro
<script>
  const storageKey = "starlight-sidebar-collapsed";
  const root = document.documentElement;
  const toggle = document.querySelector<HTMLButtonElement>(".sidebar-collapse-toggle");

  const renderState = (collapsed: boolean) => {
    if (collapsed) root.dataset.sidebarCollapsed = "true";
    else delete root.dataset.sidebarCollapsed;

    if (!toggle) return;
    toggle.ariaExpanded = String(!collapsed);
    toggle.ariaLabel = collapsed ? "展开左侧栏" : "收起左侧栏";
    const icon = toggle.querySelector<HTMLElement>(".sidebar-collapse-icon");
    if (icon) icon.textContent = collapsed ? "›" : "‹";
  };

  renderState(root.dataset.sidebarCollapsed === "true");

  toggle?.addEventListener("click", () => {
    const collapsed = root.dataset.sidebarCollapsed !== "true";
    renderState(collapsed);
    try {
      localStorage.setItem(storageKey, String(collapsed));
    } catch {}
  });
</script>
```

- [ ] **Step 4: Add the desktop layout and accessibility styles**

Add these rules inside the component's existing `@layer starlight.core` block:

```css
.sidebar-collapse-toggle {
  display: none;
}

@media (min-width: 50rem) {
  .sidebar-pane,
  .main-frame,
  .sidebar-collapse-toggle {
    transition-duration: var(--sidebar-collapse-duration);
    transition-property: inset-inline-start, padding-inline-start, transform;
    transition-timing-function: ease;
  }

  .sidebar-collapse-toggle {
    position: fixed;
    z-index: calc(var(--sl-z-index-menu) + 1);
    inset-block-start: calc(var(--sl-nav-height) + 1rem);
    inset-inline-start: calc(var(--sl-sidebar-width) - 0.875rem);
    display: grid;
    width: 1.75rem;
    height: 1.75rem;
    place-items: center;
    border: 1px solid var(--sl-color-hairline-shade);
    border-radius: 999px;
    background: var(--sl-color-bg);
    color: var(--sl-color-text-accent);
    cursor: pointer;
  }

  .sidebar-collapse-toggle:focus-visible {
    outline: 2px solid var(--sl-color-accent);
    outline-offset: 2px;
  }

  :global(html[data-sidebar-collapsed="true"]) {
    --sl-content-inline-start: 0rem;
  }

  :global(html[data-sidebar-collapsed="true"]) .sidebar-pane {
    pointer-events: none;
    transform: translateX(-100%);
  }

  :global(html[data-sidebar-collapsed="true"]) .sidebar-collapse-toggle {
    inset-inline-start: 0.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sidebar-pane,
  .main-frame,
  .sidebar-collapse-toggle {
    transition-duration: 0s;
  }
}
```

Add the shared duration to the existing `:root` block in
`src/styles/starlight.css`:

```css
  --sidebar-collapse-duration: 180ms;
```

- [ ] **Step 5: Run targeted static validation**

Run: `npm run check`

Expected: PASS with zero Astro errors.

- [ ] **Step 6: Build the production site**

Run: `npm run build`

Expected: PASS and generate the site in `dist/`.

- [ ] **Step 7: Commit the collapse behavior**

```bash
git add src/components/PageFrame.astro src/styles/starlight.css
git commit -m "feat: add persistent desktop sidebar collapse"
```

### Task 3: Verify Responsive And Persistent Behavior

**Files:**
- Verify: `src/components/PageFrame.astro`
- Verify: `src/styles/starlight.css`

- [ ] **Step 1: Start the production preview**

Run: `npm run preview -- --host 127.0.0.1`

Expected: Astro reports a local preview URL without errors.

- [ ] **Step 2: Verify desktop behavior**

At a viewport wider than `50rem`, confirm:

- the button appears at the sidebar's right edge;
- clicking it hides the whole left sidebar;
- the reading area expands without horizontal overflow;
- the button remains on the left edge and changes to a right arrow;
- clicking again restores the sidebar;
- focus is visible and Enter/Space activate the button.

- [ ] **Step 3: Verify persistence and failure fallback**

Collapse the sidebar, reload, and navigate to another article. Confirm the
sidebar remains collapsed. Then disable storage access in browser developer
tools or simulate a storage exception and confirm the control still toggles for
the current page.

- [ ] **Step 4: Verify mobile and presentation variants**

At a viewport narrower than `50rem`, confirm the new button is hidden and the
existing Starlight mobile menu still works. Also confirm light theme, dark
theme, print preview, and reduced-motion mode behave as specified.

- [ ] **Step 5: Run final automated validation**

Run: `npm run build`

Expected: PASS with zero Astro check errors and a successful production build.

### Task 4: Default New Visitors To Collapsed

**Files:**
- Modify: `src/components/PageFrame.astro`

- [ ] **Step 1: Verify the current initializer lacks the new default**

Run:

```bash
rg -n 'localStorage.getItem\("starlight-sidebar-collapsed"\) === "true"' src/components/PageFrame.astro
```

Expected: one match, proving a missing storage key currently leaves the sidebar
expanded.

- [ ] **Step 2: Change the early initializer to default to collapsed**

Replace the initializer body with:

```astro
<script is:inline>
  (() => {
    let collapsed = true;
    try {
      collapsed = localStorage.getItem("starlight-sidebar-collapsed") !== "false";
    } catch {}

    if (collapsed) document.documentElement.dataset.sidebarCollapsed = "true";
    else delete document.documentElement.dataset.sidebarCollapsed;
  })();
</script>
```

This treats a missing key and storage failures as collapsed, while preserving a
user's explicit stored `"false"` choice to keep the sidebar expanded.

- [ ] **Step 3: Verify the new default logic is present**

Run:

```bash
rg -n 'let collapsed = true|!== "false"' src/components/PageFrame.astro
```

Expected: both lines match.

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: PASS with zero Astro check errors and a successful production build.

- [ ] **Step 5: Commit the default-state change**

```bash
git add src/components/PageFrame.astro
git commit -m "fix: default desktop sidebar to collapsed"
```
