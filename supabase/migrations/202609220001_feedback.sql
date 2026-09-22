-- Run in the Soulora Supabase project's SQL editor before enabling the website endpoint.
create table if not exists public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (length(email) <= 254),
  moments text[] not null check (cardinality(moments) between 1 and 2),
  feedback text not null default '' check (char_length(feedback) <= 320),
  platform text not null check (platform in ('iphone', 'android', 'web', 'unsure')),
  research_opt_in boolean not null default false,
  consent_version text not null,
  source text not null default 'soulora-early-access',
  status text not null default 'new' check (status in ('new', 'reviewed', 'contacted')),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.feedback_submissions enable row level security;
alter table public.admin_users enable row level security;

revoke all on public.feedback_submissions from anon, authenticated;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
grant select on public.feedback_submissions to authenticated;
grant update (status) on public.feedback_submissions to authenticated;
grant select, insert on public.feedback_submissions to service_role;

create policy "Admins can see their own membership" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

create policy "Admins can read responses" on public.feedback_submissions
  for select to authenticated using (
    exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  );

create policy "Admins can change review status" on public.feedback_submissions
  for update to authenticated using (
    exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  ) with check (
    exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  );
