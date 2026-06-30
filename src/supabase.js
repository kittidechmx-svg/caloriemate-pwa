import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/* ── SQL Schema (รัน 1 ครั้งใน Supabase SQL Editor) ──────────────────────────

-- ตาราง workout modes รายวัน
create table daily_modes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  mode text not null default 'rest',
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- ตาราง food entries
create table food_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  meal_slot text not null,
  name text not null,
  serving text,
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  created_at timestamptz default now()
);

-- Row Level Security
alter table daily_modes enable row level security;
alter table food_entries enable row level security;

create policy "Users see own modes" on daily_modes for all using (auth.uid() = user_id);
create policy "Users see own foods" on food_entries for all using (auth.uid() = user_id);

── ──────────────────────────────────────────────────────────────────────── */
