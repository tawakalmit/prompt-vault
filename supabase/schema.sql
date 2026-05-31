-- ============================================
-- Prompt Vault - Supabase Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create prompts table
create table public.prompts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  prompt text not null,
  category text not null,
  image_url text,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_by text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.prompts enable row level security;

-- RLS Policies: Users can only access their own prompts
create policy "Anyone can view all prompts"
  on public.prompts for select
  using (true);

create policy "Users can create their own prompts"
  on public.prompts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own prompts"
  on public.prompts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own prompts"
  on public.prompts for delete
  using (auth.uid() = user_id);

-- Create storage bucket for prompt images
insert into storage.buckets (id, name, public)
values ('prompt-images', 'prompt-images', true);

-- Storage policies
create policy "Users can upload their own images"
  on storage.objects for insert
  with check (
    bucket_id = 'prompt-images' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Anyone can view prompt images"
  on storage.objects for select
  using (bucket_id = 'prompt-images');

create policy "Users can delete their own images"
  on storage.objects for delete
  using (
    bucket_id = 'prompt-images' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
