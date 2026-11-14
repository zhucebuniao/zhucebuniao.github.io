# AGENTS.md

Guidelines for coding agents working in this repository.

## Project Overview

- **Site**: 梦与远方 (`https://zhucebuniao.github.io`) — a static personal blog built with **Astro 5** (`^5.5.0`) and **TypeScript** (`astro/tsconfigs/strict`).
- **Architecture**: Static site generation (`output: "static"` in `astro.config.mjs`) with zero client-side UI frameworks; interactivity is implemented with vanilla ES modules under `src/scripts/` and a single global stylesheet `src/styles/brutal.css` (Naïve Art / Gouache & Paper Collage design system).
- **Integrations**: `@astrojs/sitemap`, `@astrojs/rss`, Shiki (`tokyo-night`), passthrough image service.

## Common Commands

```sh
npm run dev       # Start local dev server (ASTRO_TELEMETRY_DISABLED=1 astro dev)
npm run build     # Build static site into dist/
npm run preview   # Preview built site locally
```

Always run `npm run build` after modifying layouts, pages, styles, scripts, or content config to verify the full static build succeeds.

## Repository Structure

- `_posts/` — Markdown blog posts (`**/*.md`), loaded via Astro Content Collections (`glob` loader in `src/content.config.ts`).
- `src/content.config.ts` — Zod schema for the `posts` collection.
- `src/lib/posts.ts` — Post querying, category metadata (`CN`, `CI`), and city statistics helpers.
- `src/layouts/` — `BaseLayout.astro` (global shell, nav, footer, progress bar, custom cursor, `window.RM` & `window.SCROLL_HOOKS`), `PostLayout.astro` (article hero, TOC, font-size switcher, reading progress badge).
- `src/pages/` — `index.astro`, `about.astro`, `posts/[id].astro`, `rss.xml.ts`.
- `src/scripts/` — Vanilla client scripts (`app.js`, `home.js`, `read.js`, `about.js`).
- `src/styles/brutal.css` — Design tokens (`:root`), layout, components, animations, view transitions, and reduced-motion rules.
- `public/` — Static assets copied as-is.

## Content & Frontmatter (`_posts/`)

Posts in `_posts/*.md` follow the schema in `src/content.config.ts`:
- Required: `title` (string), `date` (coerced Date)
- `category`: `'dream' | 'travel' | 'novel' | 'diary'` (defaults to `'dream'`)
- Optional: `subtitle`, `city`, `location`, `excerpt`, `description`, `tags` (`string[]`), `layout`

## Frontend, Styling & Motion Conventions

- **Browser Support**: Baseline Widely Available features may be used directly. Newly Available features (such as CSS Scroll-Driven Animations and View Transitions) should be progressively enhanced with `@supports` / `CSS.supports()` / `document.startViewTransition` and lightweight native fallbacks rather than external polyfills.
- **Reduced Motion**: Always respect both CSS `@media (prefers-reduced-motion: no-preference | reduce)` and JS `window.RM`. Gate `scroll-behavior: smooth`, `@view-transition`, and scroll-driven animations behind `prefers-reduced-motion: no-preference`.
- **View Transitions**:
  - Cross-document MPA transitions are enabled via `@view-transition { navigation: auto; }`.
  - Same-document archive filtering uses `document.startViewTransition` with per-card `view-transition-name` and shared `view-transition-class: archive-card`, temporarily applying `vt-filter` on `:root` (`view-transition-name: none`) while filtering.
- **Typography & Accessibility**:
  - Use `rem` for `--fs` and body font-size controls (`17 -> 1.0625rem`, `19 -> 1.1875rem`, `22 -> 1.375rem`) to respect browser root font-size settings.
  - Keep `text-wrap: balance` off elements with visible borders/backgrounds; use `text-wrap: pretty` on `.prose p`.
  - Preserve `.skip` link, `:focus-visible` outlines, and `aria-*` attributes (`aria-pressed`, `aria-live`, `aria-label`).
- **Modern Web Guidance**: Consult the `modern-web-guidance` skill before implementing or refactoring HTML/CSS or client-side JS features.

## Git & Deployment

- Default branch is `master`; pushing to `origin master` triggers GitHub deployment.
- Keep commits scoped to intentional changes and avoid committing unrelated untracked local notes or build artifacts (`dist/`).
