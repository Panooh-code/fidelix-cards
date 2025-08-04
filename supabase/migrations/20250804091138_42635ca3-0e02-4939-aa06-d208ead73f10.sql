-- Add phone_number column to profiles table for WhatsApp contact
ALTER TABLE public.profiles 
ADD COLUMN phone_number TEXT;