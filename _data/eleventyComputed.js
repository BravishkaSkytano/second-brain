function cleanWikiLink(link) {
  if (!link) return;

  // Remove surrounding [[ ]]
  let cleaned = link.replace(/^\[\[/, "").replace(/\]\]$/, "");

  // Remove alias if present [[Page|Alias]]
  cleaned = cleaned.split("|")[0];

  return cleaned.trim();
}

export default {
  eleventyNavigation: (data) => {
    if (!data.title) return;

    const nav = {
      key: data.title
    };

    if (data.parent) {
      nav.parent = cleanWikiLink(data.parent);
    }

    return nav;
  }
  layout: "page",
};
