-- ── FIXING STORAGE RLS FOR IMAGE UPLOADS ──────────────────────────────────
-- Run this script in the Supabase SQL Editor to allow image uploads 
-- for both regular users and the Demo account.

-- 1. Ensure the 'site-assets' bucket exists (if not created manually already)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. (Note: RLS on storage.objects is enabled by default in Supabase)

-- 3. DROP existing policies if any to avoid conflicts during reset
DROP POLICY IF EXISTS "Allow Public View Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow Upload for All Users" ON storage.objects;
DROP POLICY IF EXISTS "Allow Update for All Users" ON storage.objects;
DROP POLICY IF EXISTS "Allow Delete for All Users" ON storage.objects;

-- 4. Create NEW Policies for 'site-assets' bucket

-- A. Allow anyone to VIEW images (Public access)
CREATE POLICY "Allow Public View Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'site-assets' );

-- B. Allow users (including Demo/Anon) to UPLOAD images
CREATE POLICY "Allow Upload for All Users"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'site-assets' );

-- C. Allow users to UPDATE their own uploads (or any in this bucket for simplicity)
CREATE POLICY "Allow Update for All Users"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'site-assets' );

-- D. Allow users to DELETE images
CREATE POLICY "Allow Delete for All Users"
ON storage.objects FOR DELETE
USING ( bucket_id = 'site-assets' );

-- ─────────────────────────────────────────────────────────────────────────────
-- NOTE: These policies are balanced for usability while you are using Clerk.
-- Since the Supabase client is currently unauthenticated (operating as 'anon'),
-- these bucket-level policies ensure that your frontend can successfully 
-- upload and manage hotel photos, room images, and menu items.
