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

**Day 2 — Experience architecture:**
- **Experience system rebuilt around capability, not chronology.** Each story supports:
  Problem → Why It Mattered → Figure Out/Design/Build/Scale/Transform (only the stages that
  actually apply) → Impact → My Takeaway. Story cards on the homepage, `/experience/`, and
  individual story pages all render from the exact same underlying data (no duplicated copy).
- **Controlled capability taxonomy** — 34 capabilities across 6 groups (Strategy & Leadership,
  Build & Scale, Technology, Operations, Capital & Commercial, Policy & Ecosystems), each its
  own CMS-managed record. Stories are tagged with capabilities; `/experience/` has a
  capability-discovery filter bar (grouped chips, one active filter, synced to
  `?capability=<slug>` in the URL so filtered views are shareable/bookmarkable).
- **Five flagship story slots** — Amazon (AI/ML Transformation), Addverb (Enterprise
  Transformation / CEO Office), ClearMeat (Building an Emerging Category), Snapdeal
  (Same-Day/Next-Day Capability), ABWCI (MSME Service Engine) — created as **drafts** with
  organisation/theme/capabilities/methodology pre-filled, narrative fields left empty until
  real content is supplied (see "Content still needed" below).
- **Featured Transformations** — an editorial, asymmetric grid (not five identical cards) for
  the flagship stories, plus a **More from my experience** section for future Layer 2 stories
  that only appears once something is published there.
- **Recommendations system** — "What people I've worked with say," CMS-managed, hidden
  entirely until real recommendations are published (nothing fabricated).
- **LinkedIn follow CTA** — reusable component at the end of the Experience page and every
  story page.
- **Strict empty-state handling** — unpublished stories/recommendations never generate a live
  page at all (not just hidden from listings — the URL itself doesn't exist until published),
  and empty sections/headings are omitted from the page rather than showing placeholder text.
- **Admin panel** at `/admin` (Decap CMS) — Homepage, Experience, Capabilities, Thinking,
  Recommendations, Advisory, Speaking, Impact, Navigation, Settings, and Media (image
  uploads), each with an editorial Draft → Review → Publish workflow.

## What remains

- Real content: bio narrative, the five flagship experience stories, photography,
  LinkedIn/email, first published articles, genuine recommendations — everything currently
  left blank or in draft.
- Custom domain connection.
- Not built yet (by design — explicitly deferred to Days 3–4 per the brief): the paid
  exploratory-call flow (intake questionnaire → ₹500 payment → calendar booking), newsletter,
  media page, analytics dashboard.
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
- **Organisation**, **Theme**, **Summary** (1–2 sentences — this is what shows on cards).
- **Capabilities** — search and select from the existing list (see "Manage capabilities" below
  if you need a new one).
- **Methodology Stages** — tick whichever of Figure Out / Design / Build / Scale / Transform
  actually apply to this story.
- Fill in **The Problem**, **Why It Mattered**, and the narrative field for each methodology
  stage you selected (e.g. if you ticked "Design" and "Build", fill in the Design and Build
  boxes — the others can stay empty and simply won't show on the page).
- **Impact** — add one only if you have a real, verified number. Leave it empty otherwise;
  it won't show if empty.
- **My Takeaway** — optional closing reflection.

**Important:** leave **Published** unticked while you're still writing. The story stays
completely invisible on the live site (it won't even have a working URL) until you tick
Published — so half-finished drafts can never accidentally go live. Tick **Featured** to make
it one of the "Featured Transformations" (shown on both `/experience/` and the homepage, most
prominent placement); leave it unticked for it to appear under "More from my experience"
instead once published.

### Manage capabilities
Admin → **Capabilities** → **New Capabilities** (or edit an existing one) → set Name, Slug,
Group (pick from the six fixed groups), and Display Order. Untick **Active** to retire a
capability without deleting it (it'll disappear from the filter bar and existing stories that
used it just won't show that tag anymore). New capabilities become selectable on Experience
stories immediately, and automatically appear as a new filter chip on `/experience/` — no code
changes needed.

### Add a recommendation
Admin → **Recommendations** → **New Recommendations** → paste in the genuine quote (e.g. from
a LinkedIn recommendation), name, role, organisation. Leave **Published** unticked until you're
sure you want it live — the whole "What people I've worked with say" section on `/experience/`
stays hidden until at least one recommendation is published.

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

## Content still needed before this feels "real"

- Public contact email and LinkedIn URL (`Admin → Settings`)
- The five flagship experience stories' narrative content (Problem / Why It Mattered / stage
  write-ups / Impact / Takeaway) — currently drafts with only organisation, theme, capabilities
  and methodology stages pre-filled. **Publish each one via Admin → Experience once written.**
- A hero photograph and professional portrait
- First 1–2 published articles
- About page career narrative and personal note
- Genuine recommendations, if/when available

Nothing was invented to fill these gaps, per the brief's instruction not to fabricate titles,
dates, metrics, funding amounts, or achievements. The ABWCI story's working TAM figure
(USD 300 billion, supplied by you) is stored with a "needs verification" flag that's visible
only in the admin panel, never on the public site.
