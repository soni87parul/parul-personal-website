// Shared production-safety check: internal editorial sentinels (e.g. the
// "[CONTENT NEEDED ...]" / "[Example only ...]" placeholders left in seed
// content) must never reach a visitor, even if an item is accidentally
// marked published/enabled before the real copy is written in.
const PLACEHOLDER_PATTERN = /\[CONTENT NEEDED|\[Example only/i;

function containsPlaceholder(value) {
  if (typeof value === "string") return PLACEHOLDER_PATTERN.test(value);
  if (Array.isArray(value)) return value.some(containsPlaceholder);
  if (value && typeof value === "object") return Object.values(value).some(containsPlaceholder);
  return false;
}

// Scoped check for Eleventy page data: inspects only the given field names
// rather than the full (globally-merged) data cascade. This matters because
// Eleventy's page/collection `data` includes every global _data file merged
// in, not just that page's own frontmatter — scanning it wholesale would let
// an unrelated placeholder anywhere on the site (e.g. in impactProjects.json)
// wrongly suppress every other page.
function fieldsContainPlaceholder(data, fields) {
  return fields.some((field) => containsPlaceholder(data[field]));
}

// Shared field allowlists, kept in one place so the Eleventy collection
// filters (.eleventy.js) and each content type's computed permalink
// (*.11tydata.js) can never drift apart.
const EXPERIENCE_PLACEHOLDER_FIELDS = ["title", "organisation", "theme", "summary", "card_summary", "status_label", "problem", "why_it_mattered", "figure_out", "design", "build", "scale", "transform", "takeaway", "public_categories", "impact"];
const ARTICLE_PLACEHOLDER_FIELDS = ["title", "subtitle", "excerpt", "takeaway"];
const RECOMMENDATION_PLACEHOLDER_FIELDS = ["quote", "short_excerpt", "name", "role", "relationship_context"];

module.exports = {
  containsPlaceholder,
  fieldsContainPlaceholder,
  EXPERIENCE_PLACEHOLDER_FIELDS,
  ARTICLE_PLACEHOLDER_FIELDS,
  RECOMMENDATION_PLACEHOLDER_FIELDS,
};
