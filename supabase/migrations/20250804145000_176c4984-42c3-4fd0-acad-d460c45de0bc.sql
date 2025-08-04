-- Criar política RLS para permitir acesso público a cartões ativos e publicados
CREATE POLICY "Public access to active published cards" 
ON public.loyalty_cards 
FOR SELECT 
TO public
USING (is_active = true AND is_published = true);