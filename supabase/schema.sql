create extension if not exists "pgcrypto";

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

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

create table if not exists public.profile_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  professional_summary text not null,
  niche text not null,
  industry_context text not null,
  career_goal_summary text not null,
  linkedin_opportunities text[] not null default '{}',
  priority_skills text[] not null default '{}',
  initial_recommendation text not null,
  positioning_statement text not null,
  top_opportunities text[] not null default '{}',
  recommended_actions text[] not null default '{}',
  created_at timestamptz not null default now()
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

create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  display_name text,
  preferred_language text default 'Español',
  preferred_ai_tone text,
  response_detail_level text default 'normal',
  main_goal text,
  linkedin_frequency text,
  favorite_content_style text,
  preferred_cta_style text,
  theme text default 'system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
alter table public.generated_posts enable row level security;
alter table public.profile_analyses enable row level security;
alter table public.content_ideas enable row level security;
alter table public.resumes enable row level security;
alter table public.skill_assessments enable row level security;
alter table public.learning_roadmaps enable row level security;
alter table public.user_settings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_profiles' and policyname = 'user_profiles_select_own'
  ) then
    create policy "user_profiles_select_own" on public.user_profiles
    for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_profiles' and policyname = 'user_profiles_insert_own'
  ) then
    create policy "user_profiles_insert_own" on public.user_profiles
    for insert with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_profiles' and policyname = 'user_profiles_update_own'
  ) then
    create policy "user_profiles_update_own" on public.user_profiles
    for update using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'generated_posts' and policyname = 'generated_posts_all_own'
  ) then
    create policy "generated_posts_all_own" on public.generated_posts
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profile_analyses' and policyname = 'profile_analyses_all_own'
  ) then
    create policy "profile_analyses_all_own" on public.profile_analyses
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'content_ideas' and policyname = 'content_ideas_all_own'
  ) then
    create policy "content_ideas_all_own" on public.content_ideas
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'resumes' and policyname = 'resumes_all_own'
  ) then
    create policy "resumes_all_own" on public.resumes
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'skill_assessments' and policyname = 'skill_assessments_all_own'
  ) then
    create policy "skill_assessments_all_own" on public.skill_assessments
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'learning_roadmaps' and policyname = 'learning_roadmaps_all_own'
  ) then
    create policy "learning_roadmaps_all_own" on public.learning_roadmaps
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_settings' and policyname = 'user_settings_all_own'
  ) then
    create policy "user_settings_all_own" on public.user_settings
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'resume_storage_select_own'
  ) then
    create policy "resume_storage_select_own" on storage.objects
    for select using (
      bucket_id = 'resumes'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'resume_storage_insert_own'
  ) then
    create policy "resume_storage_insert_own" on storage.objects
    for insert with check (
      bucket_id = 'resumes'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_generated_posts_updated_at on public.generated_posts;
create trigger set_generated_posts_updated_at
before update on public.generated_posts
for each row execute function public.set_updated_at();

drop trigger if exists set_user_settings_updated_at on public.user_settings;
create trigger set_user_settings_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();
