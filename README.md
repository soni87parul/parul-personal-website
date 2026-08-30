# Parul Soni Manvati — Personal Website (V1)

A premium, editorial personal brand website. Built as a static site (Eleventy) with a
self-serve content admin (Decap CMS) so content can be added and edited without touching code.

---

## What was built

**V1 (Day 1):**
- **Homepage** — hero, credibility strip, signature statement, five-stage method
  (Figure Out → Design → Build → Scale → Transform) as a connected visual journey, featured
  experience, about teaser, thinking teaser, advisory/speaking/impact teasers, final CTA, footer.
  Sections use a three-tier visual hierarchy (dominant / secondary / supporting).
- **Pages** — `/about`, `/experience`, `/experience/[slug]`, `/thinking`, `/thinking/[slug]`,
  `/advisory`, `/speaking`, `/impact`, `/contact`.
- **Blog ("Thinking") system** — Markdown articles with category, tags, excerpt, reading time,
  SEO fields, draft/published state. Seeded with 2 example drafts.
- **SEO foundations** — per-page title/description, canonical URLs, Open Graph tags,
  `sitemap.xml`, `robots.txt`, semantic headings.
- **Responsive, accessible design** — mobile nav, focus states, skip-to-content link, reduced-motion support.
- **Contact form** — via Netlify Forms (no backend/database needed).

**Day 2 — Experience architecture (capability-led, with real content):**
- **Experience system organised around consequential problems, not job titles.** Each story
  supports: Problem → Why It Mattered → Figure Out/Design/Build/Scale/Transform (only the
  stages that actually apply and have content) → Impact → My Takeaway. Story cards on the
  homepage, `/experience/`, and individual story pages all render from the exact same
  underlying data (no duplicated copy).
- **Five flagship stories, published with full narrative content**: Addverb (Enterprise
  Transformation / CEO Office), Amazon (AI/ML Transformation), ClearMeat (Business Model
  pivot), Snapdeal (Same-Day/Next-Day Capability), ClearMeat/India (Regulatory Ecosystem,
  marked "Ongoing"). Ordered via `display_order`, shown as an editorial asymmetric grid
  (one large lead card + supporting cards, not five identical boxes) under **Featured
  Transformations** on `/experience/`, and as 3 dominant + 2 secondary-link cards under
  **Selected Experience** on the homepage.
- **11 supporting stories** ("More problems I've worked on") — compact cards for
  smaller/ongoing engagements across Snapdeal, Amazon, Addverb, ClearMeat and ABWCI/UNCTAD.
  Shows the first 6 by `display_order`, with a **"View more problems I've worked on ↓" /
  "Show fewer ↑"** progressive-disclosure control (native `<details>/<summary>` — works with
  JavaScript disabled, no framework dependency) revealing the rest inline, no page reload.
- **Two-tier capability system.** Full granular taxonomy (34 capabilities across 6 groups)
  stays in the CMS for classification and future reuse. Publicly, `/experience/` shows a
  compact set of **broad filters** (Transformation, 0→1 & Building, AI & Technology,
  Operations, Business Scaling, Capital, Policy & Ecosystems, Chief of Staff & Strategy) —
  a filter only appears if at least one published story actually matches it, and an
  unrecognised/stale `?capability=` value gracefully falls back to "All" rather than showing
  a blank page. Cards show at most 3 curated `public_categories` labels (falls back to the
  first 3 granular capability names if none are curated) so tags never dominate the card.
- **Verified-metric gating, enforced at the template level (not CSS).** Every impact metric
  carries a `verification_required` flag; anything still pending confirmation is filtered out
  of the rendered data before the page is built, so it never reaches the public HTML at all —
  confirmed by grepping the built `_site/` output, not just visually. Currently live: Addverb
  (₹90 Cr savings *opportunity*, worded conservatively — not "saved" or "realised"), Amazon
  (130+ FTE equivalent capacity), ClearMeat (\$150K ARR), Snapdeal (₹2.5 Cr recovered). Kept
  hidden pending verification: ClearMeat vendor-ops (80%/50%), ClearMeat sales (58%), the
  ABWCI $300B TAM figure.
