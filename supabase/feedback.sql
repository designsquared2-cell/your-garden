-- Tester feedback. Run once in Supabase → SQL Editor → New query → Run.
-- Anyone using the app can SEND feedback (signed in or not). Nobody can READ it through the app —
-- only you, in the dashboard (Table Editor → feedback), where you can also export it as CSV.

create table if not exists public.feedback (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  user_id     uuid default auth.uid(),                       -- set automatically if they're signed in
  email       text check (char_length(email) <= 200),        -- optional, if they'd like a reply
  kind        text not null default 'other' check (kind in ('bug','confusing','idea','other')),
  message     text not null check (char_length(message) between 1 and 2000),
  view        text check (char_length(view) <= 40),          -- which tab they were on
  app_version text check (char_length(app_version) <= 20),
  device      text check (char_length(device) <= 300),
  meta        jsonb check (pg_column_size(meta) <= 2000)     -- climate zone, maintenance level, garden size
);

alter table public.feedback enable row level security;

-- Send only. There is deliberately no "select" policy, so the app can't read anyone's feedback back.
drop policy if exists "anyone can send feedback" on public.feedback;
create policy "anyone can send feedback" on public.feedback
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

grant insert on public.feedback to anon, authenticated;
