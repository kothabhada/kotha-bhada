# World Trading Pvt. Ltd. — Attendance

A simple manager dashboard to record staff attendance.

## What it does
- Mark each staff member **Present** (one-tap **Check In** / **Check Out**, auto-timestamped), **Absent**, or **On Leave**.
- **Late** is flagged automatically when Check In is after **10:00 AM**.
- Office hours **10:00 AM – 6:00 PM**.
- **Daily** view (any past date) + **Monthly report** per staff with **CSV export**.
- Saved **online in Supabase**. If the database isn't set up yet, it runs in **Demo mode** (saved in the browser) so you can try it immediately.

## Run it locally
```
cd "kotha bada"
python3 -m http.server 8060 --directory attendance
```
Open http://localhost:8060/index.html

## Make it save online (one-time, ~2 min)
1. Open your Supabase project → **SQL Editor** → **New query**.
2. Paste the contents of `supabase-attendance.sql` and click **Run**. (Run it **once** — it creates the tables and seeds the 8 staff.)
3. Reload the app. The "Demo mode" toast disappears — records now save to Supabase.

## Staff
Edit the seed list at the top of `app.js` (`SEED_STAFF`) and the `insert` in `supabase-attendance.sql`,
or just add/remove rows in the Supabase `staff` table later.

## Note on security
This app has no login (the manager uses it directly), so the database allows anonymous
read/write. Before exposing the URL publicly, lock the tables down with Supabase Auth.

## Cache-busting
`index.html` loads `app.js?v=N` / `styles.css?v=N`. Bump `N` after editing so the browser doesn't serve stale files.