- **Recommendations system** — "What people I've worked with say," 8 real recommendations
  with verbatim original quotes (never rewritten; a separate optional excerpt field exists for
  shorter display copy). Shows the first 4 (Sanjay Agarwal, Sandeep Juneja, Parag Raheja,
  Krishna Kalluru) with a **"Read more from people I've worked with ↓" / "Show fewer ↑"**
  disclosure revealing the remaining 4. Relevant recommendations also surface directly on a
  matching story's detail page. No ratings, badges, or "Trusted by" language anywhere.
- **LinkedIn follow CTA** — reusable component at the end of the Experience page and every
  story page; stays hidden until a real LinkedIn URL is set in Settings.
- **Strict empty-state handling** — unpublished stories/recommendations never generate a live
  page at all (not just hidden from listings — the URL itself doesn't exist until published),
  and empty sections/headings are omitted from the page rather than showing placeholder text.
  No story can be publicly linked without its detail page actually resolving to real content.
- **Admin panel** at `/admin` (Decap CMS) — Homepage, About, Experience, Capabilities,
  Thinking, Recommendations, Advisory, Speaking, Impact, Navigation, Settings, and Media
  (image uploads), each with an editorial Draft → Review → Publish workflow.

## What remains

- A hero photograph, professional portrait, and any story-specific images.
- Public contact email and LinkedIn URL (`Admin → Settings`) — several CTAs (LinkedIn follow,
  homepage "Connect on LinkedIn") stay hidden until these are filled in.
- First published Thinking articles (currently 2 unpublished drafts, for structure reference).
- About page narrative (How I Got Here / Thread Through My Career / Beyond Work) — sections
  stay hidden until real content is written; nothing placeholder-y is shown publicly.
- Custom domain connection.
- Not built yet (by design — explicitly deferred to Days 3–4): the paid exploratory-call flow
  (intake questionnaire → ₹500 payment → calendar booking), newsletter, media page, analytics
  dashboard, CRM functionality.
- Once you're on Netlify: enabling **Identity** + **Git Gateway** (steps below) — this is what
  makes the `/admin` login work, and can't be done from code.

---

## Technology

- **[Eleventy (11ty)](https://www.11ty.dev/)** — static site generator. Plain HTML output, no
  client-side framework, fast and simple to host.
- **[Decap CMS](https://decapcms.org/)** (formerly Netlify CMS) — free, open-source, git-based
  admin panel at `/admin`. No database — content is stored as Markdown/JSON files in this repo.
- **Plain CSS** with design tokens (CSS variables) — no CSS framework, so there's one less
  dependency to maintain.
- **Netlify** — free hosting tier, auto-deploys on every git push, provides the Identity
  service that powers admin login.
- **No database, no server, no environment variables required.**

### Why this instead of a database-backed CMS?

The original brief suggested Next.js + Supabase. This project uses a static-site + git-CMS
approach instead, because it was explicitly asked for something lightweight that's easy to
host and hand off to a non-developer — Decap CMS gives a real point-and-click admin screen
without the ongoing cost/complexity of managing a database, server, and auth provider. The
editorial workflow (Draft → Review → Ready) is also what will let a future content-writing
agent propose blog drafts that a human reviews and publishes, per your plan for that later.

---

## Project structure

```
src/
  _data/              → site settings, homepage copy, navigation, advisory, speaking, impact,
                         experiencePage (JSON — CMS-editable)
  _includes/
    layouts/           → base.njk, page.njk, story.njk, article.njk
    partials/          → header.njk, footer.njk, experience-card.njk (shared card macro),
                         linkedin-cta.njk
  experience/           → one Markdown file per experience story (+ experience.11tydata.js,
                         which hides unpublished stories' pages entirely)
  capabilities/          → one Markdown file per capability (taxonomy — no public pages)
  recommendations/       → one Markdown file per recommendation (no public pages)
  thinking/               → one Markdown file per blog article
  admin/                  → Decap CMS admin panel (index.html + config.yml)
  css/, js/, assets/
  index.njk, about.md, experience.njk, thinking.njk, advisory.njk, speaking.njk, impact.njk, contact.njk
.eleventy.js            → Eleventy config (collections, filters, passthrough copies)
netlify.toml             → Netlify build settings
```

---

## Running locally

Requires Node.js (already set up on this machine via Volta).

```bash
npm install
npm start
```

This starts a local dev server at **http://localhost:8080** with live reload. Visit
`http://localhost:8080/admin/` to see the CMS UI — it won't be able to log in or save until
deployed to Netlify with Identity enabled (see below), but you can browse the layout.

To produce a production build (output goes to `_site/`):

```bash
npm run build
```

---

## Deploying (first-time setup)

1. **Push this repo to GitHub.**
   ```bash
   git remote add origin <your-empty-github-repo-url>
   git push -u origin main
   ```

2. **Connect the repo to Netlify.**
   - Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
   - Pick this GitHub repo. Netlify will detect `netlify.toml` automatically
     (build command `npm run build`, publish directory `_site`).
   - Click **Deploy**.

3. **Enable Identity** (this is what lets Parul log into `/admin`).
   - In the Netlify site dashboard: **Site configuration → Identity → Enable Identity**.
   - Under **Registration**, set it to **Invite only** (so random people can't sign up).
   - Under **Services → Git Gateway**, click **Enable Git Gateway**. This lets the CMS commit
     content changes to GitHub on Parul's behalf, without her needing a GitHub account.

4. **Invite the first admin user.**
   - Still in **Identity**, click **Invite users**, enter Parul's email.
   - She'll get an email with a link to set a password.
   - After that, she can log in at `https://<your-site>.netlify.app/admin/` with just email + password.

5. **(Optional) Connect a custom domain** under **Domain management** in Netlify, once you have one.

Once this is done, every save inside `/admin` commits a file to GitHub, which triggers a new
Netlify build automatically — the live site updates in about a minute, with no manual steps.

---

## How to do common things

### Add a new experience story
Admin → **Experience** → **New Experience** → fill in:
- **Title** — write it problem-led (e.g. "Building operational capacity without adding
  headcount"), not a job title.
- **Organisation**, **Theme**, **Summary** (the fuller version shown on the story page itself).
- **Card Summary** (optional) — a shorter 2–3 line version for the card grid. Leave blank and
  the Summary above is used automatically; only fill this in if the full Summary reads too
  long as a card blurb.
- **Public Categories** — 2–3 short labels you choose yourself for the card (e.g.
  "Transformation", "Chief of Staff"). This is what visitors actually see, and it's also what
  the public filter buttons match against — so if you want a story to show up under a specific
  filter, put a matching word in Public Categories (see "Manage capabilities" below for exactly
  which words map to which filter).
- **Status Label** (optional) — a small badge like "Ongoing" or "Story in progress" for work
  that isn't finished yet.
- **Capabilities** — the detailed internal tags (search and select from the existing list).
  These stay in the CMS for future reuse and drive the "Related Capabilities" links on the
  story page; they are *not* shown directly to visitors as tags.
- **Methodology Stages** — tick whichever of Figure Out / Design / Build / Scale / Transform
  actually apply to this story.
- Fill in **The Problem**, **Why It Mattered**, and the narrative field for each methodology
  stage you selected (e.g. if you ticked "Design" and "Build", fill in the Design and Build
  boxes — the others can stay empty and simply won't show on the page).
- **Impact** — add one only if you have a real, verified number. Tick **"Needs Verification"**
  on any figure you're not 100% ready to publish yet — it stays saved in the CMS but is
  filtered out of the page before the site builds, so it can never accidentally go live, even
  by a template glitch. Untick it once you're ready to publish that number.
- **My Takeaway** — optional closing reflection.
- **Relevant Recommendation(s)** (optional) — link one or more people from Recommendations
  whose feedback relates to this story; it'll show in an "In their words" block on the page.

**Important:** leave **Published** unticked while you're still writing. The story stays
completely invisible on the live site (it won't even have a working URL) until you tick
Published — so half-finished drafts can never accidentally go live. Tick **Featured** to make
it one of the five "Featured Transformations" slots (shown on both `/experience/` and the
homepage, most prominent placement — the first 3 by Display Order get the homepage's dominant
cards, the next 2 show as smaller links); leave it unticked for it to appear under "More
problems I've worked on" instead once published (the first 6 by Display Order show
immediately, the rest sit behind a "View more" control).

### Manage capabilities
Admin → **Capabilities** → **New Capabilities** (or edit an existing one) → set Name, Slug,
Group (pick from the six fixed groups), and Display Order. Untick **Active** to retire a
capability without deleting it.

The public `/experience/` filter bar does **not** show these granular capabilities directly —
it shows a small, fixed set of broad filters (Transformation, 0→1 & Building, AI & Technology,
Operations, Business Scaling, Capital, Policy & Ecosystems, Chief of Staff & Strategy). Each
broad filter is defined in `.eleventy.js` (`BROAD_FILTERS`) as a set of matching label words —
a story shows up under a broad filter if one of its **Public Categories** words matches. A
broad filter only appears at all if at least one published story actually matches it. Adding a
brand-new granular capability doesn't create a new public filter automatically — it becomes
selectable in the CMS and shows on "Related Capabilities" links immediately, but reaching it
through the public filter bar requires either using an existing broad-filter word in Public
Categories, or a developer adding a new broad filter (a short code change).

### Add a recommendation
Admin → **Recommendations** → set a unique **Slug**, then paste in the genuine **Quote**
exactly as given (never rewrite it) — an optional **Short Excerpt** can hold a shorter, still
verbatim, snippet for compact display. Fill in Name, Current Role/Title, Organisation (where
you worked together), and Relationship/Context. Leave **Published** unticked until you're sure
you want it live — the whole "What people I've worked with say" section stays hidden until at
least one recommendation is published, and only the first 4 (by Display Order) show initially,
with the rest behind a "Read more" control.

### Add a new blog post
Admin → **Thinking** → **New Thinking** → write the body in the Markdown editor → leave
**Draft** ticked while working on it → untick **Draft** and **Publish** when ready.

### Change the hero image
Admin → **Homepage** → **Hero — Image** → upload a photo. Until a real photo is uploaded, the
homepage shows an elegant placeholder automatically.

### Edit homepage headline/copy
Admin → **Homepage** → edit any of the labelled fields → **Publish**.

### Manage Advisory services, Speaking topics/events, Impact projects
Each has its own section in the Admin sidebar — add, edit, reorder, enable/disable, or mark
published, all without touching code.

### Create the first admin user
See step 4 under **Deploying** above — done once, from the Netlify dashboard, after the first deploy.

---

## Content integrity rules this project follows

- Nothing is ever invented to fill a gap — no metrics, titles, dates, awards, quotes, or
  outcomes. Where content isn't ready, the relevant section simply doesn't render (never a
  visible `[CONTENT NEEDED]` placeholder on the live site).
- Every impact metric carries a `verification_required` flag in the CMS. When ticked, that
  figure is filtered out before the page is built — not just hidden with CSS — so it cannot
  reach the public HTML by accident. The ABWCI \$300B TAM figure, and a few ClearMeat
  percentages awaiting sourcing, are currently stored this way: visible only inside `/admin`.
- Recommendation quotes are stored and displayed exactly as given. A "Short Excerpt" field
  exists for tighter card display, but it's always a genuine subset of the original text, never
  a rewrite — the full original stays intact in the CMS regardless of which is shown.
- Unpublished experience stories generate no public URL at all (verified by inspecting the
  build output directly, not just by checking the listing pages) — so a draft can never be
  reached even by a guessed or shared link.

See "What remains" near the top of this file for what's still genuinely outstanding.
