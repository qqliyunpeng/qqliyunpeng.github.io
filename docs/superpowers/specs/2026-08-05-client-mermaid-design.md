# Client-Side Mermaid Design

## Summary

Render fenced `mermaid` code blocks in the browser only on pages that contain
them. Load Mermaid with a dynamic import, render diagrams as SVG, and rerender
them when Starlight switches between light and dark themes.

## Goals

- Support Mermaid fenced code blocks in Markdown articles.
- Avoid loading Mermaid on pages without diagrams.
- Match Starlight's current light or dark theme.
- Keep GitHub Pages builds static and browser-free.
- Preserve readable Mermaid source when rendering fails.

## Non-Goals

- Do not render Mermaid during the Astro build.
- Do not add a custom diagram editor or toolbar.
- Do not support arbitrary executable HTML in diagrams.

## Architecture

Add Mermaid as a runtime dependency. A focused client module scans for
`pre > code.language-mermaid`; if none exist, it exits before importing
Mermaid. When diagrams exist, it dynamically imports Mermaid, replaces each
code block with a diagram container, and stores the original source in memory
for theme rerenders. The existing custom `PageFrame` starts this module.

Use Mermaid's strict security mode. Select `dark` for Starlight's dark theme
and `default` for its light theme. A `MutationObserver` watches only the root
`data-theme` attribute and rerenders existing diagrams after a theme change.

## Failure Handling

Render diagrams independently. If one diagram is invalid, leave its original
code block visible and mark it with an accessible Chinese error message. A
failed diagram must not prevent other diagrams from rendering.

## Presentation

Center rendered SVG diagrams, allow horizontal overflow for wide diagrams, and
keep their maximum width within the article. Use transparent backgrounds so
the diagram fits both Starlight themes.

## Validation

- Verify pages without Mermaid do not request the Mermaid chunk.
- Verify a Mermaid code block becomes an SVG.
- Verify light and dark theme selection logic.
- Verify invalid syntax preserves the source block.
- Verify generated SVG does not overflow the content column.
- Run focused unit tests, Astro check, and the production build.
