# Website Owner Manual

This guide is for **Parul**, not developers. It explains how to update the website day to day without writing any code.

Nothing in this guide requires GitHub, coding, or command lines. Everything happens through one screen: the Admin panel.

---

## A. How to Log Into Admin

1. Go to `yoursite.netlify.app/admin/` (replace with your actual site address — add `/admin/` to the end of your website's URL).
2. You'll see a **Login with Netlify Identity** button. Click it.
3. A small window pops up. Enter the email and password you set up for the site.
4. If this is your first time and you haven't set a password yet, check your email for an invitation from Netlify and follow the "Accept the invite" link — it will ask you to set a password.
5. Once logged in, you'll see the Admin panel with a menu down the left side.

**If you forget your password:** on the login window, click "Forgot password?", enter your email, and follow the reset link that arrives by email.

---

## B. What Each Admin Menu Item Does

| Menu item | What it controls |
|---|---|
| **Homepage** | The text and images on your homepage — hero headline, the 5-stage method, section headings, etc. |
| **About Page** | The About page content. |
| **Experience Stories** | The case-study style stories under `/experience` — one entry per story. |
| **Capabilities** | The internal tagging system used to file Experience Stories (you'll rarely need this). |
| **Thinking / Articles** | **This is your blog.** Every article you write lives here. See section E below. |
| **Recommendations** | Testimonial quotes shown around the site. |
| **Advisory** | The text, situation cards and engagement types on the Advisory page. |
| **Speaking** | Your speaking topics and past events. |
| **Impact** | The projects shown on the Impact page. |
| **Navigation** | The links shown in the top menu bar. |
| **Site Settings** | Your name, LinkedIn URL, contact email, and other site-wide details. |

---

## C. How to Edit Homepage Content

1. Admin → **Homepage** → **Homepage Content**.
2. Every text box on the homepage is listed here (Hero Headline, Hero Supporting Text, Method stages, section headings, etc.) — find the one you want to change.
3. Edit the text.
4. Click **Save** (top right). This saves it as a draft.
5. To make it live, see section G ("How to Publish") — the process is the same for every content type.

---

## D. How to Add a New Experience Story

1. Admin → **Experience Stories** → **New Experience Story**.
2. Fill in Title, Organisation, Theme, and the narrative fields (Problem, Why It Mattered, Figure Out / Design / Build / Scale / Transform — only fill in the stages that actually apply).
3. Leave **Published** turned **off** while you're still writing.
4. Click **Save**.
5. When the story is genuinely ready, come back and turn **Published** on, then save again and publish (section G).

**Important:** never turn Published on for a story that still has placeholder or unfinished text — the website is built to hide anything that looks unfinished, but it's best practice to only publish real, complete content.

---

## E. How to Write a New Thinking Article

This is your blog. There is no separate "Blog" section anywhere — Thinking **is** the blog. To be explicit about how the pieces map to each other:

| | |
|---|---|
| **Public website:** `/thinking` | Your article library — every published article, filterable by topic. |
| **Public website:** `/thinking/[article-name]` | One individual article's page. |
| **Admin:** Thinking / Articles | Where you create, edit, and publish every article. |

You will never need a second "Blog" collection or page — if you're asked to "add a blog post," this is where it happens.

1. Admin → **Thinking / Articles** → **New Thinking Article**.
2. Fill in:
   - **Title**
   - **Short Excerpt** — a 1–2 sentence summary shown on article cards
   - **Thinking Territory** — pick the one topic area that fits best (this controls the colour and the filter)
   - **Article Body** — write or paste your article here. This box supports basic formatting: headings, **bold**, *italics*, links, and lists.
3. Everything else on the form is optional — fill in what's useful and skip the rest.
4. Click **Save**.

## F. How to Save an Article as Draft

Simply leave **Published** turned **off** (it's off by default for a new article). Save it whenever you like — nothing goes live until you turn Published on. You can come back and keep editing a draft as many times as you want.

## G. How to Publish an Article

1. Open the article in Admin.
2. Turn the **Published** toggle **on**.
3. Click **Save**.
4. Look for a workflow status at the top of the entry (Decap shows drafts as "Draft" and lets you move them to "Ready" / "Publish"). If you see a **Publish** button in that status bar, click it.
5. Wait 1–3 minutes. Netlify rebuilds the site automatically in the background. Refresh the live page to see your change.

The same Save → Published toggle → Publish sequence applies to every content type in Admin (Experience Stories, Recommendations, Speaking, Impact, etc.) — Thinking Articles are the only ones with an extra "Draft" concept built specifically for writing over multiple sittings.

## H. How to Add an Article Image

1. In the article, find **Hero Image**.
2. Click it and either drag an image in or click to browse your computer.
3. Fill in **Hero Image Alt Text** — a short plain description of the image (e.g. "Parul speaking at a conference"). This matters for accessibility and search engines.
4. If you don't have an image, just leave both fields blank — the article will still look complete without one. Don't upload a placeholder or stock image just to fill the space.

## I. How to Create the LinkedIn Adaptation

The **LinkedIn Adaptation** field is a private notes field — it never appears on the public website. It exists so you can keep a shorter, LinkedIn-style rewrite of the article's idea in the same place as the article itself, instead of hunting through old LinkedIn drafts later.

1. In the article, find **LinkedIn Adaptation**.
2. Write your shorter LinkedIn version there.
3. Save. That's it — this field does not publish anywhere by itself. You still post it to LinkedIn manually, the normal way.

## J. How to Add the LinkedIn Post URL After Posting

Once you've posted the LinkedIn adaptation on LinkedIn itself:

1. Copy the URL of that LinkedIn post.
2. In the same article, paste it into **LinkedIn Post URL**.
3. Save and publish.
4. The article will now show a small **"Discuss this on LinkedIn →"** link, pointing readers to the conversation. If you leave this field blank, no such link appears — there is never an empty or broken link shown.

---

## K. How to Edit Advisory

1. Admin → **Advisory** → **Advisory Page**.
2. You can edit the hero heading/text, the six situation cards, and the six "Ways I can engage" rows (each has a title, description, typical outcome, and button text).
3. There is no pricing field on this page by design — Advisory is meant to read as problem-led, not as a price list.
4. Save and publish as usual.

## L. How to Add Speaking Content

1. Admin → **Speaking**.
2. **Speaking Topics** — a simple list of topics you speak about (title + short description).
3. **Speaking Events** — one entry per past event. Turn **Published** on for events you want visible; leave it off for ones still being confirmed. Add a **Video URL** if a recording exists — the card automatically becomes a "Watch" link when you do.

## M. How to Add Impact Content

1. Admin → **Impact** → **Impact Projects**.
2. Add a project with Title, Description, and optionally an Image and a Link.
3. Only turn **Published** on once the description is real, finished text — an unfinished placeholder description should stay unpublished.

## N. How to Add a Recommendation

1. Admin → **Recommendations** → **New Recommendation**.
2. Paste the **Quote** exactly as given to you — never rewrite someone else's words.
3. Fill in their Name, Role, and Organisation.
4. Leave **Published** off until you're ready, then turn it on and publish.

## O. How to Change LinkedIn / Site Settings

1. Admin → **Site Settings** → **Site Settings**.
2. **LinkedIn URL** — paste your full LinkedIn profile URL here (e.g. `https://www.linkedin.com/in/yourname`). Until this is filled in, every "Connect on LinkedIn" button across the site automatically stays hidden — as soon as you save a real URL here, those buttons appear everywhere on their own. You don't need to add them anywhere else.
3. **Public Contact Email** — same idea: fill this in and the footer's "Email" link appears automatically.
4. Save and publish.

---

## P. How Contact Form Submissions Work

When someone fills out and submits the form on `/contact`, the form is handled by **Netlify Forms** — a service built into Netlify, separate from Decap CMS. No code, database, or CMS entry is involved. The submission is sent straight to your Netlify account and (optionally) can trigger an email to you.

## Q. Where Contact Submissions Are Currently Stored

Submissions are stored in your **Netlify dashboard**, under that site's **Forms** section — not in the Admin/CMS panel, not in GitHub, and not in any spreadsheet. They are **not** currently copied anywhere else (no database, no CRM).

The registered form is named **`contact`**.

## R. How to View Them in Netlify

1. Log into [app.netlify.com](https://app.netlify.com) with your Netlify account.
2. Open your site.
3. Click **Forms** in the left-hand menu.
4. Click the **contact** form to see every submission, with all the fields (name, email, phone, opportunity type, and so on).
5. Netlify's Forms dashboard lets you export submissions (check the export/download option in that screen) and mark ones as spam.

## S. What Is and Is Not Currently Stored in Decap CMS

**Stored in Decap CMS (i.e., lives in your website's content and can be edited there):** every page's text, Experience Stories, Thinking Articles, Recommendations, Advisory content, Speaking, Impact, Navigation, and Site Settings.

**NOT stored in Decap CMS:**
- Contact form submissions (these go to Netlify Forms — see Q above)
- Any customer/relationship history, follow-up notes, or CRM-style records — none of this exists yet on the site. Right now, once a submission lands in Netlify Forms, following up is a manual process on your side.

---

## T. Basic Troubleshooting

**"I published an article but I don't see it on the live site."**
Wait 2–3 minutes — Netlify needs to rebuild the whole site after every change. If it's been longer than 5 minutes, check the Netlify dashboard's **Deploys** tab for a red/failed deploy. If the deploy failed, the previous version of the site stays live and nothing is lost — a failed change is simply not applied.

**"An image isn't showing up."**
Confirm the image actually finished uploading (open the entry again and check the image field still shows a thumbnail). Very large image files can be slow to upload — try a smaller file if it seems stuck.

**"I saved the article but it's still not live."**
Check the **Published** toggle is actually turned on (not just saved as a draft), then check whether the entry needs to be moved through Decap's workflow status (Draft → Ready → Publish) — look for a status bar/button at the top of the entry screen.

**"Netlify deployment is pending / stuck."**
This usually resolves itself within a few minutes. If a deploy has been "Building" for more than 10–15 minutes, check the Netlify **Deploys** tab for an error log, since something may need fixing before it can finish.

**"I can't log into Admin."**
- Double-check you're using the exact email you were invited with.
- Use "Forgot password?" on the login screen if needed.
- Make sure you're going to `/admin/` on your actual website address, not a random URL.
- If Netlify Identity itself seems broken (the login window won't open at all), this usually means a site configuration issue — this would need a developer to check Netlify Identity / Git Gateway settings.

**"I can't find a contact submission."**
Submissions live in Netlify, not Admin — see sections Q and R above. If you expected a submission and don't see it, check Netlify's Forms dashboard for a "spam" folder/filter, since the honeypot spam protection occasionally catches a legitimate submission if a form-filling browser extension interferes with the hidden field.

---

*This manual covers the website as built through Day 3D. If new sections or fields are added later, ask for this manual to be updated to match.*
