export default {
	tags: [
		"posts"
	],
	"layout": "layouts/post.njk",
	
  eleventyComputed: {
    backlinks: (data) => backlinks(data),
  },
};
