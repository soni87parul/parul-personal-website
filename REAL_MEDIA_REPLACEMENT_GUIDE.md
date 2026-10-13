# Real Media Replacement Guide

Internal reference only. Never linked from the public site. Lists every temporary media slot left in the Refinement V2 pass, what belongs there, and exactly which file or CMS field to replace it in.

**A note on this pass:** the brief asked for temporary, properly licensed stock photography/video in place of the grey placeholder boxes. I was not able to source or verify real stock files in this session: my working environment's network access to the usual free stock libraries (Pexels, Unsplash, Pixabay) is blocked by an organisation-level policy, and the browser-automation fallback wasn't connected either. Rather than guess at image URLs I couldn't see and risk something broken or wrong going onto a live, real site, I left every slot as the existing clean placeholder box (the same "Image placeholder" component already in the design system — no dev/debug text, just a labelled box) and documented exactly what should fill each one below. Two practical ways forward: (1) you pick and download 12-18 images yourself against the specs below and drop them into Admin → Media, or the matching CMS field, and I wire them in; or (2) once your desktop/Chrome is connected in a session with me, I can browse Pexels/Unsplash myself, show you candidates, and place the ones you approve.

Slots marked **REAL PHOTOGRAPH REQUIRED — do not use stock** must never be filled with a stock image of another person. That would misrepresent who's shown, which this project explicitly rules out.

**Update, October 2026:** Parul supplied five custom, pre-approved illustrations directly (not stock photography) and asked for them to be implemented. Four of them filled slots #13, and three of #10-12's siblings in a different About section (see #16), plus one brand-new slot (#17). See "Priority 2b" below for the full record. Slots #1-9 (real photographs of Parul), #10-12 (About `expandTrio`) and #14-15 (stock video) are unaffected and still open.

---

## Priority 1 — Real photographs of Parul (do not use stock)

### 1. Home — Hero portrait
- **Current temporary media:** Placeholder box, "Executive portrait"
- **Real image required:** A professional portrait of Parul
- **Orientation:** Vertical
- **Crop / aspect ratio:** 4:5
- **Subject:** Confident, approachable, credible for a CEO / board / investor audience
- **File location / CMS field:** Admin → Homepage → Hero → Image (`homepage.heroImage` in `src/_data/homepage.json`)

### 2. About — Hero portrait
- **Current temporary media:** Placeholder box, "Executive portrait, natural setting"
- **Real image required:** A natural, candid leadership photograph (less staged than the Home hero)
- **Orientation:** Vertical
- **Crop / aspect ratio:** 4:5
- **Subject:** Natural, professional, candid
- **File location / CMS field:** Not yet wired to a CMS field — currently hard-coded to the placeholder in `src/_includes/layouts/about.njk` (line ~15). Tell me when you have the photo and I'll add the field and wire it in.

### 3. Speaking — Hero stage photograph
- **Current temporary media:** Placeholder box, "Parul speaking on stage"
- **Real image required:** A strong stage/panel photograph of Parul actually speaking
- **Orientation:** Horizontal
- **Crop / aspect ratio:** 16:10
- **Subject:** Parul on stage or on a panel — this is evidence, so it should be a real appearance, not a mood shot
- **File location / CMS field:** Not yet wired — currently hard-coded in `src/speaking.njk` (line ~22)

### 4. Home — Speaking teaser image
- **Current temporary media:** Placeholder box (dark), "Parul speaking on stage"
- **Real image required:** Can reuse the Speaking hero photograph above, or a second strong speaking/stage image
- **Orientation:** Horizontal
- **Crop / aspect ratio:** 16:9
- **Subject:** Parul speaking or on a panel
- **File location / CMS field:** `src/index.njk` (line ~158), inside the Speaking teaser section

### 5-8. Speaking — Selected appearances (Gulfood, CII, Digital Bharat, Women in Supply Chain)
- **Current temporary media:** Each event card shows a placeholder box; all four events are currently `published: false` (they carry `[CONTENT NEEDED — confirm: ...]` working titles and are correctly hidden from the live site until confirmed)
- **Real image required:** A real photograph from each confirmed appearance
- **Orientation:** Vertical
- **Crop / aspect ratio:** 3:4
- **Subject:** Parul at the actual event — panel, stage or audience shot
- **File location / CMS field:** Admin → Speaking → Speaking Appearances → each event's Image field (`src/_data/speakingEvents.json`). Confirm the event details (title, organisation, year), add the photo, then switch Published on — do this per event whenever you're ready, no need to wait for all four.

