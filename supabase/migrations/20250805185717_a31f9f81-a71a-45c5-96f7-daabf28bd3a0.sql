-- Add missing columns to profiles table for complete customer data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS is_whatsapp BOOLEAN DEFAULT false;