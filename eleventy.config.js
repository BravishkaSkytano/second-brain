import fs from "fs";
import path from "path";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import {
  IdAttributePlugin,
  InputPathToUrlTransformPlugin,
  HtmlBasePlugin,
} from "@11ty/eleventy";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
  eleventyConfig.on("eleventy.before", async () => {
    const tailwindInputPath = path.resolve("./_includes/css/index.css");
    const tailwindOutputPath = "./_site/css/index.css";
    const cssContent = fs.readFileSync(tailwindInputPath, "utf8");
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

  // Drafts, see also _data/eleventyDataSchema.js
  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
    if (data.draft) {
      data.title = `${data.title} (draft)`;
    }

    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig.addPassthroughCopy({
    "./public/": "/",
    // "./_includes/css/": "/",
    // "./_includes/js/": "/js/",
  });

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

  // Watch CSS files
  eleventyConfig.addWatchTarget("_includes/css/*.css");
  // Watch images for the image pipeline.
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}");

  // Per-page bundles, see https://github.com/11ty/eleventy-plugin-bundle
  // Bundle <style> content and adds a {% css %} paired shortcode
  // eleventyConfig.addBundle("css", {
  //   toFileDirectory: "css",
  //   // Add all <style> content to `css` bundle (use <style eleventy:ignore> to opt-out)
  //   // Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
  //   bundleHtmlContentFromSelector: "style",
  // });

  // Bundle <script> content and adds a {% js %} paired shortcode
  // eleventyConfig.addBundle("js", {
  //   toFileDirectory: "js",
  //   // Add all <script> content to the `js` bundle (use <script eleventy:ignore> to opt-out)
  //   // Supported selectors: https://www.npmjs.com/package/posthtml-match-helper
  //   bundleHtmlContentFromSelector: "script",
  // });

  // Official plugins
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
  });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

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
      },
    },

    sharpOptions: {
      animated: true,
    },
  });

  eleventyConfig.addPlugin(IdAttributePlugin, {
    // by default we use Eleventy’s built-in `slugify` filter:
    // slugify: eleventyConfig.getFilter("slugify"),
    selector: "h2,h3,h4,h5,h6", // default
  });

  eleventyConfig.addShortcode("currentBuildDate", () => {
    return new Date().toISOString();
  });

  // Features to make your build faster (when you need them)

  // If your passthrough copy gets heavy and cumbersome, add this line
  // to emulate the file copy on the dev server. Learn more:
  // https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

  // eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  eleventyConfig.addLayoutAlias("base", "layouts/base.liquid");
  eleventyConfig.addLayoutAlias("home", "layouts/home.liquid");
  eleventyConfig.addLayoutAlias("page", "layouts/page.liquid");
  eleventyConfig.addLayoutAlias("post", "layouts/post.liquid");
}

export const config = {
  markdownTemplateEngine: false,
  templateFormats: ["md", "html", "liquid", "11ty.js"],
  dir: {
    input: "./content", // default: "."
    includes: "../_includes", // default: "_includes" (`input` relative)
    data: "../_data", // default: "_data" (`input` relative)
    output: "_site",
  },

  // -----------------------------------------------------------------
  // Optional items:
  // -----------------------------------------------------------------

  // If your site deploys to a subdirectory, change `pathPrefix`.
  // Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

  // When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
  // it will transform any absolute URLs in your HTML to include this
  // folder name and does **not** affect where things go in the output folder.

  pathPrefix: "/second-brain/",
};
