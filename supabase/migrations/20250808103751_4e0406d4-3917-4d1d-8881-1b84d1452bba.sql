-- Add RLS policy to allow business owners to view profiles of customers who joined their loyalty programs
CREATE POLICY "Business owners can view profiles of their customers"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.customer_cards cc
    JOIN public.loyalty_cards lc ON lc.id = cc.loyalty_card_id
    WHERE cc.customer_id = profiles.user_id
      AND lc.user_id = auth.uid()
  )
);
