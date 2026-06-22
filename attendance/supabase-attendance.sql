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

-- 3) ROW LEVEL SECURITY ---------------------------------------
-- This app has no login — the manager uses it directly — so we
-- allow anonymous read + write. Lock this down with Auth before
-- exposing the URL publicly.
alter table public.staff      enable row level security;
alter table public.attendance enable row level security;

drop policy if exists "staff read"        on public.staff;
drop policy if exists "attendance read"   on public.attendance;
drop policy if exists "attendance write"  on public.attendance;
drop policy if exists "attendance update" on public.attendance;
drop policy if exists "attendance delete" on public.attendance;

create policy "staff read"        on public.staff      for select using (true);
create policy "attendance read"   on public.attendance for select using (true);
create policy "attendance write"  on public.attendance for insert with check (true);
create policy "attendance update" on public.attendance for update using (true) with check (true);
create policy "attendance delete" on public.attendance for delete using (true);
