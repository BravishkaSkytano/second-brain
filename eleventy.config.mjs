import pluginWebc from "@11ty/eleventy-plugin-webc";
import { IdAttributePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const isDev = process.env.ELEVENTY_ENV === "development";

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
	
	eleventyConfig.ignores.add("./README.md");
	eleventyConfig.addPassthroughCopy({
    "node_modules/flyonui/flyonui.js": "js/flyonui.js"
  });

	eleventyConfig.addPlugin(pluginWebc, {
		components: [
			"_includes/components/**/*.webc",
			"npm:@11ty/is-land/*.webc"
		]
	});

	eleventyConfig.addPlugin(IdAttributePlugin, {
		selector: "h2,h3,h4,h5,h6",

		// swaps html entities (like &amp;) to their counterparts before slugify-ing
		decodeEntities: true,

		// check for duplicate `id` attributes in application code?
		checkDuplicates: "error", // `false` to disable

		// by default we use Eleventy’s built-in `slugify` filter:
		slugify: eleventyConfig.getFilter("slugify"),

		filter: function({ page }) {
			if(page.inputPath.endsWith("test-skipped.html")) {
				return false; // skip
			}

			return true;
		}
	});

	if (!isDev) {
		eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
			formats: ["webp", "jpeg"],
			urlPath: "/img/",
			cacheOptions: { duration: "1w" },
			defaultAttributes: {
				loading: "lazy",
				decoding: "async"
			}
		});
	}

	eleventyConfig.setServerOptions({
		domDiff: false
	});

};

export const config = {
	dir: {
		input: 'content',
		output: '_site',
		includes: '../_includes',
		data: '../_data'
	},
	markdownTemplateEngine: "webc",
	htmlTemplateEngine: "webc",
};
