# Second Brain – Content Organization Guide

This repository is a Second Brain published with 11ty.
Its structure is intentionally simple, stable, and resistant to over-tinkering.

## Core Principle

Folders define what a note *is*.  
Categories define its primary type.  
Tags describe qualities, themes, and connections.

If a note feels hard to place, the note is complex, not the system.

---

## Canonical Folder List

These top-level folders are considered canonical and should rarely change.

- `people/` – Individual beings with identity (real, biblical, or fictional)
- `places/` – Physical or imagined locations
- `concepts/` – Abstract ideas, frameworks, and theories
- `organizations/` – Structured groups and institutions
- `projects/` – Time-bound or outcome-oriented work
- `sources/` – Books, articles, papers, and other reference material

Do not create new top-level folders without sustained pressure from real usage.

---

## Categories

Categories represent a note’s primary subtype.
They are usually singular and relatively stable.

Examples:
- `places` → country, city, region, landmark, fictional-world
- `people` → biblical, historical, fictional, author
- `concepts` → theology, education, ecology, writing
- `sources` → book, paper, article, video

Categories are used for Hugo list pages and navigation.

---

## Tags

Tags are descriptive, non-exclusive, and flexible.
They capture themes, associations, and secondary attributes.

Examples:
- polynesian
- scenic
- theology
- worldbuilding
- leadership

Tags are for discovery and cross-linking, not structure.

---

## Subfolders

Subfolders are avoided unless they reflect workflow or lifecycle differences.
Approved uses include:

- `projects/active/` and `projects/archive/`
- `journal/YYYY/`

Do not duplicate category logic with subfolders.

---

## Decision Rule

When creating a new note (`hugo new --kind TYPE notes/TYPE/note`):
1. Choose the folder by asking “What kind of thing is this?”
2. Assign one category that best fits
3. Add tags only if they help future discovery

This system favors clarity, longevity, and ease of use over perfect classification.

## To-Do

- [ ] Add 'people' taxomony
- [ ] Add 'books' taxomony
- [ ] Add 'movies' taxomony
- [ ] Add 'shows' taxomony

## Features

- Using [Eleventy v3](https://github.com/11ty/eleventy/releases/tag/v3.0.0) with zero-JavaScript output.
	- Content is exclusively pre-rendered (this is a static site).
	- Can easily [deploy to a subfolder without changing any content](https://www.11ty.dev/docs/plugins/html-base/)
	- All URLs are decoupled from the content’s location on the file system.
	- Configure templates via the [Eleventy Data Cascade](https://www.11ty.dev/docs/data-cascade/)
- **Performance focused**: four-hundos Lighthouse score out of the box!
	- _0 Cumulative Layout Shift_
	- _0ms Total Blocking Time_
- Local development live reload provided by [Eleventy Dev Server](https://www.11ty.dev/docs/dev-server/).
- Content-driven [navigation menu](https://www.11ty.dev/docs/plugins/navigation/)
- Fully automated [Image optimization](https://www.11ty.dev/docs/plugins/image/)
	- Zero-JavaScript output.
	- Support for modern image formats automatically (e.g. AVIF and WebP)
	- Processes images on-request during `--serve` for speedy local builds.
	- Prefers `<img>` markup if possible (single image format) but switches automatically to `<picture>` for multiple image formats.
	- Automated `<picture>` syntax markup with `srcset` and optional `sizes`
	- Includes `width`/`height` attributes to avoid [content layout shift](https://web.dev/cls/).
	- Includes `loading="lazy"` for native lazy loading without JavaScript.
	- Includes [`decoding="async"`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding)
	- Images can be co-located with blog post files.
- Per page CSS bundles [via `eleventy-plugin-bundle`](https://github.com/11ty/eleventy-plugin-bundle).
- Built-in [syntax highlighter](https://www.11ty.dev/docs/plugins/syntaxhighlight/) (zero-JavaScript output).
- Draft content: use `draft: true` to mark any template as a draft. Drafts are **only** included during `--serve`/`--watch` and are excluded from full builds. This is driven by the `addPreprocessor` configuration API in `eleventy.config.js`. Schema validator will show an error if non-boolean value is set in data cascade.
- Blog Posts
	- Automated next/previous links
	- Accessible deep links to headings
- Generated Pages
	- Home, Archive, and About pages.
	- [Atom feed included (with easy one-line swap to use RSS or JSON)](https://www.11ty.dev/docs/plugins/rss/)
	- `sitemap.xml`
	- Zero-maintenance tag pages ([View on the Demo](https://eleventy-base-blog.netlify.app/tags/))
	- Content not found (404) page

### Implementation Notes

- `content/about/index.md` is an example of a content page.
- `content/blog/` has the blog posts but really they can live in any directory. They need only the `posts` tag to be included in the blog posts [collection](https://www.11ty.dev/docs/collections/).
- Use the `eleventyNavigation` key (via the [Eleventy Navigation plugin](https://www.11ty.dev/docs/plugins/navigation/)) in your front matter to add a template to the top level site navigation. This is in use on `content/index.njk` and `content/about/index.md`.
- Content can be in _any template format_ (blog posts needn’t exclusively be markdown, for example). Configure your project’s supported templates in `eleventy.config.js` -> `templateFormats`.
- The `public` folder in your input directory will be copied to the output folder (via `addPassthroughCopy` in the `eleventy.config.js` file). This means `./public/css/*` will live at `./_site/css/*` after your build completes.
- This project uses three [Eleventy Layouts](https://www.11ty.dev/docs/layouts/):
	- `_includes/layouts/base.njk`: the top level HTML structure
	- `_includes/layouts/home.njk`: the home page template (wrapped into `base.njk`)
	- `_includes/layouts/post.njk`: the blog post template (wrapped into `base.njk`)
- `_includes/postslist.njk` is a Nunjucks include and is a reusable component used to display a list of all the posts. `content/index.njk` has an example of how to use it.

#### Content Security Policy

If your site enforces a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (as public-facing sites should), you have a few choices (pick one):

1. In `base.njk`, remove `<style>{% getBundle "css" %}</style>` and uncomment `<link rel="stylesheet" href="{% getBundleFileUrl "css" %}">`
2. Configure the server with the CSP directive `style-src: 'unsafe-inline'` (less secure).
