-- Add unique constraint to phone_number in profiles table
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_phone_number_unique UNIQUE (phone_number);

-- Create index for phone_number for optimization (without CONCURRENTLY in migration)
CREATE INDEX idx_profiles_phone_number ON public.profiles (phone_number);

-- Add policy for phone lookup (needed for checking existing users)
CREATE POLICY "Allow phone lookup for authentication" 
ON public.profiles 
FOR SELECT 
TO anon, authenticated
USING (phone_number IS NOT NULL);