-- Remove the publicly accessible phone lookup policy for profiles table
-- This policy allowed anyone to read profiles with phone numbers, exposing sensitive personal data

DROP POLICY IF EXISTS "Allow phone lookup for authentication" ON public.profiles;

-- The existing policies already provide proper access control:
-- 1. "Users can view their own profile" - users can see their own data
-- 2. "Business owners can view profiles of their customers" - business owners can see customer data
-- 3. Edge functions use service role and bypass RLS for legitimate operations
-- 4. No public access is needed for phone lookup functionality