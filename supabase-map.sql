-- ============================================================
-- Kotha Bada — Map location upgrade
-- Run this ONCE in Supabase: SQL Editor → New query → paste → Run
-- ============================================================

-- Store each listing's map location (latitude / longitude)
alter table public.listings
  add column if not exists lat double precision,
  add column if not exists lng double precision;

-- Give the 3 starter listings approximate locations so they show on the map
update public.listings set lat = 27.6894, lng = 85.3370
  where area ilike '%baneshwor%' and lat is null;
update public.listings set lat = 27.6786, lng = 85.2776
  where area ilike '%kirtipur%'  and lat is null;
update public.listings set lat = 27.6776, lng = 85.3100
  where area ilike '%lalitpur%'  and lat is null;