### 9. Speaking — Featured appearance
- **Current temporary media:** Empty state ("A featured speaking appearance will appear here once one is confirmed and published") until at least one event above is published and marked Featured
- **Real image required:** Same as above — reuses whichever event you mark Featured
- **File location / CMS field:** `featured: true` on one entry in `src/_data/speakingEvents.json`

---

## Priority 2 — Atmospheric / contextual (safe for licensed stock, no identity claim)

These do not depict Parul and can safely use properly licensed stock photography once sourced. Suggested search terms are for your own picking, or for me to use once I can browse a stock library in this session.

### 10. About — "Operate" panel
- **Current temporary media:** Placeholder box, "Operations in motion"
- **Real image required:** Editorial stock photo
- **Orientation:** Vertical
- **Crop / aspect ratio:** 3:4
- **Suggested subject / search terms:** warehouse or logistics operations, robotics/automation floor, operations control room — no visible faces as the "hero" of the shot
- **File location / CMS field:** `about.md` → `expandTrio[0]`, rendered in `src/_includes/layouts/about.njk` (line ~55)

### 11. About — "Build" panel
- **Current temporary media:** Placeholder box, "Building from zero"
- **Real image required:** Editorial stock photo
- **Orientation:** Vertical
- **Crop / aspect ratio:** 3:4
- **Suggested subject / search terms:** laboratory / food-tech research bench, early-stage build environment, machinery or product-development detail
- **File location / CMS field:** `about.md` → `expandTrio[1]`, same template

### 12. About — "Transform" panel
- **Current temporary media:** Placeholder box, "Enterprise transformation"
- **Real image required:** Editorial stock photo
- **Orientation:** Vertical
- **Crop / aspect ratio:** 3:4
- **Suggested subject / search terms:** abstract architecture, systems/infrastructure, manufacturing floor, control-room or dashboard detail
- **File location / CMS field:** `about.md` → `expandTrio[2]`, same template

