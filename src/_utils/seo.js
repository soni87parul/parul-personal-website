// Shared SEO helpers: canonical base URL, absolute URLs, safe JSON-LD output.
// The canonical domain is never hardcoded here. It comes from Site Settings
// (site.json "baseUrl") or, on Netlify, from the site's configured primary
// domain (the URL environment variable Netlify sets at build time).

const site = require("../_data/site.json");

const LOCAL_FALLBACK = "http://localhost:8080";

function stripTrailingSlash(url) {
  return String(url || "").trim().replace(/\/+$/, "");
}

function resolveBaseUrl() {
  const configured = stripTrailingSlash(site.baseUrl);
  if (configured) return configured;
  const netlifyPrimary = stripTrailingSlash(process.env.URL);
  if (netlifyPrimary) return netlifyPrimary;
  return LOCAL_FALLBACK;
}

const baseUrl = resolveBaseUrl();

// Netlify sets CONTEXT to "production", "deploy-preview" or "branch-deploy".
// Previews and branch deploys must never be indexed alongside the live site.
const context = process.env.CONTEXT || "";
const isPreview = Boolean(context) && context !== "production";

if (baseUrl === LOCAL_FALLBACK && context === "production") {
  console.warn("[seo] No canonical base URL found for a production build. Set baseUrl in Site Settings.");
}

function absoluteUrl(path) {
  if (!path) return "";
  const value = String(path).trim();
  if (/^https?:\/\//i.test(value)) return value;
  return baseUrl + (value.startsWith("/") ? value : "/" + value);
}

// A canonical override is only honoured when it is an absolute URL on the
// site's own canonical domain; anything else is ignored with a build warning.
function validCanonicalOverride(override, inputPath) {
  if (!override) return "";
  const value = String(override).trim();
  if (value.startsWith(baseUrl + "/")) return value;
  console.warn(`[seo] Ignoring canonicalOverride "${value}" in ${inputPath || "a page"}: it must start with ${baseUrl}/`);
  return "";
}

// JSON.stringify alone is not safe inside <script>: escape characters that
// could close the tag or break parsing.
function jsonLd(data) {
  return JSON.stringify(data, null, 2)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

module.exports = { baseUrl, context, isPreview, absoluteUrl, validCanonicalOverride, jsonLd };
