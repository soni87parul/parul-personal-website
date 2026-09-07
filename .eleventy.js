const { DateTime } = require("luxon");
const THINKING_TERRITORIES = require("./src/_data/thinkingTerritories.json");
const {
  containsPlaceholder,
  fieldsContainPlaceholder,
  EXPERIENCE_PLACEHOLDER_FIELDS,
  ARTICLE_PLACEHOLDER_FIELDS,
  RECOMMENDATION_PLACEHOLDER_FIELDS,
} = require("./src/_utils/placeholder");

const CAPABILITY_GROUP_ORDER = [
  "Strategy & Leadership",
  "Build & Scale",
  "Technology",
  "Operations",
  "Capital & Commercial",
  "Policy & Ecosystems",
];

// Broad, visitor-facing filters. Each maps to several granular capability
// slugs from the full CMS taxonomy (kept intact for classification/detail).
const BROAD_FILTERS = [
  {
    slug: "transformation",
    label: "Transformation",
    capabilities: ["transformation-strategy", "digital-transformation", "organisation-design", "operating-model-design", "business-excellence"],
  },
  {
    slug: "0-1-building",
    label: "0→1 & Building",
    capabilities: ["0-to-1-building", "new-department-setup", "product-transformation", "ecosystem-building", "operating-model-design"],
  },
  {
    slug: "ai-technology",
    label: "AI & Technology",
    capabilities: ["ai-ml-literacy", "digital-transformation", "technology-adoption", "automation", "product-transformation"],
  },
  {
    slug: "operations",
    label: "Operations",
    capabilities: ["operations-excellence", "supply-chain", "customer-experience", "process-re-engineering", "marketplace-operations"],
  },
  {
    slug: "business-scaling",
    label: "Business Scaling",
    capabilities: ["business-scaling", "program-management", "business-excellence", "gtm", "commercialisation"],
  },
  {
    slug: "capital",
    label: "Capital",
    capabilities: ["fundraising", "investor-relations", "budgeting", "business-model", "commercialisation"],
  },
  {
    slug: "policy-ecosystems",
    label: "Policy & Ecosystems",
    capabilities: ["government-liaison", "public-policy", "public-private-systems", "ecosystem-building", "msme", "women-in-business"],
  },
  {
    slug: "chief-of-staff-strategy",
    label: "Chief of Staff & Strategy",
    // Public cards sometimes say just "Chief of Staff" or "Strategy" -- these
    // count as this filter too, so what's displayed still matches what it's filed under.
    aliases: ["chief of staff", "strategy", "ceo office"],
    capabilities: ["chief-of-staff", "ceo-office", "strategic-planning", "organisation-design", "operating-model-design", "governance", "transformation-strategy"],
  },
];

// Resolve which broad filters a story belongs to. Curated public_categories
// (matched against the known broad-filter labels/aliases) take priority,
// since those are what's actually displayed on the card -- what you see is
// what it's filed under. Falls back to the granular-capability mapping only
// for stories that haven't had public_categories curated yet.
function storyBroadFilterSlugs(storyData) {
  const categories = storyData.public_categories;
  if (Array.isArray(categories) && categories.length) {
    const normalized = categories.map((c) => String(c).toLowerCase().trim());
    return BROAD_FILTERS.filter((bf) => {
      const labels = [bf.label.toLowerCase(), ...(bf.aliases || [])];
      return labels.some((l) => normalized.includes(l));
    }).map((bf) => bf.slug);
  }
  const capSlugs = storyData.capabilities;
  if (!Array.isArray(capSlugs)) return [];
  return BROAD_FILTERS.filter((bf) => bf.capabilities.some((c) => capSlugs.includes(c))).map((bf) => bf.slug);
}

