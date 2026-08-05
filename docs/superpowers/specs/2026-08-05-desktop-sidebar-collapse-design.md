# Desktop Sidebar Collapse Design

## Summary

Add a desktop-only control that collapses the entire left navigation sidebar.
The control sits on the sidebar's right edge, the main reading area expands
when the sidebar is hidden, and the chosen state persists across navigation and
page reloads.

## Goals

- Let desktop readers hide and restore the complete left sidebar.
- Keep the control visually attached to the sidebar edge.
- Expand the main content into the space released by the sidebar.
- Remember the reader's choice in browser-local storage.
- Preserve Starlight's existing mobile navigation behavior.

## Non-Goals

- Do not change collapsible groups inside the sidebar.
- Do not replace or modify the mobile menu.
- Do not synchronize the preference across browsers or devices.
- Do not redesign the header, sidebar contents, or right table of contents.

## Implementation Approach

Override Starlight's `PageFrame` component through the supported component
configuration. Keep its existing page structure and mobile menu behavior, then
add the desktop collapse control next to the sidebar pane.

This approach is preferred over runtime DOM injection because the button is
part of the rendered page structure, avoids visible insertion after load, and
provides a clear place for styling, state handling, and accessibility. The
override should remain as close as practical to Starlight's current component
to reduce maintenance when Starlight is upgraded.

## Interaction And Layout

- Show the control only at Starlight's desktop breakpoint.
- In the expanded state, place a small circular left-arrow button on the
  sidebar's right edge.
- Activating the button hides the entire left sidebar and removes its reserved
  layout width so the main frame expands.
- In the collapsed state, retain the control at the left viewport edge and
  change it to a right arrow for restoring the sidebar.
- Use a short transition for the sidebar, content offset, and button position.
- Hide the control in print output.

## State And Loading

Store the sidebar preference in `localStorage` under a feature-specific key.
Collapse the sidebar by default when no saved preference exists. Once the user
manually expands or collapses it, apply that explicit choice on later pages and
reloads. Apply the state as early as practical so navigation does not visibly
render the opposite state first. If storage is unavailable, default to the
collapsed state and allow the control to work for the current page without
persistence.

## Accessibility

- Use a native `button` element.
- Provide Chinese `aria-label` text describing the next action: collapse or
  expand the sidebar.
- Keep `aria-expanded` synchronized with the visible sidebar state.
- Support normal keyboard activation and a visible focus indicator.
- Respect `prefers-reduced-motion` by disabling the transition when requested.

## Validation

- Verify the sidebar collapses and restores on a desktop viewport.
- Verify the main content expands and returns without horizontal overflow.
- Verify the saved choice survives reloads and navigation between articles.
- Verify a first visit with no saved preference starts with the sidebar
  collapsed.
- Verify the mobile menu continues to open and close normally.
- Verify keyboard operation, labels, focus styling, light and dark themes, and
  reduced-motion behavior.
- Run the project's targeted Astro check and production build.
