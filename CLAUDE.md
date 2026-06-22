# CLAUDE.md — Kotha Bhada

Guidance for Claude Code when working in this repo.

## What this is
**Kotha Bhada** — a two-sided house-rental web app for Kathmandu. Renters browse & contact owners directly (no agent); owners log in to post/manage listings. Built collaboratively, one feature at a time.
(Name history: "Kotha Bada" → "Dera" → **Kotha Bhada**. Folder is still `kotha bada`; user-facing name is Kotha Bhada.)

## Stack & how to run
- **Plain HTML/CSS/JS — no build step, no framework, no npm.**
- Backend: **Supabase** (Postgres + Auth + Storage), via the `@supabase/supabase-js` CDN.
- Maps: **Leaflet + OpenStreetMap** (no API key).
- Run locally: `python3 -m http.server 5050` → open http://localhost:5050/index.html
  (also defined in `.claude/launch.json` for the preview tool).

## Files
- `index.html` — all structure & modals (detail, post/edit, auth, my-listings, welcome/role, share).
- `styles.css` — all styles.
- `app.js` — all logic (one file).
- `data.js` — sample listings (offline fallback only).
- `config.js` — Supabase URL + publishable key (filled in).
- `manifest.json` + `assets/icons/icon.svg` — PWA + "KB" logo.
- `supabase-*.sql` — DB migrations (run in order: schema, photos, auth, map, filters, video, trust).
- `PROGRESS.md` — user-facing "where I left off" (keep updated). `SETUP.md` — Supabase setup guide.

## Conventions (IMPORTANT)
- **Cache-busting:** `index.html` loads `app.js?v=N`, `styles.css?v=N` etc. **Bump the `v=` number after editing** JS/CSS or the browser serves stale files. (Currently JS v=18, CSS v=18.)
- **i18n (English/Nepali):** static text uses `data-i18n` / `data-i18n-ph` / `data-i18n-html` attributes; dynamic strings use `tt("key")`. Add new keys to BOTH the `I18N.ne` object and the `EN` object (or rely on the cached HTML default for `data-i18n`). Saved in `localStorage` key `kothabada_*`.
- **localStorage keys** are `kothabada_*` (listings fallback, favs, role, lang) — kept stable across renames; don't change them.
- After editing `app.js`, run `node --check app.js`.
- Verify changes in the preview (preview_start → reload with `?fresh=Date.now()` → screenshot/eval). The browser caches `index.html` aggressively; navigate to `?fresh=<ts>` to force fresh.

## Supabase notes
- Project URL in `config.js`. Uses the new **publishable key** (`sb_publishable_…`), not legacy anon `eyJ…`.
- Table `public.listings`. RLS: anyone can read; only authenticated owners insert/update/delete their own (`user_id = auth.uid()`). Storage bucket `listing-photos` (public) holds photos + `videos/`.
- View counts use `increment_views()` (SECURITY DEFINER RPC) so anon visitors can +1 safely.
- **Run each `supabase-*.sql` ONCE** — re-running the first schema re-inserts the 3 sample homes (duplicates).
- Auth: "Allow new users to sign up" ON, "Confirm email" OFF for testing. **Turn Confirm email back ON before going public.**

## Gotchas
- The local `python3 -m http.server` process binds to its launch directory; if the folder is moved/renamed it 404s — restart the server (`pkill -f "http.server 5050"` then preview_start).
- `photosOf()` / gallery: video (if any) is the FIRST gallery slide, then photos.
- Footer contact is live: WhatsApp `wa.me/9779744325842`, email `kothabhada246@gmail.com`.

## Next step
Deploy online (e.g. Netlify) so share links / WhatsApp work for real and the app installs on phones. See PROGRESS.md.
