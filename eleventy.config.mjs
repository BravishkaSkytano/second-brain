import pluginWebc from "@11ty/eleventy-plugin-webc";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

import emojiShortName from "emoji-short-name";
import { parseHTML } from "linkedom";

import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
	eleventyConfig.on('eleventy.before', async () => {
    const tailwindInputPath = path.resolve('./_includes/layouts/css/styles.css');
    const tailwindOutputPath = './_site/css/styles.css';
    const cssContent = fs.readFileSync(tailwindInputPath, 'utf8');
    const outputDir = path.dirname(tailwindOutputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = await postcss([tailwindcss()]).process(cssContent, {
      from: tailwindInputPath,
      to: tailwindOutputPath,
    });

    fs.writeFileSync(tailwindOutputPath, result.css);
	});
	
	eleventyConfig.ignores.add("./README.md");
	eleventyConfig.addWatchTarget("./_components/**/*.css");

	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: {
			"tabindex": "0"
		}
	});

	eleventyConfig.addPlugin(pluginWebc, {
		components: [
			"_includes/components/**/*.webc",
			"npm:@11ty/is-land/*.webc"
		]
	});

	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		formats: ["webp", "jpeg"],
		urlPath: "/img/",

		defaultAttributes: {
			loading: "lazy",
			decoding: "async"
		}
	});

	eleventyConfig.setServerOptions({
		domDiff: false
	});

	eleventyConfig.addJavaScriptFunction("emojiShortName", (emoji) => {
		return emojiShortName[emoji];
	})

	eleventyConfig.addJavaScriptFunction("selectFromHtml", (html, selector) => {
		const { document } = parseHTML(html);
		return document.querySelectorAll(selector);
	});

};
