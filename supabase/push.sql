-- Weekly garden notes: who to send a (content-free) push to, and when.
-- Run once in Supabase → SQL Editor. Safe to run again.
-- The push carries no garden data: each phone picks its own note from what the app saved on it.

create table if not exists public.push_subs (
  endpoint      text primary key,               -- the phone's push address (from the browser)
  tz            text not null default 'Australia/Perth',
  dow           int  not null default 0 check (dow between 0 and 6),   -- 0 = Sunday
  hour          int  not null default 8 check (hour between 6 and 20), -- local time
  interval_days int  not null default 7,        -- 14 after three unopened notes in a row
  last_sent     timestamptz,
  fails         int  not null default 0,
  created_at    timestamptz not null default now()
);
alter table public.push_subs enable row level security;
-- No policies on purpose: nobody can read or change the table directly, only through the functions below.

create table if not exists public.push_config (id int primary key default 1 check (id = 1), cron_key text not null);
alter table public.push_config enable row level security;

-- Only real browser push services, so the sender can't be pointed at any other address
create or replace function public.push_valid_endpoint(p text) returns boolean language sql immutable as $$
  select length(p) < 1000 and p ~ '^https://(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|web\.push\.apple\.com|[a-z0-9.-]+\.notify\.windows\.com)/'
$$;

create or replace function public.push_subscribe(p_endpoint text, p_tz text, p_dow int, p_hour int)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not push_valid_endpoint(p_endpoint) then raise exception 'bad endpoint'; end if;
  insert into push_subs (endpoint, tz, dow, hour)
  values (p_endpoint,
          case when exists (select 1 from pg_timezone_names where name = p_tz) then p_tz else 'Australia/Perth' end,
          least(greatest(coalesce(p_dow, 0), 0), 6), least(greatest(coalesce(p_hour, 8), 6), 20))
  on conflict (endpoint) do update set tz = excluded.tz, dow = excluded.dow, hour = excluded.hour, fails = 0;
end $$;

create or replace function public.push_unsubscribe(p_endpoint text)
returns void language sql security definer set search_path = public as $$
  delete from push_subs where endpoint = p_endpoint;
$$;

create or replace function public.push_interval(p_endpoint text, p_days int)
returns void language sql security definer set search_path = public as $$
  update push_subs set interval_days = case when p_days >= 14 then 14 else 7 end where endpoint = p_endpoint;
$$;

-- For the sender only (needs the cron key): phones due a note this hour, marked as sent.
-- p_force = true returns everyone, for a test send.
create or replace function public.push_due(p_key text, p_force boolean default false)
returns setof text language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from push_config where cron_key = p_key) then raise exception 'not allowed'; end if;
  return query
    with sent as (
      update push_subs s set last_sent = case when p_force then s.last_sent else now() end  -- test sends don't count
      where p_force or (
        extract(dow from now() at time zone s.tz) = s.dow
        and extract(hour from now() at time zone s.tz) = s.hour
        and (s.last_sent is null or s.last_sent < now() - make_interval(days => s.interval_days - 1)))
      returning s.endpoint)
    select sent.endpoint from sent;
end $$;

-- The sender reports back: gone (the phone unsubscribed) or failed (removed after 5 failures in a row)
create or replace function public.push_result(p_key text, p_endpoint text, p_ok boolean, p_gone boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from push_config where cron_key = p_key) then raise exception 'not allowed'; end if;
  if p_gone then delete from push_subs where endpoint = p_endpoint;
  elsif p_ok then update push_subs set fails = 0 where endpoint = p_endpoint;
  else
    update push_subs set fails = fails + 1 where endpoint = p_endpoint;
    delete from push_subs where endpoint = p_endpoint and fails >= 5;
  end if;
end $$;

revoke all on function public.push_subscribe(text, text, int, int), public.push_unsubscribe(text), public.push_interval(text, int),
  public.push_due(text, boolean), public.push_result(text, text, boolean, boolean) from public;
grant execute on function public.push_subscribe(text, text, int, int), public.push_unsubscribe(text), public.push_interval(text, int),
  public.push_due(text, boolean), public.push_result(text, text, boolean, boolean) to anon, authenticated;
