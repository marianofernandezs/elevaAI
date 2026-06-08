insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

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
