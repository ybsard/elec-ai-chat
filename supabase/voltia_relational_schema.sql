-- Voltia relational storage schema.
-- Execute this in Supabase SQL Editor before switching the application away from the legacy app_state blob.

create table if not exists public.voltia_users (
  id text primary key,
  name text not null default '',
  email text not null unique,
  password_hash text not null,
  plan text not null default 'free',
  subscription_status text not null default 'free',
  usage jsonb,
  last_feature text,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.voltia_sessions (
  token text primary key,
  user_id text references public.voltia_users(id) on delete cascade,
  access_pass boolean not null default false,
  name text,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.voltia_projects (
  id text primary key,
  user_id text not null references public.voltia_users(id) on delete cascade,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.voltia_reports (
  id text primary key,
  user_id text not null references public.voltia_users(id) on delete cascade,
  project_id text references public.voltia_projects(id) on delete set null,
  title text not null default 'Rapport Voltia',
  preview text not null default '',
  html text not null default '',
  conversation jsonb not null default '[]'::jsonb,
  export_version integer not null default 2,
  created_at timestamptz not null default now()
);

create table if not exists public.voltia_usage_events (
  id bigserial primary key,
  user_id text references public.voltia_users(id) on delete set null,
  client_key text,
  feature text not null,
  created_at timestamptz not null default now()
);

create index if not exists voltia_sessions_user_id_idx on public.voltia_sessions(user_id);
create index if not exists voltia_sessions_expires_at_idx on public.voltia_sessions(expires_at);
create index if not exists voltia_projects_user_id_idx on public.voltia_projects(user_id);
create index if not exists voltia_reports_user_id_created_at_idx on public.voltia_reports(user_id, created_at desc);
create index if not exists voltia_reports_project_id_idx on public.voltia_reports(project_id);
create index if not exists voltia_usage_events_user_id_created_at_idx on public.voltia_usage_events(user_id, created_at desc);

alter table public.voltia_users enable row level security;
alter table public.voltia_sessions enable row level security;
alter table public.voltia_projects enable row level security;
alter table public.voltia_reports enable row level security;
alter table public.voltia_usage_events enable row level security;

-- The Node backend uses SUPABASE_SERVICE_ROLE_KEY only on the server.
-- Do not expose these tables directly to the browser. Policies are intentionally restrictive.
