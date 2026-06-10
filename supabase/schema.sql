-- ============================================================
-- Watanabe OGI — Book Interest Survey : Database Schema
-- รันสคริปต์นี้ใน Supabase Dashboard > SQL Editor > New query > Run
-- ============================================================

create table if not exists public.responses (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  full_name        text not null,
  email            text not null,
  phone            text,
  organization     text,
  job_role         text,
  expertise        text,
  expertise_other  text,
  experience_level text,
  interests        text[] default '{}',
  books_interested text[] default '{}',
  format_pref      text[] default '{}',
  problems         text,
  comments         text,
  consent          boolean not null default false
);

-- เปิด Row Level Security
alter table public.responses enable row level security;

-- อนุญาตให้ผู้กรอก (anon) "เพิ่มข้อมูล" ได้อย่างเดียว — อ่านไม่ได้
drop policy if exists "anon can insert responses" on public.responses;
create policy "anon can insert responses"
  on public.responses
  for insert
  to anon
  with check (true);

-- หมายเหตุ: หน้าแดชบอร์ดอ่านข้อมูลผ่าน service_role key ฝั่ง server
-- ซึ่ง bypass RLS อยู่แล้ว จึงไม่ต้องสร้าง policy สำหรับ select
