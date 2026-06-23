# Launch Playbook: Kotha Bhada

**Product:** Two-sided house-rental web app for Kathmandu — renters contact owners directly (no agent, no commission); owners post & manage listings.
**Live site:** https://inspiring-narwhal-bdd459.netlify.app
**Launch type:** Community + Social (Nepal-focused), bootstrapped budget
**Primary goal:** First 30 real listings, then first 500 renters visiting/week
**The core challenge:** Two-sided marketplace cold-start (need listings AND renters at the same time)

---

## The golden rule: SUPPLY before DEMAND
Do **not** advertise to renters until the app has ~20–30 real listings. An empty app loses both sides. Seed the supply (listings) yourself first, then drive renter demand. Everything below is built around this.

---

## PHASE 1 — Seed the supply (Weeks 1–2): get 20–30 real listings

Your job here is to **manually fill the app with real houses** so it looks alive.

- [ ] **Post any houses you personally know** (yours, family, friends, neighbours) — even 3–5 to start.
- [ ] **Find owners already advertising "To Let" / घर भाडामा** and offer to list them FREE:
  - Walk/drive your tole and photograph **"To Let" signs** → call the number → "I'll list your house free on a new app, renters will call you directly, no commission." Post it for them.
  - **Facebook Marketplace** + Facebook groups (see list below) are full of owners posting rentals. Message them the same offer.
  - **Bahidar / Hamrobazar / Gharbeti** style listings — contact those owners too.
- [ ] **Offer to do the work for them:** many owners aren't tech-savvy. Take the photos, write the listing, post it yourself. This is how every marketplace starts (do things that don't scale).
- [ ] Aim: **20–30 listings across different areas** (Baneshwor, Lalitpur, Kapan, Koteshwor, Balaju, etc.) so any renter finds something near them.
- [ ] Make sure each listing has **good photos, correct area, rent, and a working phone number**.

> Why free? Your value to owners is "free renters with no commission." Charging comes much later, after you have traffic.

---

## PHASE 2 — Drive renter demand (Weeks 3–6): get people searching

Now that the app is full, send renters to it. **All free/low-cost, Nepal-specific channels:**

### A. Facebook Groups (your #1 channel in Nepal — FREE)
Join and post in Kathmandu rental groups (search these names on Facebook):
- "Room/Flat/House on Rent in Kathmandu"
- "House/Room Rent in Kathmandu (Without Agent)"
- "Kathmandu Room Finder / Flat Rent Kathmandu"
- Area-specific groups: "Baneshwor Rent", "Lalitpur Rent", "Kirtipur Students Room", etc.
- Student groups near colleges (most renters are students & young workers).

**How to post (don't spam):** share a *specific real listing* with photo + "More houses with no agent fee 👉 [link]". Helpful, not an ad. Post 2–3 different listings per week per group.

### B. TikTok + Instagram Reels (huge in Nepal, FREE)
- Short videos: walk through a nice listed room/flat → "रू15,000 मा यस्तो कोठा, कुनै एजेन्ट छैन। Kotha Bhada मा खोज्नुहोस्।"
- "POV: finding a flat in Kathmandu without paying agent commission."
- Post 3–4 a week. One viral video can flood your app with renters.

### C. Your contact: WhatsApp / Viber status & word of mouth
- Put the link on your **WhatsApp status**, personal FB, and tell friends to share.
- Ask the owners you listed to share their own listing link with people they know.

### D. Physical (very cheap, very local)
- Small **printed flyers / QR code** posters near colleges, hostels, tea shops, and busy tole boards: "घर/कोठा खोज्दै? No agent. Scan here 👉 [QR]."
- I can generate a printable QR poster for you.

### E. Cheap paid boost (optional, only after app is full)
- Boost ONE good Facebook post targeting **Kathmandu, age 18–35, interests: real estate/renting**. Start with **रू500–1,000** and watch what happens before spending more.

---

## PHASE 3 — Keep both sides growing (Week 7+)

- [ ] **Every new renter is a future owner referral** — add a gentle "Own a house? Post it free" nudge.
- [ ] Reply fast to anyone who messages you on FB/WhatsApp about the app.
- [ ] Keep listings fresh — remove rented ones, add new ones weekly, so the app never looks stale.
- [ ] Collect a few **happy stories** ("found my flat in 2 days, no commission") → post them as social proof.
- [ ] Once you have steady traffic, you can think about **featured listings** or a small fee for owners — but only when owners are getting real value.

---

## Minimum viable launch (if you only do 5 things)
1. Get **20+ real listings** on the app yourself (Phase 1).
2. Join **10 Kathmandu Facebook rental groups** and post real listings weekly.
3. Make **2 TikTok/Reels** walking through a nice listing.
4. Put the **link on your WhatsApp status** and ask 20 friends to share.
5. Print a **QR poster** for 5 college/tole notice boards.

---

## Simple metrics to watch (free, in Netlify + by hand)
- **# of listings** on the app (goal: 30 in month 1)
- **# of visitors/week** (Netlify shows basic traffic)
- **# of owner calls/WhatsApps** renters make (ask owners "how many calls did you get?")
- **# of houses rented through the app** — this is your real success number.

---

## Budget guide (bootstrapped, in NPR)
| Item | Cost |
|---|---|
| Facebook groups, TikTok, WhatsApp, word of mouth | रू0 |
| Printed QR flyers/posters (50–100 copies) | ~रू500–1,000 |
| One Facebook boosted post (test) | रू500–1,000 |
| **Total to start** | **under रू2,000** |

Spend रू0 until the app is full of listings. Marketing an empty app wastes money.

---

## Common mistakes to avoid
1. **Promoting before the app has listings** — the #1 killer. Supply first.
2. Spamming Facebook groups with raw links → you'll get banned. Share real, helpful listings.
3. Charging owners too early → they leave. Free until you have traffic.
4. Letting listings go stale → looks dead. Refresh weekly.
5. Not replying fast → renters and owners lose trust. Be responsive in week 1–2.

---

## Before you push hard (quick pre-launch checklist)
- [ ] Finish the **Google login redirect fix** in Supabase (Site URL + redirect URLs).
- [ ] Turn Supabase **"Confirm email" ON** (stops fake accounts).
- [ ] (Optional) Rename Netlify site to a cleaner link, e.g. `kotha-bhada.netlify.app`, for sharing.
- [ ] Test posting + contacting on a real phone end-to-end.
