-- ============================================================
-- Dera — Trust signals upgrade (view counts)
-- Run this ONCE in Supabase: SQL Editor → New query → paste → Run
-- ============================================================

-- 1) A views counter on each listing
alter table public.listings
  add column if not exists views integer not null default 0;

-- 2) A safe way for ANY visitor (even not logged in) to add +1 view,
--    without being able to edit anything else. SECURITY DEFINER lets this
--    function bypass the row rules for just this one tiny update.
create or replace function public.increment_views(listing_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.listings set views = views + 1 where id = listing_id;
$$;

grant execute on function public.increment_views(uuid) to anon, authenticated;
