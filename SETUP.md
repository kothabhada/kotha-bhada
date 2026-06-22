# Kotha Bada — Connect Your Database (Beginner Guide)

Follow these steps once. Total time: ~5 minutes. It's free.

---

## Part 1 — Create a free Supabase account & project

1. Go to **https://supabase.com** and click **Start your project** (sign in with GitHub or email).
2. Click **New project**.
3. Fill in:
   - **Name:** `kotha-bada`
   - **Database Password:** click *Generate a password* and **save it somewhere safe** (you won't need it for the app, but keep it).
   - **Region:** choose **Singapore** (closest to Nepal = faster).
4. Click **Create new project** and wait ~1–2 minutes while it sets up. ☕

---

## Part 2 — Create the table (copy & paste)

1. In your project, click **SQL Editor** (left sidebar) → **New query**.
2. Open the file **`supabase-schema.sql`** in this folder, copy ALL of it.
3. Paste it into the SQL editor and click **Run** (or press Ctrl/Cmd + Enter).
4. You should see **"Success"**. This created your `listings` table + 3 starter homes.

---

## Part 3 — Get your 2 connection values

1. Click **Project Settings** (the gear icon, bottom-left) → **API**.
2. You'll see two things you need:
   - **Project URL** — looks like `https://abcdxyz.supabase.co`
   - **Project API keys → `anon` `public`** — a long text starting with `eyJ...`
3. The `anon` key is **safe** to use in front-end code. (Never share the `service_role` key.)

---

## Part 4 — Connect the app

1. Open the file **`config.js`** in this folder.
2. Replace the placeholders:
   ```js
   const SUPABASE_URL = "https://abcdxyz.supabase.co";   // your Project URL
   const SUPABASE_ANON_KEY = "eyJhbGciOi...your-long-key";  // your anon public key
   ```
3. Save the file and **refresh** the app.

---

## Done! ✅

Now when anyone posts a house, it saves online and **everyone sees it on any device**.

Stuck on any step? Just tell me which part number and I'll help.
