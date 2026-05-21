create type public.application_status as enum (
  'wishlist',
  'applied',
  'interviewing',
  'offer',
  'rejected',
  'archived'
);

create type public.work_mode as enum (
  'remote',
  'hybrid',
  'on-site',
  'unknown'
);

create table public.candidate_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  headline text not null default '',
  summary text not null default '',
  skills text[] not null default '{}',
  project_bullets text[] not null default '{}',
  education text not null default '',
  languages text[] not null default '{}',
  links jsonb not null default '[]'::jsonb,
  preferred_roles text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  role_title text not null,
  location text,
  work_mode public.work_mode not null default 'unknown',
  job_url text,
  status public.application_status not null default 'wishlist',
  deadline date,
  notes text not null default '',
  contact_name text,
  salary text,
  skills text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_descriptions (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.applications(id) on delete cascade,
  raw_text text not null,
  extracted_skills text[] not null default '{}',
  responsibilities text[] not null default '{}',
  keywords text[] not null default '{}',
  seniority_level text not null default 'unknown',
  language_requirements text[] not null default '{}',
  parsed_at timestamptz not null default now()
);

create table public.match_reports (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  matched_skills text[] not null default '{}',
  missing_skills text[] not null default '{}',
  score integer not null check (score >= 0 and score <= 100),
  recommendations text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.interview_prep (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.applications(id) on delete cascade,
  technical_questions text[] not null default '{}',
  behavioral_questions text[] not null default '{}',
  company_questions text[] not null default '{}',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applications_user_status_idx on public.applications(user_id, status);
create index applications_user_deadline_idx on public.applications(user_id, deadline);
create index job_descriptions_application_idx on public.job_descriptions(application_id);
create index match_reports_application_created_idx on public.match_reports(application_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger candidate_profiles_set_updated_at
before update on public.candidate_profiles
for each row execute function public.set_updated_at();

create trigger applications_set_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

create trigger interview_prep_set_updated_at
before update on public.interview_prep
for each row execute function public.set_updated_at();

alter table public.candidate_profiles enable row level security;
alter table public.applications enable row level security;
alter table public.job_descriptions enable row level security;
alter table public.match_reports enable row level security;
alter table public.interview_prep enable row level security;

create policy "candidate profiles are owned by user"
on public.candidate_profiles
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "applications are owned by user"
on public.applications
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "job descriptions follow application ownership"
on public.job_descriptions
for all
using (
  exists (
    select 1
    from public.applications
    where applications.id = job_descriptions.application_id
      and applications.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.applications
    where applications.id = job_descriptions.application_id
      and applications.user_id = auth.uid()
  )
);

create policy "match reports follow application ownership"
on public.match_reports
for all
using (
  exists (
    select 1
    from public.applications
    where applications.id = match_reports.application_id
      and applications.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.applications
    where applications.id = match_reports.application_id
      and applications.user_id = auth.uid()
  )
);

create policy "interview prep follows application ownership"
on public.interview_prep
for all
using (
  exists (
    select 1
    from public.applications
    where applications.id = interview_prep.application_id
      and applications.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.applications
    where applications.id = interview_prep.application_id
      and applications.user_id = auth.uid()
  )
);
