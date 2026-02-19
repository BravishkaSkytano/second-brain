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
import interlinker from "@photogabble/eleventy-plugin-interlinker";
import markdownIt from "markdown-it";
import markdownItMark from "markdown-it-mark";
import markdownItAnchor from "markdown-it-anchor";
import mdItObsidianCallouts from "markdown-it-obsidian-callouts";

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
    // "./_includes/css/": "/css/",
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

  let options = {
    // Enable HTML tags in source
    html: true,

    // Use '/' to close single tags (<br />).
    // This is only for full CommonMark compatibility.
    // xhtmlOut: false,

    // Convert '\n' in paragraphs into <br>
    breaks: true,

    // CSS language prefix for fenced blocks. Can be
    // useful for external highlighters.
    // langPrefix: "language-",

    // Autoconvert URL-like text to links
    linkify: false,

    // Enable some language-neutral replacement + quotes beautification
    // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.mjs
    typographer: true,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externally.
    // If result starts with <pre... internal wrapper is skipped.
    // highlight: function (/*str, lang*/) {
    //   return "";
    // },
  };

  let md = markdownIt(options)
    .use(markdownItMark) // ==highlighted== text
    .use(markdownItAnchor, {
      // automatic heading IDs
      permalink: true, // optional: adds a link symbol
      permalinkClass: "header-anchor",
      permalinkSymbol: "¶",
    });
  md.use(mdItObsidianCallouts); // Obsidian-style callouts, e.g. > [!NOTE] This is a note.

  eleventyConfig.setLibrary("md", md);

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

  eleventyConfig.addPlugin(interlinker, {
    // defaultLayout is the optional default layout you would like
    // to use for wrapping your embeds.
    // e.g. defaultLayout: "layouts/embed.liquid",
    // defaultLayout: string,
    // defaultLayoutLang is the optional default engine(s) used to render
    // your embed layout. This defaults to your 11ty project default for
    // the embed source file; typically: liquid,md.
    // defaultLayoutLang: string,
    // layoutKey is the front-matter value used for a per embed
    // template, if found it will replace defaultLayout for
    // that embed. This will always default to `embedLayout`.
    // layoutKey: string,
    // layoutTemplateLangKey is the front-matter value used for setting the
    // layout engine(s) to render the embed's layout. This defaults to your
    // 11ty project default for the embed source file; typically: liquid,md.
    // layoutTemplateLangKey: string,
    // unableToLocateEmbedFn is invoked when an embed is unable
    // to be found, this is normally due to a typo in the
    // slug that you are using. This defaults to a function
    // that returns [UNABLE TO LOCATE EMBED].
    // unableToLocateEmbedFn: ErrorRenderFn,
    // deadLinkReport is the desired output format of the dead link report, by default its set to 'console'
    // deadLinkReport: 'console' | 'json' | 'none',
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