module.exports = function (eleventyConfig) {
  // Static passthroughs
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  eleventyConfig.addWatchTarget("src/css");
  eleventyConfig.addWatchTarget("src/js");

  // Collections
  eleventyConfig.addCollection("experienceStories", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/experience/*.md")
      .filter((item) => item.data.published && !fieldsContainPlaceholder(item.data, EXPERIENCE_PLACEHOLDER_FIELDS))
      .sort((a, b) => (a.data.display_order ?? 999) - (b.data.display_order ?? 999));
  });

  eleventyConfig.addCollection("articles", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/thinking/*.md")
      .filter((item) => !item.data.draft && !fieldsContainPlaceholder(item.data, ARTICLE_PLACEHOLDER_FIELDS))
      .sort((a, b) => b.date - a.date);
  });

  // Only territories with at least one published article are ever shown as a filter option.
  eleventyConfig.addCollection("activeThinkingTerritories", (collectionApi) => {
    const published = collectionApi.getFilteredByGlob("src/thinking/*.md").filter((item) => !item.data.draft);
    const activeTitles = new Set(published.map((item) => item.data.territory).filter(Boolean));
    return THINKING_TERRITORIES.filter((t) => activeTitles.has(t.title));
  });

  eleventyConfig.addCollection("capabilityList", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/capabilities/*.md")
      .filter((item) => item.data.active)
      .sort((a, b) => {
        const groupDiff = CAPABILITY_GROUP_ORDER.indexOf(a.data.group) - CAPABILITY_GROUP_ORDER.indexOf(b.data.group);
        if (groupDiff !== 0) return groupDiff;
        return (a.data.display_order ?? 999) - (b.data.display_order ?? 999);
      });
  });

  eleventyConfig.addCollection("capabilityGroups", (collectionApi) => {
    const items = collectionApi
      .getFilteredByGlob("src/capabilities/*.md")
      .filter((item) => item.data.active);
    return CAPABILITY_GROUP_ORDER.map((groupName) => ({
      name: groupName,
      items: items
        .filter((item) => item.data.group === groupName)
        .sort((a, b) => (a.data.display_order ?? 999) - (b.data.display_order ?? 999)),
    })).filter((group) => group.items.length);
  });

  eleventyConfig.addCollection("recommendations", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/recommendations/*.md")
      .filter((item) => item.data.published && !fieldsContainPlaceholder(item.data, RECOMMENDATION_PLACEHOLDER_FIELDS))
      .sort((a, b) => (a.data.display_order ?? 999) - (b.data.display_order ?? 999));
  });

  // Only broad filters with at least one published, matching story are ever shown publicly.
  eleventyConfig.addCollection("activeBroadFilters", (collectionApi) => {
    const stories = collectionApi.getFilteredByGlob("src/experience/*.md").filter((item) => item.data.published);
    const activeSlugs = new Set(stories.flatMap((s) => storyBroadFilterSlugs(s.data)));
    return BROAD_FILTERS.filter((bf) => activeSlugs.has(bf.slug));
  });

  // Filters
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(new Date(dateObj), { zone: "utc" }).toFormat("d LLLL yyyy");
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(new Date(dateObj), { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("readingTime", (content) => {
    if (!content) return "1 min read";
    const words = content.toString().trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  });

  eleventyConfig.addFilter("limit", (arr, limit) => {
    if (!Array.isArray(arr)) return arr;
    return arr.slice(0, limit);
  });

  eleventyConfig.addFilter("sliceArr", (arr, start, end) => {
    if (!Array.isArray(arr)) return arr;
    return arr.slice(start, end);
  });

  eleventyConfig.addFilter("featured", (arr, limit) => {
    if (!Array.isArray(arr)) return arr;
    const items = arr.filter((item) => item.data && item.data.featured);
    return limit ? items.slice(0, limit) : items;
  });

  eleventyConfig.addFilter("notFeatured", (arr) => {
    if (!Array.isArray(arr)) return arr;
    return arr.filter((item) => item.data && !item.data.featured);
  });

  eleventyConfig.addFilter("capabilityNames", (slugs, capabilityList) => {
    if (!Array.isArray(slugs) || !Array.isArray(capabilityList)) return [];
    return slugs
      .map((slug) => capabilityList.find((c) => c.data.slug === slug))
      .filter(Boolean)
      .map((c) => c.data);
  });

  eleventyConfig.addFilter("nextStory", (allStories, currentUrl) => {
    if (!Array.isArray(allStories) || allStories.length < 2) return null;
    const index = allStories.findIndex((s) => s.url === currentUrl);
    if (index === -1) return null;
    return allStories[(index + 1) % allStories.length];
  });

  eleventyConfig.addFilter("recommendationsByRefs", (refs, allRecs) => {
    if (!Array.isArray(refs) || !Array.isArray(allRecs)) return [];
    return refs
      .map((slug) => allRecs.find((r) => r.data.slug === slug))
      .filter(Boolean);
  });

  eleventyConfig.addFilter("broadFilterSlugs", (capSlugs) => {
    if (!Array.isArray(capSlugs)) return [];
    return BROAD_FILTERS.filter((bf) => bf.capabilities.some((c) => capSlugs.includes(c))).map((bf) => bf.slug);
  });

  eleventyConfig.addFilter("storyBroadFilterSlugs", (storyData) => storyBroadFilterSlugs(storyData || {}));

  // Never render a metric that still needs verification/sourcing.
  eleventyConfig.addFilter("publicImpact", (impact) => {
    if (!Array.isArray(impact)) return [];
    return impact.filter((item) => !item.verification_required);
  });

  // Production-safety net for CMS list content (Impact, Speaking, Advisory):
  // strips any item that still contains an internal placeholder sentinel,
  // regardless of its published/enabled flag.
  eleventyConfig.addFilter("publiclySafe", (items) => {
    if (!Array.isArray(items)) return items;
    return items.filter((item) => !containsPlaceholder(item));
  });

  eleventyConfig.addFilter("territoryData", (title) => THINKING_TERRITORIES.find((t) => t.title === title) || null);

  eleventyConfig.addFilter("experienceByRef", (slug, allStories) => {
    if (!slug || !Array.isArray(allStories)) return null;
    return allStories.find((s) => s.fileSlug === slug) || null;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
