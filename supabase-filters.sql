-- ============================================================
-- Kotha Bada — Extra filters upgrade
-- Run this ONCE in Supabase: SQL Editor → New query → paste → Run
-- ============================================================

-- "Price negotiable" tag owners can set on a listing
alter table public.listings
  add column if not exists negotiable boolean not null default false;

-- (The 'parking' column already exists from the first schema.)
