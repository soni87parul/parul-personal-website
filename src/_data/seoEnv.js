// Build-time SEO environment (canonical base URL, preview detection).
// See src/_utils/seo.js for how the base URL is resolved.
const { baseUrl, context, isPreview } = require("../_utils/seo");

module.exports = { baseUrl, context, isPreview };
