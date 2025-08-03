
-- 1.1 Adicionar campos necessários à tabela loyalty_cards existente
ALTER TABLE loyalty_cards ADD COLUMN public_code VARCHAR(6) UNIQUE;
ALTER TABLE loyalty_cards ADD COLUMN qr_code_url TEXT;
ALTER TABLE loyalty_cards ADD COLUMN public_url TEXT;

-- 1.2 Criar tabela de cartões individuais dos clientes
CREATE TABLE customer_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loyalty_card_id UUID REFERENCES loyalty_cards(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  card_code VARCHAR(8) UNIQUE, -- Código único do cartão do cliente (4 letras + 4 números)
  qr_code_url TEXT, -- QR code específico do cartão do cliente
  current_seals INTEGER DEFAULT 0,
  total_rewards_earned INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(loyalty_card_id, customer_id) -- Cada cliente pode ter apenas 1 cartão por estabelecimento
);

-- 1.3 Criar tabela de participações (registro quando cliente se inscreve)
CREATE TABLE card_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loyalty_card_id UUID REFERENCES loyalty_cards(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  agreed_to_terms BOOLEAN DEFAULT true,
  participated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(loyalty_card_id, customer_id) -- Cada cliente participa apenas 1 vez por cartão
);

-- 1.4 Criar tabela de transações de selos (histórico)
CREATE TABLE seal_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_card_id UUID REFERENCES customer_cards(id) ON DELETE CASCADE,
  business_owner_id UUID REFERENCES profiles(user_id), -- Quem deu os selos
  seals_given INTEGER NOT NULL,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT -- Observações opcionais do lojista
);

-- 1.5 Habilitar RLS (Row Level Security) em todas as novas tabelas
ALTER TABLE customer_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE seal_transactions ENABLE ROW LEVEL SECURITY;

-- 1.6 Criar políticas RLS para customer_cards
-- Clientes podem ver apenas seus próprios cartões
CREATE POLICY "Customers can view their own cards" 
  ON customer_cards 
  FOR SELECT 
  USING (customer_id = auth.uid());

-- Lojistas podem ver cartões de seus estabelecimentos
CREATE POLICY "Business owners can view cards of their loyalty programs" 
  ON customer_cards 
  FOR SELECT 
  USING (loyalty_card_id IN (SELECT id FROM loyalty_cards WHERE user_id = auth.uid()));

-- Apenas participações podem criar novos cartões (via Edge Function)
CREATE POLICY "Allow inserts for new participations" 
  ON customer_cards 
  FOR INSERT 
  WITH CHECK (true); -- Controlado por Edge Function

-- Lojistas podem atualizar cartões de seus estabelecimentos (para selos)
CREATE POLICY "Business owners can update cards of their loyalty programs" 
  ON customer_cards 
  FOR UPDATE 
  USING (loyalty_card_id IN (SELECT id FROM loyalty_cards WHERE user_id = auth.uid()));

-- 1.7 Criar políticas RLS para card_participations
-- Clientes podem ver suas próprias participações
CREATE POLICY "Customers can view their own participations" 
  ON card_participations 
  FOR SELECT 
  USING (customer_id = auth.uid());

-- Lojistas podem ver participações em seus cartões
CREATE POLICY "Business owners can view participations in their cards" 
  ON card_participations 
  FOR SELECT 
  USING (loyalty_card_id IN (SELECT id FROM loyalty_cards WHERE user_id = auth.uid()));

-- Permitir inserção de novas participações (via Edge Function)
CREATE POLICY "Allow inserts for new participations" 
  ON card_participations 
  FOR INSERT 
  WITH CHECK (true); -- Controlado por Edge Function

-- 1.8 Criar políticas RLS para seal_transactions
-- Clientes podem ver transações de seus cartões
CREATE POLICY "Customers can view transactions of their cards" 
  ON seal_transactions 
  FOR SELECT 
  USING (customer_card_id IN (SELECT id FROM customer_cards WHERE customer_id = auth.uid()));

-- Lojistas podem ver transações que eles fizeram
CREATE POLICY "Business owners can view their own transactions" 
  ON seal_transactions 
  FOR SELECT 
  USING (business_owner_id = auth.uid());

-- Lojistas podem inserir novas transações
CREATE POLICY "Business owners can create seal transactions" 
  ON seal_transactions 
  FOR INSERT 
  WITH CHECK (business_owner_id = auth.uid());

-- 1.9 Criar triggers para updated_at nas novas tabelas
CREATE TRIGGER update_customer_cards_updated_at
  BEFORE UPDATE ON customer_cards
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 1.10 Criar índices para performance
CREATE INDEX idx_customer_cards_loyalty_card_id ON customer_cards(loyalty_card_id);
CREATE INDEX idx_customer_cards_customer_id ON customer_cards(customer_id);
CREATE INDEX idx_customer_cards_card_code ON customer_cards(card_code);
CREATE INDEX idx_card_participations_loyalty_card_id ON card_participations(loyalty_card_id);
CREATE INDEX idx_seal_transactions_customer_card_id ON seal_transactions(customer_card_id);
CREATE INDEX idx_loyalty_cards_public_code ON loyalty_cards(public_code);
