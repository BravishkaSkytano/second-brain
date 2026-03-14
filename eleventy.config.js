import fs from "fs";
import path from "path";
import tailwindcss from "@tailwindcss/postcss";
import {
  IdAttributePlugin,
  InputPathToUrlTransformPlugin,
  HtmlBasePlugin,
} from "@11ty/eleventy";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import Image from "@11ty/eleventy-img";
import interlinker from "@photogabble/eleventy-plugin-interlinker";
import markdownIt from "markdown-it";
import markdownItMark from "markdown-it-mark";
import mdItObsidianCallouts from "markdown-it-obsidian-callouts";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
  eleventyConfig.on("eleventy.before", async () => {
    const { default: postcss } = await import("postcss");
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
      data.title = `${data.page.fileSlug} (draft)`;
    }

    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  // Point eleventy-img cache to a dedicated folder
  process.env.ELEVENTY_IMG_CACHE = path.join(".cache", "eleventy-img");

  // If your passthrough copy gets heavy and cumbersome, add this line
  // to emulate the file copy on the dev server. Learn more:
  // https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  // Copy the contents the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig.addPassthroughCopy({
    "./public/": "/",
    "./content/img/**/*": "/img/",
    // "./_includes/css/": "/css/",
    "./_includes/js/": "/js/",
    "./node_modules/flowbite/dist/flowbite.min.js": "/js/flowbite.min.js",
  });

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

  // Watch CSS files
  eleventyConfig.addWatchTarget("_includes/css/*.css");
  // Watch images for the image pipeline.
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}");

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
    .use(mdItObsidianCallouts); // Obsidian-style callouts, e.g. > [!NOTE] This is a note.

  eleventyConfig.setLibrary("md", md);

  // Official plugins
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
  });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

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

  eleventyConfig.addAsyncShortcode(
    "image",
    async function (src, alt, customClass) {
      let imagePath = src;

      const inputDir = "content";

      if (!src.startsWith("http")) {
        imagePath = path.resolve(inputDir, src);
      }

      const metadata = await Image(imagePath, {
        widths: [800, 1200, 1600],
        formats: ["webp"],
        outputDir: `_site/img/`,
        urlPath: `/img/`,
      });

      return Image.generateHTML(metadata, {
        alt: alt || "",
        sizes: "auto",
        loading: "eager",
        fetchpriority: "high",
        decoding: "async",
        class: customClass || "",
      });
    },
  );

  eleventyConfig.addLayoutAlias("base", "layouts/base.liquid");
  eleventyConfig.addLayoutAlias("home", "layouts/home.liquid");
  eleventyConfig.addLayoutAlias("page", "layouts/page.liquid");

  function sortTree(node) {
    const entries = Object.values(node);

    entries.forEach((entry) => {
      entry.children = sortTree(entry.children);
    });

    return entries.sort((a, b) => a.name.localeCompare(b.name));
  }

  eleventyConfig.addCollection("tagTree", function (collectionApi) {
    const tree = {};

    collectionApi.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => {
        if (typeof tag !== "string") return;
        if (tag === "all") return;

        const parts = tag.split("/");
        let current = tree;

        parts.forEach((part) => {
          if (!current[part]) {
            current[part] = {
              name: part,
              children: {},
            };
          }

          current = current[part].children;
        });
      });
    });

    return sortTree(tree);
  });

  return {
    markdownTemplateEngine: false,
    templateFormats: ["md", "html", "liquid", "11ty.js"],
    dir: {
      input: "./content", // default: "."
      includes: "../_includes", // default: "_includes" (`input` relative)
      data: "../_data", // default: "_data" (`input` relative)
      output: "_site",
    },

    pathPrefix: "/second-brain/",
  };
}
