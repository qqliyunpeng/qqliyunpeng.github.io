# Auto-Hide Header Design

## Summary

Hide the fixed top header when the reader scrolls down and restore it as soon
as the reader scrolls up. Keep the left sidebar and document layout in their
current positions so the page does not jump when the header changes state.

## Goals

- Increase reading space while scrolling down through an article.
- Restore navigation promptly when the reader scrolls upward.
- Avoid reacting to tiny trackpad or touch-scroll movements.
- Preserve the current sidebar position and content layout.
- Support desktop and mobile viewports.

## Non-Goals

- Do not collapse or move the left sidebar with the header.
- Do not change the mobile menu behavior.
- Do not hide the header while the page is at the top.
- Do not add a user preference or persistent setting for this behavior.

## Interaction

- Keep the header visible at the top of the page.
- Track the current and previous vertical scroll positions.
- When downward movement accumulates past `12px`, hide the header by moving it
  above the viewport.
- When any meaningful upward movement occurs, show the header immediately.
- Show the header when the page returns near the top.
- Show the header when keyboard focus enters it so its controls remain usable.
- Reset direction tracking after each visibility change to prevent jitter.

## Layout And Animation

The header remains fixed and retains its layout height. Hiding it uses a
vertical transform rather than changing document flow, so the main content and
left sidebar do not move. Use a short transition consistent with the sidebar
collapse animation. When `prefers-reduced-motion: reduce` is active, disable
the transition while retaining the visibility behavior.

## Implementation Approach

Keep the behavior in the custom `src/components/PageFrame.astro` because that
component owns the header wrapper. Add a root data attribute representing the
hidden state, a passive scroll listener that calculates direction and
threshold, and component-scoped styles that transform the header. Avoid CSS
scroll-driven animations because upward restoration and cross-browser support
are less predictable.

## Accessibility And Safety

- Never hide the header while focus is inside it.
- Restore the header before focusing one of its controls.
- Use a passive scroll listener to avoid blocking scrolling.
- Ignore horizontal scrolling and unchanged vertical positions.
- Clamp saved scroll positions to zero to handle browser overscroll.

## Validation

- Verify the header remains visible at the top.
- Verify small downward movements below `12px` do not hide it.
- Verify sustained downward scrolling hides it.
- Verify upward scrolling restores it immediately.
- Verify the left sidebar and content do not shift vertically.
- Verify mobile navigation still works after the header restores.
- Verify keyboard focus restores the header.
- Verify reduced-motion mode removes the animation.
- Run the Astro check and production build.
