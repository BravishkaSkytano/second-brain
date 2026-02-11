import {
  IdAttributePlugin,
  InputPathToUrlTransformPlugin,
  HtmlBasePlugin,
} from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import fontAwesomePlugin from "@11ty/font-awesome";

import pluginFilters from "./_config/filters.js";
const EXCLUDED_SECTIONS = new Set(["404", "index", "section"]);

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
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
    "./feed/pretty-atom-feed.xsl": "/",
    "./node_modules/terminal.css/dist/terminal.min.css":
      "dist/terminal.min.css",
  });

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

  // Watch CSS files
  eleventyConfig.addWatchTarget("_includes/css/*.css");
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
    preAttributes: { tabindex: 0 },
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
        order: 4,
      },
    },
    collection: {
      name: "posts",
      limit: 10,
    },
    metadata: {
      language: "en",
      title: "Blog Title",
      subtitle: "This is a longer description about your blog.",
      base: "https://example.com/",
      author: {
        name: "Your Name",
      },
    },
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
      },
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

  eleventyConfig.addPlugin(fontAwesomePlugin, {
    transform: false, // disable the Eleventy transform
    shortcode: "icon", // enable the {% icon %} shortcode ({% icon "fab:font-awesome" %})
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

  eleventyConfig.addGlobalData("eleventyComputed", {
    section: (data) => {
      if (!data.page?.filePathStem) return;
      return data.page.filePathStem.split("/")[1];
    },
    breadcrumbs: (data) => {
      if (!data.page?.filePathStem) return [];

      const parts = data.page.filePathStem
        .replace(/^\/+/, "")
        .split("/")
        .filter((part) => part !== "index");

      let url = "";
      return parts.map((part) => {
        url += `/${part}`;
        return {
          label: part.replace(/-/g, " "),
          url: url + "/",
        };
      });
    },
  });

  eleventyConfig.addCollection("content", (api) =>
    api
      .getFilteredByGlob("**/*.md")
      .filter((item) => !EXCLUDED_SECTIONS.has(item.data.section)),
  );

  eleventyConfig.addCollection("sections", (api) => {
    const items = api.getAll();

    const sections = new Set(
      items.map((item) => item.data.section).filter(Boolean),
    );

    return [...sections].map((section) => ({
      section,
      items: items
        .filter((item) => item.data.section === section)
        .filter((i) => !i.page.filePathStem.endsWith("/index"))
        .sort((a, b) => b.date - a.date),
    }));
  });

  eleventyConfig.addCollection("homepageSections", (api) => {
    const items = api
      .getAll()
      .filter((item) => !EXCLUDED_SECTIONS.has(item.data.section));

    const sections = new Set(items.map((i) => i.data.section));

    return [...sections].map((section) => {
      const sectionItems = items
        .filter((i) => i.data.section === section)
        .filter((i) => !i.page.filePathStem.endsWith("/index"))
        .sort((a, b) => b.date - a.date) // 👈 most recently modified
        .slice(0, 4); // 👈 limit to #

      return {
        section,
        items: sectionItems,
      };
    });
  });
}

export const config = {
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

  // pathPrefix: "/",
};
