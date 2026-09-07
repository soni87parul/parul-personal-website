const { fieldsContainPlaceholder, ARTICLE_PLACEHOLDER_FIELDS } = require("../_utils/placeholder");

module.exports = {
  eleventyComputed: {
    // An article only ever gets a live URL when it's published AND contains
    // no leftover "[CONTENT NEEDED]" / "[Example only]" sentinel — otherwise
    // its direct URL would still be publicly reachable even though it's
    // hidden from the Thinking listing pages.
    permalink: (data) => (data.published && !fieldsContainPlaceholder(data, ARTICLE_PLACEHOLDER_FIELDS) ? undefined : false),
  },
};
