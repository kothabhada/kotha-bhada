-- ============================================================
-- Kotha Bada — Supabase schema
-- Run this in your Supabase project: SQL Editor → New query → paste → Run
-- ============================================================

create table if not exists public.listings (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null,
  type        text not null,            -- House / Flat / Room / Office
  area        text not null,
  city        text not null default 'Kathmandu',
  price       integer not null,         -- monthly rent in NPR
  bedrooms    integer default 0,
  bathrooms   integer default 0,
  parking     boolean default false,
  furnished   text default 'Unfurnished',
  for_who     text default 'Anyone',
  description text,
  owner       text not null,
  phone       text not null,
  image       text
);

-- Make searches fast
create index if not exists listings_area_idx  on public.listings (area);
create index if not exists listings_type_idx  on public.listings (type);
create index if not exists listings_price_idx on public.listings (price);

-- ------------------------------------------------------------
-- Row Level Security (RLS)
-- For this early version: anyone can READ all listings, and
-- anyone can POST a new listing. (We'll tighten this once we
-- add owner accounts/login.)
-- ------------------------------------------------------------
alter table public.listings enable row level security;

drop policy if exists "Anyone can read listings"  on public.listings;
drop policy if exists "Anyone can post a listing"  on public.listings;

create policy "Anyone can read listings"
  on public.listings for select
  using (true);

create policy "Anyone can post a listing"
  on public.listings for insert
  with check (true);

-- ------------------------------------------------------------
-- A few starter listings so the app isn't empty
-- ------------------------------------------------------------
insert into public.listings (title, type, area, city, price, bedrooms, bathrooms, parking, furnished, description, owner, phone, image) values
('Sunny 2BHK Flat near Baneshwor Chowk', 'Flat', 'New Baneshwor', 'Kathmandu', 22000, 2, 1, true, 'Semi-furnished', 'Bright top-floor flat with balcony, 24hr water, inverter backup, walking distance to Baneshwor Chowk.', 'Sita Shrestha', '9801234567', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=70'),
('Single Room for Students in Kirtipur', 'Room', 'Kirtipur', 'Kathmandu', 6500, 1, 1, false, 'Furnished', 'Affordable furnished room near TU campus. Shared kitchen, quiet and safe neighborhood.', 'Ram Maharjan', '9812345678', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=70'),
('Modern 3BHK House with Parking in Lalitpur', 'House', 'Jhamsikhel, Lalitpur', 'Lalitpur', 55000, 3, 3, true, 'Unfurnished', 'Spacious independent house with garden, car + bike parking, solar water heater.', 'Anil Tamang', '9823456789', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=70');
