# SEO implementation (October 2026)

Work done on the `redesign-v2` working copy, following the Parul Soni Manvati SEO Implementation Brief. No framework change, no redesign, no change to any photograph.

## 1. Audit: what was there before

**Working already**
- Eleventy 2.0.1 + Nunjucks, Decap CMS (git-gateway, `main` branch), Netlify (`npm run build` → `_site`).
- `<html lang="en">`, one `<title>` and one `<h1>` on every page, page-specific titles/descriptions on most pages.
- All primary content (speaking topics, articles, experience stories) is server-rendered HTML, not injected by JavaScript.
- Photos already use `<picture>`, WebP `srcset`, width/height, lazy loading, and an eager/high-priority hero.
- `/admin/` sends `X-Robots-Tag: noindex`; `/impact` 301-redirects to `/about/`; drafts with placeholder text never get a URL.

**Wrong or missing**
- **No canonical domain anywhere.** `site.baseUrl` was never set, so canonical, `og:url` and every sitemap URL were relative (e.g. `<link rel="canonical" href="/about/">`). Search engines treat relative sitemap URLs as invalid.
- **Broken default share image.** `og:image` pointed to `/assets/images/og-default.jpg`, which does not exist, so every share preview had no image.
- `robots.txt` referenced a relative sitemap (`Sitemap: /sitemap.xml`), which is invalid.
- Sitemap included `/contact/thank-you/` and had no domain.
- No structured data (no Person, WebSite or Article schema).
- No `og:site_name`, `twitter:title/description/image`, or article dates in the head.
- No 404 page (Netlify's generic one was served).
- Netlify deploy previews and branch deploys were indexable copies of the site.
- Main-page SEO (Home, Experience, Advisory, Speaking, Thinking, Contact) was hardcoded in templates and not editable in the CMS.
- Home page used the generic site description; About's description started with "Parul is…" without the full name.

## 2. Files changed

| File | Change |
|---|---|
| `src/_utils/seo.js` (new) | Resolves the canonical base URL (Site Settings `baseUrl` → Netlify's primary domain `URL` → `localhost` for local builds), absolute URLs, validated canonical overrides, safe JSON-LD serialisation. Detects Netlify previews (`CONTEXT`). |
| `src/_utils/structured-data.js` (new) | Builds JSON-LD from Site Settings and page data only: WebSite + Person (home), ProfilePage + Person (About), BlogPosting + BreadcrumbList (articles), BreadcrumbList (experience stories). |
| `src/_data/seoEnv.js` (new) | Exposes base URL and preview flag to templates. |
| `src/_data/pageSeo.json` (new) | Titles, descriptions, share image and noindex for the six main pages. Editable in CMS → Page SEO. |
| `src/_includes/partials/seo-head.njk` (new) | The single SEO head: title, description, canonical, robots (only when needed), Open Graph, Twitter, article dates, JSON-LD. |
| `src/_includes/layouts/base.njk` | Replaced inline meta tags with the shared partial. |
| `src/robots.njk` (new), `src/robots.txt` (removed) | Absolute sitemap URL; previews and branch deploys get `Disallow: /`. |
| `src/sitemap.njk` | Absolute URLs, only indexable pages, excludes noindex/thank-you/404/canonical-override pages; `lastmod` only for articles (publication date, or "Last Meaningful Update" when set). |
| `src/404.njk` (new) | Simple noindex 404 using existing page-header styles; Netlify serves it with a real 404 status. |
| `.eleventy.js` | Registers SEO filters; robots.txt now generated instead of copied. |
| `src/_data/site.json` | Added `alternateName`, `baseUrl` (empty), `personImage`, `personDescription`, `sameAs`, `knowsAbout`, `ogImageAlt`; fixed default share image to an existing original photo (Gulfood Food Pulse). |
| `src/admin/config.yml` | New CMS fields: Page SEO collection; Site Settings search-profile fields; Thinking: canonical override, noindex, last meaningful update; Experience: canonical override, noindex; About: eyebrow, share image; Homepage second paragraph; Advisory intro; Speaking topics intro. |
| `src/index.njk`, `experience.njk`, `advisory.njk`, `speaking.njk`, `thinking.njk`, `contact.njk` | SEO now read from Page SEO (`seoKey`). |
| `src/about.md` | New title/description; eyebrow "About Parul Soni Manvati" above the existing heading; Education field filled with NITIE, Mumbai so the Person schema's `alumniOf` matches visible content (degree name still to confirm). |
| `src/contact/thank-you.njk` | `noindex`. |
| `src/experience/experience.11tydata.js` | Stories share their own original photo; photos marked `"shareable": false` are skipped. |
| `src/_data/photos.json` | `exec-desk` marked `"shareable": false` (the photo with the Gemini mark), so it is never used as a share image. |
| `src/index.njk` + `src/_data/homepage.json` + `src/css/style.css` | Optional second hero paragraph (CMS field; empty hides it) and its style. |
| `src/advisory.njk` + `src/_data/advisory.json` | Short intro under "I am usually most useful when…". |
| `src/speaking.njk` + `src/_data/speakingPage.json` | Short speaker note under "What I speak about". |
| `src/_includes/layouts/about.njk` | Renders the optional eyebrow. |
| `src/_includes/layouts/article.njk`, `story.njk` | CMS-uploaded hero images get `decoding="async"`/`loading="eager"`. |

## 3. Rendered metadata (example build using `https://parulsonimanvati.com`; the live site uses whatever Netlify primary domain is set)

| URL | Title | Schema |
|---|---|---|
| `/` | Parul Soni Manvati \| Transformation Leader & Strategic Operator | WebSite, Person |
| `/about/` | About Parul Soni Manvati \| Leadership & Career | ProfilePage, Person |
| `/experience/` | Business Transformation Experience \| Parul Soni Manvati | – |
| `/advisory/` | Strategy & Transformation Advisory \| Parul Soni Manvati | – |
| `/speaking/` | Parul Soni Manvati \| Business & Future of Food Speaker | – |
| `/thinking/` | Articles on AI, Transformation & Future of Food \| Parul Soni | – |
| `/contact/` | Contact Parul Soni Manvati \| Leadership, Advisory & Speaking | – |
| 5 articles | Existing per-article SEO titles (unchanged) | BlogPosting, BreadcrumbList |
| 16 experience stories | Story title \| Parul Soni Manvati (unchanged) | BreadcrumbList |
| `/contact/thank-you/`, `/404.html` | unchanged / new | noindex, not in sitemap |

Canonical on every page = `https://parulsonimanvati.com` + its own path. Descriptions are listed in `src/_data/pageSeo.json`, `src/about.md` and each article/story.

## 4. Validation run

- `npm run build`: 32 files written, no errors or warnings.
- Automated check of all 30 HTML pages: exactly one title, one description, one canonical (self-referencing, absolute), one H1, all OG/Twitter tags, absolute `og:image`, no `meta keywords`, no duplicate titles or descriptions among indexable pages, all JSON-LD parses.
- Sitemap: 28 URLs, every one resolves to a built page and none is noindex; every indexable page is listed.
- No broken internal page links.
- Preview build (`CONTEXT=deploy-preview`): every page gets `noindex`, robots.txt disallows all, no JSON-LD.
- Before/after screenshots (desktop 1440px and mobile 390px) of Home, About, Advisory, Speaking: only the three new copy lines and the About eyebrow differ.

**Not tested from here:** the live domain and its redirects (not reachable from this environment), Schema.org Validator and Rich Results Test (need the deployed URL), Lighthouse/Core Web Vitals with real images, the CMS editor UI itself, and the contact form submission. Valid Person schema does not guarantee any Google rich result.

## 5. Go-live and Search Console checklist (needs you)

**Domain decision (11 Oct 2026):** the planned main domain is `https://www.parulsonimanvati.com`; it has not been bought yet. Until it is, the site runs on its Netlify subdomain (`….netlify.app`) and every canonical, sitemap and share URL automatically uses that subdomain, so nothing breaks. Leave CMS → Site Settings → Canonical Site Address empty.

1. Buy `parulsonimanvati.com` (buying the domain covers both the www and non-www versions).
2. In Netlify → Domain management → Add a domain, add `www.parulsonimanvati.com` and set it as the primary domain. Netlify also adds `parulsonimanvati.com` and 301-redirects it to www with no loop, and the `.netlify.app` address should then forward to it as well. Trigger a new deploy so the site picks up the new primary domain. Test both addresses afterwards.
3. Commit everything on `redesign-v2` (including the new photo files under `src/assets/images/photos` and `visuals`, which are not on GitHub yet), push, and check the Netlify branch preview. The preview will correctly show `noindex`.
4. After merging to `main` and deploying: open `/robots.txt` and `/sitemap.xml` on the live site and check they show the full domain.
5. Search Console: add a **Domain property** for `parulsonimanvati.com`, copy the TXT record Google gives you, add it in your DNS provider (Netlify DNS: Domains → DNS records → Add TXT), then click Verify (can take up to a day).
6. Search Console → Sitemaps → submit `https://www.parulsonimanvati.com/sitemap.xml`.
7. URL Inspection → test and request indexing for `/`, `/about/`, `/speaking/`, `/advisory/`, `/experience/`, `/thinking/`.
8. Paste `/` and `/about/` into https://validator.schema.org and https://search.google.com/test/rich-results.
9. Update LinkedIn and speaker bios to use the same full name, tagline and link to the site.

## 6. 90-day measurement plan

- **Day 0:** note baseline impressions/clicks for `Parul Soni Manvati`, `Parul Soni`, name + speaker/advisory/leadership. Track `Parul` separately as an aspirational term.
- **Day 30:** indexed pages (Pages report), any canonical or "Discovered – not indexed" issues, brand-query CTR and position.
- **Day 60:** non-brand clusters (leadership, advisory, speaking, AI/operations, supply chain, alternative proteins); which pages earn impressions.
- **Day 90:** clicks, CTR, average position, indexed pages, qualified contact-form submissions; adjust titles of pages with impressions but low CTR.
- These are checkpoints, not ranking promises.
- Form conversion tracking only if you approve analytics; never put form data in analytics URLs.

**Article backlog:** ERP transformations and broken operating models (already live; consider linking from Advisory), AI and supply chain productivity, what Indian startups overlook when scaling operations, cultivated meat in India (infrastructure, regulation, commercialisation), then fractional CXO vs full-time executive (only if offered), women in supply chain leadership, alternative protein biomanufacturing in India, Chief of Staff as the CEO's transformation partner.
