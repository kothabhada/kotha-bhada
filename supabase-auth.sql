-- ============================================================
-- Kotha Bada — Owner accounts upgrade
-- Run this ONCE in Supabase: SQL Editor → New query → paste → Run
-- ============================================================

-- 1) Link each listing to the owner's account
alter table public.listings
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- 2) Replace the open "anyone can post" rule with secure, owner-based rules.
--    - Everyone can still READ all listings.
--    - Only logged-in owners can post, and only as themselves.
--    - Owners can edit/delete ONLY their own listings.
drop policy if exists "Anyone can post a listing"   on public.listings;
drop policy if exists "Owners can insert listings"  on public.listings;
drop policy if exists "Owners can update listings"   on public.listings;
drop policy if exists "Owners can delete listings"   on public.listings;

create policy "Owners can insert listings"
  on public.listings for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Owners can update listings"
  on public.listings for update to authenticated
  using (auth.uid() = user_id);

create policy "Owners can delete listings"
  on public.listings for delete to authenticated
  using (auth.uid() = user_id);

-- 3) Only logged-in users may upload photos (read stays public).
drop policy if exists "Anyone can upload listing photos" on storage.objects;
create policy "Logged-in users can upload listing photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'listing-photos');
