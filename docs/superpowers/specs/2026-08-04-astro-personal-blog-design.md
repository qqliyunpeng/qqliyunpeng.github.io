# Astro Personal Blog Design

## Summary

Build a Chinese-first personal blog with Astro for the GitHub Pages user site
`qqliyunpeng.github.io`, published at `https://qqliyunpeng.github.io/`.

The site will use a minimal reading-focused design. The first screen emphasizes
the author's identity, a concise introduction, and recent writing. The
implementation should stay close to Astro's standard project structure rather
than adopting a large third-party theme.

## Goals

- Create a publishable Astro blog for `qqliyunpeng.github.io`.
- Use Chinese as the default interface language.
- Prioritize readable long-form posts, fast static output, and simple
  maintenance.
- Support common blog features in the first version: tags, RSS, sitemap, SEO,
  code highlighting, table of contents, dark mode, and static search.
- Configure GitHub Pages deployment for a user-site repository.

## Non-Goals

- Do not use a prebuilt visual theme that dominates the project structure.
- Do not build comments, authentication, analytics, CMS editing, or newsletter
  subscriptions in the first version.
- Do not configure a project-site `base` path, because the target is a GitHub
  user site at the domain root.

## Architecture

The blog will be a static Astro application.

- Astro renders pages at build time.
- Blog posts live in `src/content/blog/` and are managed through Astro Content
  Collections.
- Layout components provide shared page chrome, document metadata, typography,
  color mode support, and post rendering.
- GitHub Actions builds the site and deploys the generated `dist/` directory to
  GitHub Pages.
- Pagefind indexes the built static output after `astro build` for client-side
  static search.

## Pages

- `src/pages/index.astro`
  - Minimal homepage with name, short introduction, latest posts, and primary
    navigation.
- `src/pages/blog/index.astro`
  - Full reverse-chronological article list.
- `src/pages/blog/[...slug].astro`
  - Article detail pages generated from the blog content collection.
- `src/pages/tags/index.astro`
  - List of all tags.
- `src/pages/tags/[tag].astro`
  - Tag archive pages.
- `src/pages/about.astro`
  - Chinese About page with editable starter text.
- `src/pages/search.astro`
  - Static search page backed by Pagefind.
- `src/pages/rss.xml.ts`
  - RSS feed.

## Content Model

Each blog post uses Markdown or MDX frontmatter with this schema:

- `title`: post title
- `description`: short summary for lists, SEO, and RSS
- `pubDate`: publication date
- `updatedDate`: optional last-updated date
- `tags`: string array
- `draft`: boolean, excluded from production output when true

Initial sample content should include one starter post that demonstrates
headings, code blocks, tags, and table of contents behavior.

## Visual Design

The selected direction is "Minimal Reading".

- Use restrained colors, generous line height, and a narrow reading measure.
- Keep homepage and article layouts text-first.
- Avoid decorative visual noise and large marketing-style sections.
- Support light and dark modes with a small toggle in the header.
- Make mobile layouts first-class: readable type size, stable spacing, and no
  horizontal overflow.

## SEO And Feeds

- Set `site` to `https://qqliyunpeng.github.io` in `astro.config.mjs`.
- Do not set `base`.
- Add `@astrojs/sitemap`.
- Add `@astrojs/rss`.
- Provide reusable metadata fields for title, description, canonical URL, and
  Open Graph basics.
- Generate RSS from non-draft blog posts.

## Deployment

Use GitHub Actions for GitHub Pages:

- Trigger on pushes to `main`.
- Install Node dependencies.
- Build Astro.
- Upload the static output.
- Deploy through the official GitHub Pages action flow.

The GitHub repository should be named `qqliyunpeng.github.io`.

## Validation

Implementation is complete when these checks pass:

- `npm run build`
- `npm run preview` starts successfully
- Homepage, article list, article detail, tags, About, RSS, sitemap, and search
  pages render locally
- GitHub Actions workflow exists for Pages deployment

## Open Decisions Resolved

- Deployment type: GitHub Pages user site
- Repository/site name: `qqliyunpeng.github.io`
- Homepage style: minimal reading-focused
- Default language: Chinese
- First-version scope: full blog basics plus search, code highlighting, table of
  contents, and dark mode
