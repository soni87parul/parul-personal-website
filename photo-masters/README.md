# Photograph masters

These are the ORIGINAL photographs exactly as supplied. They are kept here (outside `src/`, so they are never published) as the source of truth.

## Rules (non-negotiable)

- Never send these photographs through any generative or AI tool. No face enhancement, restoration, retouching, relighting, background replacement, generative fill or AI upscaling.
- Allowed: crop, resize, modest conventional exposure/colour correction, compression, WebP/JPEG conversion.
- If something on the edge of a photograph has to go (screenshot controls, black bars), crop it out. Never paint over it.

## How the web copies are made

Web copies live in `src/assets/images/photos/` as `<id>-<width>.webp` (480, 768, 1200, 1600, plus the native width where it is useful) and one `<id>-<width>.jpg` fallback. They were made by plain Lanczos downscaling only. Nothing is ever enlarged beyond the original size. No sharpening, no colour change.

## How a photograph is used

Every photograph has an entry in `src/_data/photos.json` (alt text, aspect ratio, and a separate crop position for desktop, tablet and mobile). Templates call the shared `partials/photo.njk` component. To change which part of a photograph is visible, edit `posDesktop`, `posTablet` or `posMobile` (CSS `object-position`, e.g. `"50% 20%"` = centred, a little above the middle). No image file needs to change.

## Cropped derivatives

Three web copies were cropped at the outer edges only (the original masters here are untouched): `amitabh-kant` (social-media buttons cropped off the bottom), `ficci-summit` (black bars cropped off top and bottom), `addverb-event` (bottom edge cropped to remove the Addverb Technologies logo).

## Library (processed, not shown anywhere yet)

- `panel-digital-event`: four-person conference panel.
- `event-selfie-unassigned.jpg`: the master of the `foodpharmer` photograph.

## Added October 2026 (third photo round)

All masters below are the untouched originals. Web copies were cropped at outer edges only where noted.

- `gulfood-manufacturing-visitor.jpg`: web copy has a small blur over the visitor-badge QR code and small ID lines only (nothing on the face).
- `gulfood-inspire-stage.jpg`: black border cropped off the web copy. Low resolution (video screenshot), shown small.
- `amazon-diwa-kickoff.jpg`, `google-digital-bharat-2023.jpg`, `maneka-gandhi.jpg`, `animal-sanctuary.jpg`, `animal-park.jpg`, `travel-statue-of-liberty.jpg`, `travel-konark.jpg`, `travel-snoqualmie-falls.jpg`: no crop (display crops are set per photo in `src/_data/photos.json`).
- `clearmeat-booth-screenshot.jpg`, `microscope-screenshot.jpg`, `kunal-bahl-screenshot.jpg`, `suresh-raina-screenshot.jpg`, `hemendra-mathur-clearmeat-day2-screenshot.jpg`: phone screenshots of LinkedIn posts. Web copies are cropped to the photograph only (phone status bar, black bars and LinkedIn buttons removed from the outer edges). If you have the original files, replace these masters and re-export for a sharper result.
- `exec-desk-gemini-export.jpg`: this image carries a Google Gemini mark in the bottom-right corner, so it may have been generated or edited by AI. The web copy is cropped above the text banner and mark. Replace it with the original photograph when you have it.
