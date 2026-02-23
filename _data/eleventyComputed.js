export default {
  permalink: (data) => {
    const slug = data.page.fileSlug;

    // Only apply dot logic if file has dots
    if (!slug.includes(".")) {
      return "/" + slug + "/";
    }

    const parts = slug.split(".");
    return "/" + parts.join("/") + "/";
  },

  eleventyNavigation: (data) => {
    const slug = data.page.fileSlug;
    const parts = slug.split(".");

    return {
      key: slug,
      parent: parts.length > 1 ? parts.slice(0, -1).join(".") : null,
      title: data.title || parts[parts.length - 1],
    };
  },
  layout: "page",
};
