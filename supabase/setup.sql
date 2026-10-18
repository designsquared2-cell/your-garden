-- Garden app — database setup for sync and household sharing.
-- Run once in Supabase: SQL Editor → New query → paste all of this → Run. Safe to run again.
--
-- Model: a garden is one JSON document (the app's saved state). People reach a garden only through
-- garden_members. Invites are by email and are claimed when that person signs in.

create table if not exists public.gardens (
  id          uuid primary key default gen_random_uuid(),
  name        text not null default 'My garden',
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id) on delete set null
);

create table if not exists public.garden_members (
  garden_id  uuid not null references public.gardens(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'member' check (role in ('owner','member')),
  joined_at  timestamptz not null default now(),
  primary key (garden_id, user_id)
);

create table if not exists public.garden_invites (
  garden_id   uuid not null references public.gardens(id) on delete cascade,
  email       text not null,
  invited_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  primary key (garden_id, email)
);

-- ── Row-level security: nobody sees anything unless they're a member ──
alter table public.gardens        enable row level security;
alter table public.garden_members enable row level security;
alter table public.garden_invites enable row level security;

-- helper: is the signed-in user a member of this garden? (security definer avoids policy recursion)
create or replace function public.is_member(gid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.garden_members where garden_id = gid and user_id = auth.uid());
$$;

drop policy if exists "members read gardens"   on public.gardens;
drop policy if exists "members update gardens" on public.gardens;
create policy "members read gardens"   on public.gardens for select using (public.is_member(id));
create policy "members update gardens" on public.gardens for update using (public.is_member(id)) with check (public.is_member(id));
-- (gardens are created through create_garden() below, never inserted directly)

drop policy if exists "members see members" on public.garden_members;
drop policy if exists "leave a garden"      on public.garden_members;
create policy "members see members" on public.garden_members for select using (public.is_member(garden_id));
create policy "leave a garden"      on public.garden_members for delete using (user_id = auth.uid());

drop policy if exists "members see invites" on public.garden_invites;
drop policy if exists "members cancel invites" on public.garden_invites;
create policy "members see invites"    on public.garden_invites for select using (public.is_member(garden_id));
create policy "members cancel invites" on public.garden_invites for delete using (public.is_member(garden_id));

-- ── Functions the app calls ──
-- Create a garden and make the caller its owner
create or replace function public.create_garden(p_name text, p_data jsonb) returns uuid
language plpgsql security definer set search_path = public as $$
declare gid uuid;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  insert into public.gardens (name, data, updated_by) values (coalesce(nullif(p_name,''),'My garden'), coalesce(p_data,'{}'::jsonb), auth.uid())
    returning id into gid;
  insert into public.garden_members (garden_id, user_id, role) values (gid, auth.uid(), 'owner');
  return gid;
end $$;

-- Save the garden, but only if nobody else saved since we last loaded it (p_base = the updated_at we had).
-- Returns the new updated_at, or null if someone else's change is newer (the app then reloads).
create or replace function public.save_garden(p_id uuid, p_data jsonb, p_base timestamptz) returns timestamptz
language plpgsql security definer set search_path = public as $$
declare ts timestamptz;
begin
  if not public.is_member(p_id) then raise exception 'not a member'; end if;
  update public.gardens set data = p_data, updated_at = now(), updated_by = auth.uid()
   where id = p_id and (p_base is null or updated_at <= p_base)
   returning updated_at into ts;
  return ts;
end $$;

-- Invite someone to a garden by email (members only)
create or replace function public.invite_member(p_garden uuid, p_email text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_member(p_garden) then raise exception 'not a member'; end if;
  insert into public.garden_invites (garden_id, email, invited_by) values (p_garden, lower(trim(p_email)), auth.uid())
    on conflict (garden_id, email) do nothing;
end $$;

-- Join any gardens you've been invited to (called after signing in)
create or replace function public.claim_invites() returns integer
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  if auth.uid() is null then return 0; end if;
  insert into public.garden_members (garden_id, user_id, role)
    select garden_id, auth.uid(), 'member' from public.garden_invites
     where email = lower((select email from auth.users where id = auth.uid()))
    on conflict do nothing;
  get diagnostics n = row_count;
  delete from public.garden_invites where email = lower((select email from auth.users where id = auth.uid()));
  return n;
end $$;

-- Only signed-in users may call these
revoke all on function public.create_garden(text, jsonb)            from public, anon;
revoke all on function public.save_garden(uuid, jsonb, timestamptz) from public, anon;
revoke all on function public.invite_member(uuid, text)             from public, anon;
revoke all on function public.claim_invites()                       from public, anon;
grant execute on function public.create_garden(text, jsonb)            to authenticated;
grant execute on function public.save_garden(uuid, jsonb, timestamptz) to authenticated;
grant execute on function public.invite_member(uuid, text)             to authenticated;
grant execute on function public.claim_invites()                       to authenticated;
grant execute on function public.is_member(uuid)                       to authenticated;