### 13. Experience — Opening image — ✅ FILLED (October 2026, commissioned illustration)
- **Status:** Done. No longer a placeholder.
- **What's used:** An approved custom illustration (not stock photography) supplied directly by Parul as one of five "approved website visuals" — a dot-matrix map silhouette with the headline "Systems / Infrastructure / Transformation."
- **Source / licensing:** Commissioned/owned by Parul, supplied as a finished file. Not a stock-library image, so no licence attribution is required — provenance is simply "supplied by the site owner."
- **Asset files:** `src/assets/images/visuals/experience-systems-infrastructure-{800,1300}.{jpg,webp}` (responsive variants). Untouched master copy kept at `src/assets/images/visuals/originals/04_systems_infrastructure_transformation_highres.jpg`.
- **One edit made to the source:** the original export had a ~220px solid black bar along the bottom (an unrelated rendering artifact); this was cropped off before use. Nothing else was altered, recomposed or recolored.
- **Placed:** `src/experience.njk`, hero section, right column. Loaded eager (it's above the fold) with a small "Systems · Infrastructure · Transformation" caption underneath.
- **Alt text:** "Illustration representing the intersection of systems, infrastructure and business transformation."

### 14. Speaking — Circular media moment (video)
- **Current temporary media:** Placeholder box, "Speaking clip"
- **Real media required:** A short (5-15s), muted, looping stock video — atmospheric auditorium / stage-light / conference-in-motion footage that does not depict or imply Parul is in it. Needs: muted, loop, playsinline, a poster image, and to respect `prefers-reduced-motion` (freeze on the poster image when reduced motion is on)
- **Orientation:** Square-cropped within the circular mask
- **Crop / aspect ratio:** 1:1
- **Suggested subject / search terms:** conference stage lights, auditorium ambience, audience silhouettes (no identifiable individual as the subject)
- **File location / CMS field:** `src/speaking.njk` (line ~107)

### 15. Optional second stock video
- **Not yet placed.** The brief allows for a second, optional atmospheric clip related to automation, logistics, manufacturing, technology or emerging industry. No slot exists for this yet — let me know if you'd like one added (e.g. to the About "Operate" panel) once you have a candidate clip.

---

## Priority 2b — commissioned illustrations (filled, October 2026)

Four more slots were filled in the same pass as #13 above, using four more of Parul's five approved custom illustrations. These are **not stock photography** — no licence attribution applies, since they were supplied directly by Parul as finished, owned files. Each was placed exactly as supplied; the only edits made were moderate, consistent crops to drop blank export margins and baked-in title text that would have duplicated the real on-page heading (see each entry). None were recolored, recomposed or regenerated.

### 16. About — "Operator" / "Builder" / "Ecosystem Thinker" proof cards
- **Current media:** Three image-led cards, replacing the previous icon-only `.proof-card` treatment. This is a **different** trio from #10-12 above (`expandTrio`, titled Operate/Build/Transform) — that section is untouched and still shows its own placeholders.
- **Assets:** `src/assets/images/visuals/about-operator-{600,1000}.{jpg,webp}`, `about-builder-{600,1000}.{jpg,webp}`, `about-ecosystem-thinker-{600,1000}.{jpg,webp}`. Untouched masters kept at `src/assets/images/visuals/originals/01_operator_highres.jpg`, `02_builder_highres.jpg`, `03_ecosystem_thinker_highres.jpg`.
- **Crop applied:** all three were exported by the illustrator at 1494×1464 with a baked-in title/tagline footer ("OPERATOR / Scale · Transformation · Execution", etc.) that would have duplicated the real `<h3>` title already rendered below the image. The Builder and Ecosystem Thinker files also had an unintentional blank panel down the left edge (a leftover from whatever template exported them). All three were cropped to the same 1150×1150 square, centred on the illustrated figure, to drop the blank panel and the duplicate text footer and keep the three as one consistent visual family. Note: the Ecosystem Thinker source file's own composition was itself cut off at its right edge before I received it (a node icon is partially missing) — that's a limitation of the file I was given, not something my crop did; I kept as much of it in frame as the file allows.
- **Placed:** `src/_includes/layouts/about.njk`, the `proofCards` loop (`about.md` frontmatter). Lazy-loaded (below the fold).
- **Alt text:** card-specific, matching the brief's suggested wording (operational leadership / building new businesses / connecting stakeholders).

### 17. Advisory — ecosystem-beyond-the-meeting visual
- **Current media:** A brand-new image box next to "When the problem is bigger than a meeting," full composition, uncropped (3348×1880, the illustrator's full export — no blank margins or defects on this one).
- **Asset:** `src/assets/images/visuals/advisory-ecosystem-{1000,1600,2200}.{jpg,webp}`. Untouched master at `src/assets/images/visuals/originals/05_problem_bigger_than_the_meeting_highres.jpg`.
- **Placed:** `src/advisory.njk`, hero section, right column (desktop: text ~42%, image ~58%, per brief). The container's aspect ratio is locked to the artwork's own ratio so nothing is ever cropped and every node label (People, Strategy, Technology, Regulation & Policy, Markets & Customers, Capital & Investment, Supply Chain & Operations, Execution, Talent & Organisation, Industry & Partners) stays legible.
- **Alt text:** "Illustration showing an interconnected business system extending beyond a meeting room."

---

## Not in scope for stock media

- **Home hero "supporting glimpses"** (`homepage.heroSupportingGlimpses`, labelled "Working session" / "Speaking"): these are small placeholder labels without a wired image field yet. Given they'd likely be read as depicting Parul, they should wait for real photographs rather than stock — flag when you have candidates and I'll wire the field.
- Any slot not listed above currently renders no placeholder at all (hidden gracefully) and does not need media before publishing.

---

## Summary

| # | Slot | Status |
|---|------|-------|
| 1-9 | Home hero, About hero, Speaking hero + teaser, 4 speaking appearances + featured | Still placeholders — real photograph of Parul required, do not use stock |
| 10-12 | About `expandTrio` Operate/Build/Transform panels | Still placeholders — licensed stock photo suggested |
| 13 | Experience opening image | ✅ Filled — commissioned illustration |
| 14-15 | Speaking circular media, optional second clip | Still placeholders — licensed stock video suggested |
| 16 | About `proofCards` Operator/Builder/Ecosystem Thinker | ✅ Filled — commissioned illustrations |
| 17 | Advisory ecosystem visual | ✅ Filled — commissioned illustration (new slot, not in the original 15) |

Remaining open: 9 photograph slots of Parul (#1-9), 3 stock-photo panels (#10-12) and up to 2 stock videos (#14-15).

## "What shapes my thinking" (About page)

Chapters, lines and photos live in `src/_data/aboutThinking.json` (editable in the CMS under "About: What Shapes My Thinking"). Each chapter takes one to four photo IDs from `src/_data/photos.json`; tiles line up at the same height automatically. A caption (for example a name) is optional. To change a crop, edit `posDesktop` / `posMobile` for that photo in `photos.json`.

## Featured Speaking

Panels are shown in rows of four. Add panels in multiples of four in `src/_data/speakingMoments.json` (or the CMS). The separate "In conversation" media row was removed for now; reintroduce it when there are real media interactions.
