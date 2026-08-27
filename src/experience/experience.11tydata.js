module.exports = {
  eleventyComputed: {
    permalink: (data) => (data.published ? undefined : false),
    seoTitle: (data) => data.seo_title || `${data.title} | Parul Soni Manvati`,
    seoDescription: (data) => data.seo_description || data.summary || undefined,
    ogImage: (data) => data.og_image || data.featured_image || undefined,
  },
};
