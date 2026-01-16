import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import markdownIt from "markdown-it";
import InterlinkerPlugin from "@photogabble/eleventy-plugin-interlinker";

import pluginFilters from "./_config/filters.js";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function(eleventyConfig) {
	// Drafts, see also _data/eleventyDataSchema.js
	eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
		if (data.draft) {
			data.title = `${data.title} (draft)`;
		}

		if(data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig
		.addPassthroughCopy({
			"./public/": "/"
		})
		.addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch CSS files
	eleventyConfig.addWatchTarget("css/**/*.css");
	// Watch images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}");

	// Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
	// Bundle <style> content and adds a {% css %} paired shortcode
	eleventyConfig.addBundle("css", {
		toFileDirectory: "dist",
		// Add all <style> content to `css` bundle (use <style eleventy:ignore> to opt-out)
		// Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
		bundleHtmlContentFromSelector: "style",
	});

	// Bundle <script> content and adds a {% js %} paired shortcode
	eleventyConfig.addBundle("js", {
		toFileDirectory: "dist",
		// Add all <script> content to the `js` bundle (use <script eleventy:ignore> to opt-out)
		// Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
		bundleHtmlContentFromSelector: "script",
	});

	// Official plugins
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom", // or "rss", "json"
		outputPath: "/feed/feed.xml",
		stylesheet: "pretty-atom-feed.xsl",
		templateData: {
			eleventyNavigation: {
				key: "Feed",
				order: 4
			}
		},
		collection: {
			name: "posts",
			limit: 10,
		},
		metadata: {
			language: "en",
			title: "The Thought Archive",
			subtitle: "Echoes of learning, stitched together; A space where curiosity never settles.",
			base: "https://the-thought-archive.netlify.app/",
			author: {
				name: "Yoela O."
			}
		}
	});

	// Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// Output formats for each image.
		formats: ["avif", "webp", "auto"],

		// widths: ["auto"],

		failOnError: false,
		htmlOptions: {
			imgAttributes: {
				// e.g. <img loading decoding> assigned on the HTML tag will override these values.
				loading: "lazy",
				decoding: "async",
			}
		},

		sharpOptions: {
			animated: true,
		},
	});

	// Filters
	eleventyConfig.addPlugin(pluginFilters);

	eleventyConfig.addPlugin(IdAttributePlugin, {
		// by default we use Eleventy’s built-in `slugify` filter:
		// slugify: eleventyConfig.getFilter("slugify"),
		// selector: "h1,h2,h3,h4,h5,h6", // default
	});

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return (new Date()).toISOString();
	});

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	// Interlinker
	eleventyConfig.addPlugin(InterlinkerPlugin, {
		defaultLayout: 'layouts/embed.liquid'
	});

	
  // Recognize Mediawiki links ([[text]])
  md.linkify.add("[[", {
    validate: /^\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/,
    normalize: match => {
      const parts = match.raw.slice(2, -2).split("|");
      const slug = slugify(parts[0].replace(/.(md|markdown)\s?$/i, "").trim());
      const found = linkMapCache.get(slug);

      if (!found) throw new Error(`Unable to find page linked by wikilink slug [${slug}]`)

      match.text = parts.length === 2
        ? parts[1]
        : found.title;

      match.url = found.permalink.substring(0,1) === '/'
        ? found.permalink
        : `/${found.permalink}`;
			}
		})

	// This regex finds all wikilinks in a string
	const wikilinkRegExp = /(?<!!)\[\[([^|]+?)(\|([\s\S]+?))?\]\]/g;

	const parseWikilinks = (arr) => arr.map(link => {
		const parts = link.slice(2, -2).split("|");
		const slug = slugify(parts[0].replace(/.(md|markdown)\s?$/i, "").trim());

		return {
			title: parts.length === 2 ? parts[1] : null,
			link,
			slug
		}
	});

	// This function gets past each page via *.11tydata.js in order to
	// fill that pages backlinks data array.
	if (!data.collections.all || data.collections.all.length === 0) return [];
  const allPages = data.collections.all;
  const currentSlug = slugify(data.title);
  let backlinks = [];
  let currentSlugs = [currentSlug];

  // Populate our link map for use later in replacing wikilinks with 
  // page permalinks.
  // Pages can list aliases in their front matter, if those exist we
  // should map them as well.

  linkMapCache.set(currentSlug, {
    permalink: data.permalink,
    title: data.title
  });

  if (data.aliases) {
    for(const alias of data.aliases) {
      const aliasSlug = slugify(alias);
      linkMapCache.set(aliasSlug, {
        permalink: data.permalink,
        title: alias
      });
      currentSlugs.push(aliasSlug)
    }
  }

  // Loop over all pages and build their outbound links if they
  // have not already been parsed, this is being done in a way 
  // that is cached between reloads so restarting the dev server
  // will be required to pick up changes.
  
  allPages.forEach(page => {
    if (!page.data.outboundLinks) {
      const pageContent = page.template.frontMatter.content;
      const outboundLinks = (pageContent.match(wikilinkRegExp) || []);
      page.data.outboundLinks = parseWikilinks(outboundLinks);
    }

    // If the page links to our current page either by its title
    // or by its aliases then add that page to our current 
    // page's backlinks.
    
    if (page.data.outboundLinks.some(link => currentSlugs.includes(link.slug))) {
      backlinks.push({
        url: page.url,
        title: page.data.title,
      })
    }
  });

  // The backlinks for the current page, set to the page data
  return backlinks;
};

export const config = {
	// Control which files Eleventy will process
	// e.g.: *.md, *.njk, *.html, *.liquid
	templateFormats: [
		"md",
		"njk",
		"html",
		"liquid",
		"11ty.js",
	],

	// Pre-process *.md files with: (default: `liquid`)
	markdownTemplateEngine: "njk",

	// Pre-process *.html files with: (default: `liquid`)
	htmlTemplateEngine: "njk",

	// These are all optional:
	dir: {
		input: "content",          // default: "."
		includes: "../_includes",  // default: "_includes" (`input` relative)
		data: "../_data",          // default: "_data" (`input` relative)
		output: "_site"
	},

	// -----------------------------------------------------------------
	// Optional items:
	// -----------------------------------------------------------------

	// If your site deploys to a subdirectory, change `pathPrefix`.
	// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

	// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
	// it will transform any absolute URLs in your HTML to include this
	// folder name and does **not** affect where things go in the output folder.

	// pathPrefix: "/",
};
