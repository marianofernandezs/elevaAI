create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  full_name text not null,
  profession text,
  industry text,
  country text,
  years_of_experience int,
  target_audience text,
  career_goal text,
  personal_brand_goal text,
  communication_style text,
  content_topics text,
  linkedin_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.generated_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  hook text,
  content text not null,
  hashtags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  post_type text,
  goal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  angle text,
  description text,
  pillar text,
  created_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  file_name text not null,
  storage_path text not null,
  extracted_text text,
  created_at timestamptz not null default now()
);

create table if not exists public.skill_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  competitiveness_score int not null default 0 check (competitiveness_score between 0 and 100),
  current_skills text[] not null default '{}',
  missing_skills text[] not null default '{}',
  emerging_skills text[] not null default '{}',
  strengths text[] not null default '{}',
  weaknesses text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.learning_roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  horizon text not null check (horizon in ('30 días', '90 días', '6 meses')),
  skill text not null,
  priority text not null check (priority in ('Alta', 'Media', 'Baja')),
  reason text not null,
  expected_impact text not null,
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
alter table public.generated_posts enable row level security;
alter table public.content_ideas enable row level security;
alter table public.resumes enable row level security;
alter table public.skill_assessments enable row level security;
alter table public.learning_roadmaps enable row level security;

create policy "user_profiles_select_own" on public.user_profiles
for select using (auth.uid() = user_id);

create policy "user_profiles_insert_own" on public.user_profiles
for insert with check (auth.uid() = user_id);

create policy "user_profiles_update_own" on public.user_profiles
for update using (auth.uid() = user_id);

create policy "generated_posts_all_own" on public.generated_posts
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "content_ideas_all_own" on public.content_ideas
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "resumes_all_own" on public.resumes
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "skill_assessments_all_own" on public.skill_assessments
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "learning_roadmaps_all_own" on public.learning_roadmaps
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

create trigger set_generated_posts_updated_at
before update on public.generated_posts
for each row execute function public.set_updated_at();
