-- ============================================================
-- World Trading Pvt. Ltd. — Attendance app
-- Run this ONCE in Supabase → SQL Editor → New query → Run.
-- Creates 2 tables (staff, attendance) and seeds the 8 staff.
-- ============================================================

-- 1) STAFF -----------------------------------------------------
create table if not exists public.staff (
  id          bigint generated always as identity primary key,
  name        text not null,
  department  text,
  active      boolean not null default true,
  sort_order  int    not null default 0,
  created_at  timestamptz not null default now()
);

-- safe to run again on an existing table
alter table public.staff add column if not exists department text;
alter table public.staff add column if not exists hourly_rate numeric not null default 0;

-- Seed the 8 staff (only if the table is empty, so re-running is safe)
insert into public.staff (name, sort_order)
select v.name, v.ord
from (values
  ('Suhana Basnet',   1),
  ('Narayan Acharya', 2),
  ('Rupali Magar',    3),
  ('Bina Limbu',      4),
  ('Lalit Bastola',   5),
  ('Raj Limbu',       6),
  ('Pabitra Shrestha',7),
  ('Laxmi Parajuli',  8)
) as v(name, ord)
where not exists (select 1 from public.staff);

-- 2) ATTENDANCE -----------------------------------------------
-- One row per staff member per day.
--   status: 'present' | 'absent' | 'leave'   (null = not marked yet)
--   late  : true if check_in was after 10:00 office start
create table if not exists public.attendance (
  id          bigint generated always as identity primary key,
  staff_id    bigint not null references public.staff(id) on delete cascade,
  work_date   date   not null,
  status      text,
  check_in    timestamptz,
  check_out   timestamptz,
  late        boolean not null default false,
  note        text,
  updated_at  timestamptz not null default now(),
  unique (staff_id, work_date)
);

create index if not exists attendance_date_idx on public.attendance (work_date);

-- 3) SECURITY: manager-only access ----------------------------
-- Only the email(s) in the `managers` table can read/write anything.
-- The public key alone gives NO access to the data.
create table if not exists public.managers (
  email text primary key
);

-- Manager login email. Create this same user in Supabase →
-- Authentication → Users → Add user (with a password).
insert into public.managers (email) values ('basiccollectionseo@gmail.com')
  on conflict (email) do nothing;

alter table public.managers enable row level security; -- no policies = not directly selectable

-- SECURITY DEFINER so the check can read `managers` regardless of the caller
create or replace function public.is_manager()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.managers m
    where lower(m.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table public.staff      enable row level security;
alter table public.attendance enable row level security;

-- remove any older open policies
drop policy if exists "staff read"        on public.staff;
drop policy if exists "attendance read"   on public.attendance;
drop policy if exists "attendance write"  on public.attendance;
drop policy if exists "attendance update" on public.attendance;
drop policy if exists "attendance delete" on public.attendance;
drop policy if exists "staff manager all"      on public.staff;
drop policy if exists "attendance manager all" on public.attendance;

-- managers can do everything; everyone else (incl. anon & other signed-in
-- users from the rental app) gets nothing
create policy "staff manager all" on public.staff
  for all using (public.is_manager()) with check (public.is_manager());
create policy "attendance manager all" on public.attendance
  for all using (public.is_manager()) with check (public.is_manager());
