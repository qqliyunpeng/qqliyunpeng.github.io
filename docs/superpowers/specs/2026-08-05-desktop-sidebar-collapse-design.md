# Desktop Sidebar Collapse Design

## Summary

Add a desktop-only control that collapses the entire left navigation sidebar.
The control sits on the sidebar's right edge, the main reading area expands
when the sidebar is hidden, and the chosen state persists across navigation and
page reloads.

## Goals

- Let desktop readers hide and restore the complete left sidebar.
- Keep the control visually attached to the sidebar edge.
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
- Verify the article column keeps the exact same offset and width in both
  states, with no horizontal overflow.
- Verify the saved choice survives reloads and navigation between articles.
- Verify a first visit with no saved preference starts with the sidebar
  collapsed.
- Verify the mobile menu continues to open and close normally.
- Verify keyboard operation, labels, focus styling, light and dark themes, and
  reduced-motion behavior.
- Run the project's targeted Astro check and production build.

## Revision 2026-11-11: content no longer reflows

Earlier revisions let the main reading column expand into the space released by
collapsing the sidebar. That made the text jump sideways on every toggle, which
is distracting while reading. From the desktop breakpoint up to `72rem` the
column now keeps a constant `--sl-content-inline-start` (sidebar width plus band
offset) in both states, so collapsing only slides the sidebar out of the
viewport; the left gutter stays reserved as whitespace.

Above the desktop breakpoint but below `72rem` Starlight hides the right table of
contents, so a reserved left gutter would be pure whitespace on both sides. There
the two panes are linked: the article gutter drops to the band offset in every
state, the custom chevron control is hidden, and the sidebar is opened by
Starlight's mobile hamburger button (the floating one at the top-right of the
header) as an overlay drawer with a shadow. Opening it marks the article `inert`,
exactly like the mobile menu. Crossing back above `72rem` closes the drawer and
restores the saved desktop preference.
