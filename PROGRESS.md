# Kotha Bhada — Project Progress & Where I Left Off

_Last updated: 2026-07-01_

**Kotha Bhada** is a two-sided house-rental web app for Kathmandu — renters browse & contact owners directly (no agent), owners log in to post & manage listings. (Originally named "Kotha Bada".)

---

## ▶️ How to run it locally
1. Open a terminal in this folder: `/Users/rajlimbu/Desktop/kotha bada`
2. Run: `python3 -m http.server 5050`
3. Open in your browser: **http://localhost:5050/index.html**

That's it — no build step. It's plain HTML/CSS/JS.

> Tip: after editing files, if the browser shows old content, hard-refresh (Cmd+Shift+R). The script tags use `?v=NUMBER` to bust cache — bump that number when needed.

---

## 🧩 The files
| File | What it is |
|---|---|
| `index.html` | The page structure (all screens & modals) |
| `styles.css` | All the styling |
| `app.js` | All the logic (listings, search, auth, map, share, etc.) |
| `data.js` | Sample listings (fallback if database is off) |
| `config.js` | Your Supabase URL + key (already filled in) |
| `manifest.json` | Makes it installable on phones (PWA) |
| `assets/icons/icon.svg` | The Kotha Bhada "D" logo |
| `supabase-*.sql` | Database setup scripts (see below) |

---

## 🗄️ Database (Supabase)
- Project URL: `https://lkddojzdpavzdauvsehe.supabase.co`
- All SQL scripts have been **run already** (schema, photos, auth, map, filters, video, trust).
- ⚠️ Only run a `supabase-*.sql` file again if you change it — re-running the first schema re-adds the 3 sample homes (duplicates).
- Auth setting: "Allow new users to sign up" = ON, "Confirm email" = OFF.
  - 🔒 **Before going public:** turn "Confirm email" back ON (stops fake signups).

---

## ✅ Features DONE (all built & tested)
- [x] Beautiful, mobile-first design + premium "D" logo, named **Kotha Bhada**
- [x] Renter / Owner role chooser (welcome screen + switch chip)
- [x] Browse listings: search by area, type, price
- [x] Filters: bedrooms, furnishing, parking, negotiable + **Clear**
- [x] **Sort: Newest / Price Low→High / Price High→Low**
- [x] Photo galleries (arrows, dots, counter, swipe)
- [x] **Video** walkthrough per listing
- [x] Map view (List / Map / Saved toggle)
- [x] Favorites / saved homes (no login needed)
- [x] Owner accounts: sign up, log in, post, edit, delete own listings
- [x] Contact owner via WhatsApp / Viber
- [x] Trust signals: ✓ Verified owner, "Posted X ago", 👁 view count
- [x] **Share** a listing (WhatsApp / Copy link / native) + shareable deep links
- [x] English / नेपाली language toggle
- [x] **Sort** dropdown (Newest / Price Low→High / High→Low)
- [x] **"How it works"** section (3 steps) + **trust footer**

---

## 📞 Your contact info (live in footer)
- WhatsApp: `wa.me/9779744325842` (9744325842)
- Email: `kothabhada246@gmail.com`

---

## 🌐 LIVE ONLINE ✅
- **Live site:** https://inspiring-narwhal-bdd459.netlify.app  _(rename in Netlify → Site name)_
- **Code on GitHub:** https://github.com/kothabhada/kotha-bhada
- **Hosting:** Netlify, connected to the GitHub repo. **Auto-deploys on every `git push`** to `main`.
  - To update the live site: edit files → `git add -A && git commit -m "..."` → `git push`. Netlify rebuilds in ~30s.

---

## 👉 NEXT STEPS (pick up here)
1. 🔒 **Turn Supabase "Confirm email" back ON** (Authentication → Sign In/Providers) so strangers can't make fake owner accounts now that the app is public.
2. (Optional) **Rename the Netlify site** to `kotha-bhada.netlify.app` for a cleaner share link.
3. (Optional) **Custom domain** — buy e.g. `kothabhada.com` and connect it in Netlify → Domain management.
4. Optional polish ideas not yet built:
   - Full-screen photo/video view
   - Owner dashboard / featured listings
   - Remove the Map tab if you decide it's not needed

---

## 💬 How to continue with Claude
Just open this folder with Claude Code and say something like:
> "Continue working on Kotha Bhada — read PROGRESS.md. Let's do the next step: deploy it online."

Claude also keeps its own memory of this project, so it will remember the details.
