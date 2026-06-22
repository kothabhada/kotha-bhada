-- ============================================================
-- Kotha Bada — Video upgrade
-- Run this ONCE in Supabase: SQL Editor → New query → paste → Run
-- ============================================================

-- Store one walkthrough video URL per listing
alter table public.listings
  add column if not exists video text;

-- Videos are uploaded to the same public "listing-photos" bucket,
-- so no extra storage policy is needed.
