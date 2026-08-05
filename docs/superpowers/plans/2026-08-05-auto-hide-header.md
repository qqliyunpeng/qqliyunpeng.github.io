# Auto-Hide Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the fixed top header after deliberate downward scrolling and restore it immediately on upward scrolling without moving the sidebar or document layout.

**Architecture:** Put scroll-direction state transitions in a small pure JavaScript module so threshold, upward restoration, top-of-page behavior, and focus behavior can be tested without a browser. The custom Starlight `PageFrame` connects that state machine to a passive scroll listener and a root data attribute; scoped CSS transforms only the fixed header.

**Tech Stack:** Astro 7, Starlight 0.41, browser scroll events, CSS transforms, Node.js built-in test runner

---

## File Structure

- Create `src/scripts/header-scroll-state.js`: pure state transition logic for header visibility.
- Create `tests/header-scroll-state.test.mjs`: focused unit tests for scroll direction and thresholds.
- Modify `src/components/PageFrame.astro`: connect browser events to the state logic and add header transform styles.

### Task 1: Build And Test The Scroll State Machine

**Files:**
- Create: `tests/header-scroll-state.test.mjs`
- Create: `src/scripts/header-scroll-state.js`

- [ ] **Step 1: Write the failing state tests**

Create `tests/header-scroll-state.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  createHeaderScrollState,
  updateHeaderScrollState
} from "../src/scripts/header-scroll-state.js";

test("small downward movements keep the header visible", () => {
  let state = createHeaderScrollState();
  state = updateHeaderScrollState(state, 5);
  state = updateHeaderScrollState(state, 11);
  assert.equal(state.hidden, false);
});

test("twelve pixels of downward movement hide the header", () => {
  let state = createHeaderScrollState();
  state = updateHeaderScrollState(state, 5);
  state = updateHeaderScrollState(state, 12);
  assert.equal(state.hidden, true);
});

test("upward movement restores a hidden header", () => {
  const state = updateHeaderScrollState(
    { lastY: 40, downwardDistance: 0, hidden: true },
    39
  );
  assert.equal(state.hidden, false);
});

test("returning near the page top restores the header", () => {
  const state = updateHeaderScrollState(
    { lastY: 40, downwardDistance: 0, hidden: true },
    4
  );
  assert.equal(state.hidden, false);
});

test("focus inside the header restores it", () => {
  const state = updateHeaderScrollState(
    { lastY: 40, downwardDistance: 0, hidden: true },
    40,
    true
  );
  assert.equal(state.hidden, false);
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `node --test tests/header-scroll-state.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for
`src/scripts/header-scroll-state.js`.

- [ ] **Step 3: Implement the minimal state machine**

Create `src/scripts/header-scroll-state.js`:

```js
const hideThreshold = 12;
const topThreshold = 4;

export function createHeaderScrollState(currentY = 0) {
  return {
    lastY: Math.max(0, currentY),
    downwardDistance: 0,
    hidden: false
  };
}

export function updateHeaderScrollState(state, currentY, focusWithin = false) {
  const nextY = Math.max(0, currentY);
  const delta = nextY - state.lastY;

  if (nextY <= topThreshold || focusWithin || delta < 0) {
    return { lastY: nextY, downwardDistance: 0, hidden: false };
  }

  if (delta === 0) return { ...state, lastY: nextY };

  const downwardDistance = state.downwardDistance + delta;
  if (downwardDistance >= hideThreshold) {
    return { lastY: nextY, downwardDistance: 0, hidden: true };
  }

  return { lastY: nextY, downwardDistance, hidden: state.hidden };
}
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `node --test tests/header-scroll-state.test.mjs`

Expected: 5 tests pass, 0 fail.

- [ ] **Step 5: Commit the tested state machine**

```bash
git add src/scripts/header-scroll-state.js tests/header-scroll-state.test.mjs
git commit -m "test: define auto-hide header scroll behavior"
```

### Task 2: Connect Header Visibility To Page Scrolling

**Files:**
- Modify: `src/components/PageFrame.astro`

- [ ] **Step 1: Import the tested state functions in the component script**

Add this import at the start of the processed `<script>` block:

```js
import {
  createHeaderScrollState,
  updateHeaderScrollState
} from "../scripts/header-scroll-state.js";
```

- [ ] **Step 2: Add the passive scroll and focus behavior**

After the sidebar toggle listener, add:

```js
const header = document.querySelector<HTMLElement>(".header");
let headerScrollState = createHeaderScrollState(window.scrollY);

const renderHeaderState = () => {
  root.toggleAttribute("data-header-hidden", headerScrollState.hidden);
};

window.addEventListener(
  "scroll",
  () => {
    const focusWithin = header?.contains(document.activeElement) ?? false;
    headerScrollState = updateHeaderScrollState(
      headerScrollState,
      window.scrollY,
      focusWithin
    );
    renderHeaderState();
  },
  { passive: true }
);

header?.addEventListener("focusin", () => {
  headerScrollState = updateHeaderScrollState(headerScrollState, window.scrollY, true);
  renderHeaderState();
});
```

- [ ] **Step 3: Add the transform transition**

Add these declarations to the existing `.header` rule:

```css
      transition-duration: var(--sidebar-collapse-duration);
      transition-property: transform;
      transition-timing-function: ease;
```

Add this rule after `.header`:

```css
    :global(html[data-header-hidden]) .header {
      transform: translateY(-100%);
    }
```

Add `.header` to the existing reduced-motion selector:

```css
      .header,
      .sidebar-pane,
      .main-frame,
      .sidebar-collapse-toggle {
        transition-duration: 0s;
      }
```

- [ ] **Step 4: Run unit and Astro validation**

Run:

```bash
node --test tests/header-scroll-state.test.mjs
npm run check
```

Expected: 5 tests pass and Astro reports 0 errors.

- [ ] **Step 5: Build the production site**

Run: `npm run build`

Expected: PASS and generate the site in `dist/`.

- [ ] **Step 6: Commit the browser integration**

```bash
git add src/components/PageFrame.astro
git commit -m "feat: auto-hide header while scrolling down"
```

### Task 3: Verify The Built Interaction Contract

**Files:**
- Verify: `dist/about/index.html`
- Verify: `dist/_astro/*.css`

- [ ] **Step 1: Verify the production HTML contains the behavior**

Run:

```bash
rg -n "data-header-hidden|focusin" dist/about/index.html dist/_astro
```

Expected: the built JavaScript includes the hidden-state attribute and focus
restoration listener.

- [ ] **Step 2: Verify the production CSS contains transform and reduced-motion rules**

Run:

```bash
rg -n "data-header-hidden|translateY|prefers-reduced-motion" dist/_astro -g "*.css"
```

Expected: the generated CSS contains the header transform and reduced-motion
media query.

- [ ] **Step 3: Run final verification**

Run:

```bash
node --test tests/header-scroll-state.test.mjs
npm run build
git diff --check
git status --short
```

Expected: 5 tests pass, the build succeeds, diff check is clean, and the Git
working tree is clean after commits.
