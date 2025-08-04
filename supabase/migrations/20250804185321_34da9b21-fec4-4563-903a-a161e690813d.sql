-- Add roles column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN roles text[] DEFAULT '{"customer"}';

-- Create function to add role to user
CREATE OR REPLACE FUNCTION public.add_user_role(user_id_param uuid, role_param text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles 
  SET roles = array_append(roles, role_param)
  WHERE user_id = user_id_param 
    AND NOT (role_param = ANY(roles));
END;
$$;

-- Create function to remove role from user
CREATE OR REPLACE FUNCTION public.remove_user_role(user_id_param uuid, role_param text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles 
  SET roles = array_remove(roles, role_param)
  WHERE user_id = user_id_param;
END;
$$;

-- Create function to check if user has role
CREATE OR REPLACE FUNCTION public.has_user_role(user_id_param uuid, role_param text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = user_id_param 
      AND role_param = ANY(roles)
  );
END;
$$;

-- Migrate existing data
-- Add 'merchant' role to users who have loyalty cards
UPDATE public.profiles 
SET roles = array_append(roles, 'merchant')
WHERE user_id IN (
  SELECT DISTINCT user_id FROM public.loyalty_cards
) AND NOT ('merchant' = ANY(roles));

-- Add 'customer' role to users who have customer cards (if they don't already have it)
UPDATE public.profiles 
SET roles = array_append(roles, 'customer')
WHERE user_id IN (
  SELECT DISTINCT customer_id FROM public.customer_cards
) AND NOT ('customer' = ANY(roles));