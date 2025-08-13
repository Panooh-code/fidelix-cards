-- Enable realtime on customer_cards and seal_transactions
-- Ensure full row data for updates
ALTER TABLE public.customer_cards REPLICA IDENTITY FULL;
ALTER TABLE public.seal_transactions REPLICA IDENTITY FULL;

-- Add tables to supabase_realtime publication (idempotent)
DO $$
BEGIN
  BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_cards';
  EXCEPTION WHEN duplicate_object THEN
    -- already added
    NULL;
  END;
  BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.seal_transactions';
  EXCEPTION WHEN duplicate_object THEN
    -- already added
    NULL;
  END;
END $$;