create extension if not exists pgcrypto;

create table if not exists public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 80),
  message text not null check (char_length(trim(message)) between 1 and 500),
  delete_token text not null check (char_length(delete_token) >= 32),
  created_at timestamptz not null default now()
);

create index if not exists guestbook_messages_created_at_idx
  on public.guestbook_messages (created_at desc);

alter table public.guestbook_messages enable row level security;

revoke all on public.guestbook_messages from anon, authenticated;
grant select (id, name, message, created_at), insert (name, message, delete_token)
  on public.guestbook_messages to anon, authenticated;

drop policy if exists "Anyone can read guestbook messages" on public.guestbook_messages;
create policy "Anyone can read guestbook messages"
  on public.guestbook_messages for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can post guestbook messages" on public.guestbook_messages;
create policy "Anyone can post guestbook messages"
  on public.guestbook_messages for insert
  to anon, authenticated
  with check (char_length(trim(name)) between 1 and 80 and char_length(trim(message)) between 1 and 500);

create or replace function public.delete_guestbook_message(p_message_id uuid, p_delete_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  removed integer;
begin
  delete from public.guestbook_messages
  where id = p_message_id
    and delete_token = p_delete_token
    and created_at > now() - interval '10 minutes';
  get diagnostics removed = row_count;
  return removed = 1;
end;
$$;

revoke all on function public.delete_guestbook_message(uuid, text) from public;
grant execute on function public.delete_guestbook_message(uuid, text) to anon, authenticated;
