### Architecture Overview

This document explains how the portfolio is structured, how content flows from Directus into Astro, and how to extend blocks, routes, and animations.

## High-level

- Astro builds static pages using content fetched from Directus at build time
- A dynamic catch‑all route (`src/pages/[...path].astro`) determines which builder to render (page, post, project)
- A block-based builder composes pages from modular block components
- Barba.js coordinates page transitions, GSAP powers scroll/transition animations

## Key modules

- `src/directus/cli.ts`: Configures the Directus REST client via `apiUrl`
- `src/directus/queries/*`: Encapsulates typed queries for each collection
- `src/types/directusCollection.ts`: Type definitions for Directus collections used in templates
- `src/components/builders/*`: Builders that map typed content to block components
- `src/components/blocks/*`: Implementations of each block (presentation + props)
- `src/layouts/Layout/*`: Root layout and page transition hooks
- `src/scripts/initAnimations.ts`: Initializes GSAP, ScrollSmoother, and auto-registers Barba hooks

## Content flow

1) Build step calls `getStaticPaths` in `src/pages/[...path].astro`
2) Queries fetch `pages`, `posts`, and `projects` from Directus
3) Paths are constructed:
   - pages: `permalink`
   - posts: `/post/<slug>`
   - projects: `/project/<slug>`
4) For a given path, props are passed into the correct builder
5) `BlockBuilder.astro` iterates `pages.blocks`, lazy-imports the block component by `collection` key, and renders it with `item` fields

## Adding a block

1) Create the component under `src/components/blocks/<BlockName>/<BlockName>.astro`
2) Add Barba hooks optionally under the same folder as `<BlockName>.barba.ts`
3) Register the block in `BlockBuilder.astro` by mapping the Directus `collection` key to your component
4) Ensure types exist in `src/types/directusCollection.ts`

## Transitions and animations

- `src/scripts/initAnimations.ts` registers GSAP plugins and sets up ScrollSmoother
- Barba is exposed on `window`, prefetch enabled, and hooks are auto-loaded from:
  - `src/components/blocks/*/*.barba.ts`
  - `src/layouts/*/*.barba.ts`
- `src/layouts/Layout/Layout.barba.ts` defines an overlay scale transition for enter/leave
- `Layout.astro` includes the layout script and an overlay element used by the transition

## Styling & tokens

- Tailwind v4 is configured via `src/styles/global.css` with inline design tokens using CSS variables
- Fonts are imported via `@fontsource`
- The `tw()` utility combines `clsx` with `tailwind-merge`

## Environment

- Directus base URL: `src/types/env.ts` (`apiUrl`)
- For multi-environment setups, consider reading from `import.meta.env` and adding a type-safe wrapper

## Aliases

- Import aliases are defined in `components.json` and used throughout (e.g., `@/components`, `@/directus`)

## Deployment

- `bun run build` outputs a static site in `dist/`
- Host on any static provider (Netlify, Vercel, GitHub Pages). Ensure client-side scripts are served (no SSR required for them)

## Troubleshooting

- Missing content: verify Directus collections/fields match the types and that `status` filters are satisfied
- Transition issues: confirm `.overlay` exists in `Layout.astro` and that Barba scripts are loaded
- Styling issues: ensure `src/styles/global.css` is imported in `Head.astro`