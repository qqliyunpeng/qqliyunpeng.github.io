# Mobile Table of Contents Auto-Hide Design

## Goal

On mobile viewports, hide the “本页内容” bar together with the fixed top
navigation after deliberate downward scrolling. Keep both hidden during normal
upward scrolling and restore both only when the page returns near the top.

## Scope

- Reuse the existing header scroll state and its `data-header-hidden` root
  attribute.
- Apply the behavior only below Starlight's `50rem` desktop breakpoint.
- Keep the desktop table of contents, mobile menu, and sidebar behavior
  unchanged.
- Preserve the existing `12px` hide threshold and `4px` top threshold.

## Design

Add a mobile-only style in the custom `PageFrame` that translates
`mobile-starlight-toc` upward when `data-header-hidden` is present. The
translation must cover both the navigation height and the mobile table of
contents height so the bar fully leaves the viewport with the navigation.

The document's existing top padding remains unchanged while the controls are
hidden. This prevents the article from jumping as visibility changes. The
mobile table of contents uses the same transition timing as the header and
disables that transition when the user prefers reduced motion.

No new scroll listener or state machine is needed. Returning near the page top
already removes `data-header-hidden`, restoring both controls.

## Validation

- Run the existing header scroll-state unit tests.
- Build the Astro site.
- Confirm generated CSS contains the mobile table of contents transform and
  reduced-motion handling.
- Confirm the selector is limited to mobile widths and does not affect the
  desktop table of contents.
