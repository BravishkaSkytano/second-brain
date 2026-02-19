export default {
  eleventyNavigation: (data) => {
    if (!data.title) return;

    return {
      key: data.key || data.title,
      parent: data.parent,
    };
  },
  layout: "page",
};
