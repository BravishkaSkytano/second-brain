# AI Coding Agent Guide — Second Brain

This file tells AI coding agents how to work productively in this repository.

## Quick facts

- Project: Eleventy static site (content in `content/`, templates in `layouts/` and `_includes/`).
- Build tooling: Eleventy + Tailwind/PostCSS; Node >= 18 required.
- Key files: `package.json`, `eleventy.config.js`, `_includes/css/index.css`, `_data/eleventyDataSchema.js`.

## Code style

- JavaScript/Node: ES modules (see `type: "module"` in `package.json`). Follow existing style in `eleventy.config.js`.
- Templates: Liquid and plain HTML inside `layouts/` and `_includes/`.
- Content: Markdown files under `content/` with frontmatter keys the site expects (see `_data/eleventyDataSchema.js`).

## Build & test commands (run these first)

- Install: `npm install`
- Dev server: `npm run start` (runs Eleventy with --serve)
- Build: `npm run build` (produces `_site/`)
- Dry-run / test templates: `npm run test` (Eleventy --dryrun)
- Clean artifacts: `npm run clean`

## Architecture & conventions

- Content is the primary input: `content/` is the Eleventy input dir (configured in `eleventy.config.js`).
- Layouts and includes live in `layouts/` and `_includes/` (Eleventy layout aliases are set in `eleventy.config.js`).
- Collections: `journal, media, notes, people, places, posts, projects, sources, worldbuilding, writing` (defined in `eleventy.config.js`). When adding content, place files under the matching subfolder.
- Drafts: If a content file has `draft: true` in frontmatter it will be labeled and excluded during builds when `ELEVENTY_RUN_MODE=build` (see `eleventy.config.js`).

## Styling and assets

- Tailwind is compiled at build/serve time by a PostCSS step that processes `_includes/css/index.css` and writes `_site/css/index.css` (see `eleventy.config.js` PostCSS hook).
- daisyUI instructions are included under `.github/instructions/daisyui.instructions.md` for component rules and theming.
- Image optimization uses `@11ty/eleventy-img` plugin and the Eleventy image transform in `eleventy.config.js`; add source images under `content/` and let the plugin generate optimized outputs.

## Project-specific patterns agents should follow

- When editing templates or shortcodes, prefer small, focused changes and run `npm run test` or `npm run start` to validate output.
- Preserve frontmatter keys used by collections and global computed data (don't remove `date`, `title`, `draft`, etc.).
- Avoid adding new global data keys without updating `_data/eleventyDataSchema.js`.
- Use existing layout aliases (`base`, `home`, `page`, `post`) when creating pages.

## Integration & environment

- Node version: use Node >= 18 (declared in `package.json`).
- Environment variables:
  - `ELEVENTY_RUN_MODE=build` — used to exclude drafts during CI builds.
- Passthrough copy: `public/` is copied to `_site/` (see `eleventy.config.js`).

## Security & sensitive areas

- No secrets or credentials are stored in the repo. If adding integrations, use environment variables and document them in the repository README.

## Where to look for examples

- Eleventy configuration and collection examples: `eleventy.config.js`.
- Build scripts: `package.json`.
- CSS entrypoint: `_includes/css/index.css`.
- Data schema for content: `_data/eleventyDataSchema.js`.

If anything in this file is unclear or you want different sections, tell me which parts to expand or correct.
