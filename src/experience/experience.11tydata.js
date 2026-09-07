const { fieldsContainPlaceholder, EXPERIENCE_PLACEHOLDER_FIELDS } = require("../_utils/placeholder");

module.exports = {
  eleventyComputed: {
    // A story only ever gets a live URL when it's marked published AND
    // contains no leftover "[CONTENT NEEDED]" / "[Example only]" sentinel —
    // this is the safety net if published is ever flipped on too early.
    permalink: (data) => (data.published && !fieldsContainPlaceholder(data, EXPERIENCE_PLACEHOLDER_FIELDS) ? undefined : false),
    seoTitle: (data) => data.seo_title || `${data.title} | Parul Soni Manvati`,
    seoDescription: (data) => data.seo_description || data.summary || undefined,
    ogImage: (data) => data.og_image || data.featured_image || undefined,
  },
};
