const { fieldsContainPlaceholder, EXPERIENCE_PLACEHOLDER_FIELDS } = require("../_utils/placeholder");
const photos = require("../_data/photos.json");

// The story's own original photograph (conventionally resized JPEG), used as its social share image.
// Photos marked "shareable": false in photos.json are never used for sharing.
function storyPhotoPath(data) {
  const p = data.photo && photos[data.photo];
  return p && p.shareable !== false ? `/assets/images/photos/${p.file}-${p.fallback}.jpg` : undefined;
}

module.exports = {
  eleventyComputed: {
    // A story only ever gets a live URL when it's marked published AND
    // contains no leftover "[CONTENT NEEDED]" / "[Example only]" sentinel —
    // this is the safety net if published is ever flipped on too early.
    permalink: (data) => (data.published && !fieldsContainPlaceholder(data, EXPERIENCE_PLACEHOLDER_FIELDS) ? undefined : false),
    seoTitle: (data) => data.seo_title || `${data.title} | Parul Soni Manvati`,
    seoDescription: (data) => data.seo_description || data.summary || undefined,
    ogImage: (data) => data.og_image || data.featured_image || storyPhotoPath(data),
    socialImageAlt: (data) => (storyPhotoPath(data) ? photos[data.photo].alt : undefined),
  },
};
