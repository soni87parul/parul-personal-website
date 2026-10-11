// Builds the JSON-LD graph for a page from verified site data only.
// Nothing here invents facts: every value comes from Site Settings or the
// page's own front matter, and empty values are left out.

const site = require("../_data/site.json");
const { baseUrl, absoluteUrl } = require("./seo");

const PERSON_ID = `${baseUrl}/#person`;
const WEBSITE_ID = `${baseUrl}/#website`;

function compact(obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value) && !value.length) continue;
    out[key] = value;
  }
  return out;
}

function isoDate(value) {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

function person() {
  return compact({
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.name,
    alternateName: site.alternateName,
    url: `${baseUrl}/`,
    image: site.personImage ? absoluteUrl(site.personImage) : undefined,
    description: site.personDescription,
    sameAs: (site.sameAs || []).filter((u) => /^https:\/\//.test(u)),
    knowsAbout: site.knowsAbout,
  });
}

function website() {
  return compact({
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: `${baseUrl}/`,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
    about: { "@id": PERSON_ID },
  });
}

function breadcrumbs(trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.url),
    })),
  };
}

// p: { kind, url, canonical, headline, description, image, datePublished, dateModified }
function buildStructuredData(p) {
  const graph = [];
  switch (p.kind) {
    case "home":
      graph.push(website(), person());
      break;
    case "about":
      graph.push(
        compact({
          "@type": "ProfilePage",
          "@id": `${p.canonical}#webpage`,
          url: p.canonical,
          name: p.pageName || p.headline,
          isPartOf: { "@id": WEBSITE_ID },
          mainEntity: { "@id": PERSON_ID },
        }),
        person()
      );
      break;
    case "article":
      graph.push(
        compact({
          "@type": "BlogPosting",
          "@id": `${p.canonical}#article`,
          headline: p.headline,
          description: p.description,
          url: p.canonical,
          mainEntityOfPage: p.canonical,
          image: p.image,
          datePublished: isoDate(p.datePublished),
          dateModified: isoDate(p.dateModified) || isoDate(p.datePublished),
          inLanguage: "en",
          author: { "@type": "Person", "@id": PERSON_ID, name: site.name, url: `${baseUrl}/` },
          publisher: { "@id": PERSON_ID },
          isPartOf: { "@id": WEBSITE_ID },
        }),
        breadcrumbs([
          { name: "Home", url: "/" },
          { name: "Thinking", url: "/thinking/" },
          { name: p.headline, url: p.url },
        ])
      );
      break;
    case "story":
      graph.push(
        breadcrumbs([
          { name: "Home", url: "/" },
          { name: "Experience", url: "/experience/" },
          { name: p.headline, url: p.url },
        ])
      );
      break;
    default:
      return "";
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

module.exports = { buildStructuredData, PERSON_ID };
