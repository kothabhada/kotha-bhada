-- ============================================================
-- Kotha Bada — Photo upload upgrade
-- Run this ONCE in Supabase: SQL Editor → New query → paste → Run
-- (Safe to run even with existing listings.)
-- ============================================================

-- 1) Add a column to store multiple photo URLs per listing
alter table public.listings
  add column if not exists images text[] not null default '{}';

-- 2) Allow public READ access to photos in the storage bucket,
--    and allow anyone to UPLOAD a photo (early version, no login yet).
--    NOTE: you must FIRST create a PUBLIC bucket named "listing-photos"
--    in Supabase → Storage → New bucket (toggle "Public bucket" ON).

drop policy if exists "Public read listing photos"  on storage.objects;
drop policy if exists "Anyone can upload listing photos" on storage.objects;

create policy "Public read listing photos"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

create policy "Anyone can upload listing photos"
  on storage.objects for insert
  with check (bucket_id = 'listing-photos');
