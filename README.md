# Parul Soni Manvati — Personal Website (V1)

A premium, editorial personal brand website. Built as a static site (Eleventy) with a
self-serve content admin (Decap CMS) so content can be added and edited without touching code.

---

## What was built

- **Homepage** — all 12 sections from the brief: hero, credibility strip, five-stage method
  (Figure Out → Design → Build → Scale → Transform), featured experience, about teaser,
  thinking teaser, advisory/speaking/impact teasers, final CTA, footer.
- **Pages** — `/about`, `/experience`, `/experience/[slug]`, `/thinking`, `/thinking/[slug]`,
  `/advisory`, `/speaking`, `/impact`, `/contact`.
- **Experience system** — story cards with Problem → Thinking → Design → Build → Result →
  Lesson structure, category filtering, unlimited future stories. Seeded with 7 placeholder
  stories (one per organisation named in the brief) — content marked `[CONTENT NEEDED]`.
- **Blog ("Thinking") system** — Markdown articles with category, tags, excerpt, reading time,
  SEO fields, draft/published state. Seeded with 2 example drafts.
- **Admin panel** at `/admin` (Decap CMS) — manages Homepage copy, Experience, Thinking,
  Advisory, Speaking (topics + events), Impact, Navigation, Site Settings, and Media (image
  uploads), each with an editorial Draft → Review → Publish workflow.
- **SEO foundations** — per-page title/description, canonical URLs, Open Graph tags,
  `sitemap.xml`, `robots.txt`, semantic headings.
- **Responsive, accessible design** — mobile nav, focus states, skip-to-content link, reduced-motion support.
- **Contact form** — via Netlify Forms (no backend/database needed).

## What remains (by the brief's own P1/P2 priority)

- Real content: bio narrative, experience story details, photography, LinkedIn/email, first
  published articles — everything currently marked `[CONTENT NEEDED]`.
- Custom domain connection.
- P2 items not built in V1: newsletter, media mentions page, analytics dashboard.
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
  _data/            → site settings, homepage copy, navigation, advisory, speaking, impact (JSON — CMS-editable)
  _includes/
    layouts/         → base.njk, page.njk, story.njk, article.njk
    partials/        → header.njk, footer.njk
  experience/         → one Markdown file per experience story
  thinking/           → one Markdown file per blog article
  admin/              → Decap CMS admin panel (index.html + config.yml)
  css/, js/, assets/
  index.njk, about.md, experience.njk, thinking.njk, advisory.njk, speaking.njk, impact.njk, contact.njk
.eleventy.js          → Eleventy config (collections, filters, passthrough copies)
netlify.toml           → Netlify build settings
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
Admin → **Experience** → **New Experience** → fill in the fields (title, organisation, year,
category, challenge/thinking/action/result/lesson) → **Publish**. It appears at
`/experience/<slug>/` and in the `/experience/` listing automatically. Tick **"Featured on
Homepage"** to also show it on the homepage (only the first 3 featured stories show there).

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

Everything marked `[CONTENT NEEDED]` in the admin panel or source files:
- Public contact email and LinkedIn URL (`Admin → Settings`)
- Real experience story narratives (7 seeded stub stories, one per organisation)
- A hero photograph and professional portrait
- First 1–2 published articles
- About page career narrative and personal note

Nothing was invented to fill these gaps, per the brief's instruction not to fabricate titles,
dates, metrics, or achievements.
