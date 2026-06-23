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
- `LAUNCH-PLAYBOOK.md` — go-to-market plan (marketplace cold-start: seed listings first, then drive renters via FB groups / TikTok / QR posters).
- `.claude/hooks/after-edit.js` + `.claude/settings.json` — PostToolUse hook: after any Edit/Write it runs `node --check app.js` (blocks on syntax error) and auto-bumps every `?v=N` in index.html.

## Conventions (IMPORTANT)
- **Cache-busting:** `index.html` loads `app.js?v=N`, `styles.css?v=N` etc. The PostToolUse hook **auto-bumps the `v=` number** after every edit (no need to do it manually). If editing outside the hook, bump it yourself or the browser serves stale files.
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
- **Google login (OAuth):** enabled via Supabase → Authentication → Providers → Google (Client ID/Secret from a Google Cloud OAuth client; redirect URI = `https://lkddojzdpavzdauvsehe.supabase.co/auth/v1/callback`). Google app is published "In production", External. Code: `signInWithGoogle()` in app.js calls `sb.auth.signInWithOAuth({provider:'google', redirectTo: origin+pathname})`; button is in the auth modal.
- **URL Configuration (Authentication → URL Configuration):** Site URL + Redirect URLs control where OAuth returns the user. Must include the live site `https://inspiring-narwhal-bdd459.netlify.app/**` and `http://localhost:5050/**`. If unset, OAuth falls back to the default `localhost:3000` and shows "site can't be reached" after a successful Google login (token is in the URL hash).

## Gotchas
- The local `python3 -m http.server` process binds to its launch directory; if the folder is moved/renamed it 404s — restart the server (`pkill -f "http.server 5050"` then preview_start).
- `photosOf()` / gallery: video (if any) is the FIRST gallery slide, then photos.
- Footer contact is live: WhatsApp `wa.me/9779744325842`, email `kothabhada246@gmail.com`.
- **Contact owner = WhatsApp + Call (no Viber).** Viber was removed (rarely used in Nepal). Detail modal `.contact-row` has a WhatsApp button (`wa.me/...?text=`) and a `tel:` Call button showing the owner's number. i18n key `call`.
- **Area autocomplete** is shared between the home Search box and the post-property form via the generic `AREA_AC` config + `areaACInput/pickAreaAC/hideAreaAC/areaACKeydown('search'|'post', ...)` in app.js. `areaInput/pickArea/...` remain as thin "search" wrappers. Matches `AREAS` (bilingual EN/NE list); picking always stores the **English** area name so saved listings + filters stay consistent. Devanagari input detected via `/[ऀ-ॿ]/`.

## Deployment (LIVE)
- **Live:** https://inspiring-narwhal-bdd459.netlify.app (Netlify). **Code:** https://github.com/kothabhada/kotha-bhada
- Netlify is connected to the GitHub repo → **every `git push` to `main` auto-deploys** (~30s). No build step; publish dir is repo root.
- To ship a change: edit → bump cache-buster (the PostToolUse hook does this) → `git add -A && git commit && git push`.

## Next step
- ⚠️ Finish the **Google login redirect fix**: in Supabase → Authentication → URL Configuration, set Site URL = `https://inspiring-narwhal-bdd459.netlify.app` and add redirect URLs `https://inspiring-narwhal-bdd459.netlify.app/**` and `http://localhost:5050/**`. (User pending; Google login otherwise bounces to `localhost:3000`.)
- 🔒 Turn Supabase "Confirm email" back ON now that the app is public (was OFF for testing).
- Optional: rename Netlify site to `kotha-bhada.netlify.app`; add a custom domain. See PROGRESS.md.
- 🚀 Go-to-market: follow `LAUNCH-PLAYBOOK.md` — seed 20–30 real listings first, then promote to renters.
