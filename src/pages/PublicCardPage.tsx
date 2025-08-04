// CAMINHO DO FICHEIRO: src/pages/PublicCardPage.tsx
// COLE ESTE CÓDIGO COMPLETO

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CardPreview, CardData } from '@/components/wizard/CardPreview';

// Interface para os dados do cartão
interface LoyaltyCard {
  business_name: string;
  business_segment: string;
  business_phone: string;
  business_email: string;
  business_address?: string;
  social_network?: string;
  logo_url: string;
  primary_color: string;
  background_color: string;
  background_pattern: string;
  seal_shape: string;
  seal_count: number;
  reward_description: string;
  instructions: string;
}

const PublicCardPage = () => {
  const { publicCode } = useParams<{ publicCode: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<LoyaltyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Garante que existe um publicCode antes de fazer a chamada
    if (!publicCode) {
      setError('Código do cartão inválido.');
      setLoading(false);
      return;
    }

    const fetchCard = async () => {
      try {
        // A consulta agora usa a tabela 'loyalty_cards', que foi criada pelo script SQL
        const { data, error: dbError } = await supabase
          .from('loyalty_cards')
          .select('*')
          .eq('public_code', publicCode)
          .eq('is_active', true) // A política de RLS já garante isto, mas é uma boa prática
          .single();

        if (dbError || !data) {
          throw new Error('Este cartão não foi encontrado ou já não se encontra ativo.');
        }
        setCard(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [publicCode]);

  // Ecrã de Carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Ecrã de Erro
  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Cartão não encontrado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Página Inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se tudo correr bem, exibe a página
  const cardData: CardData = {
    logo_url: card.logo_url,
    business_name: card.business_name,
    reward_description: card.reward_description,
    primary_color: card.primary_color,
    backgroundColor: card.background_color,
    pattern: card.background_pattern as any,
    clientCode: publicCode!,
    phone: card.business_phone,
    email: card.business_email,
    address: card.business_address,
    socialNetwork: card.social_network,
    sealCount: card.seal_count,
    sealShape: card.seal_shape as any,
    instructions: card.instructions,
  };

  return (
    <div className="min-h-screen bg-gradient-hero-new py-12">
      <main className="container mx-auto px-4">
        <div className="max-w-md mx-auto space-y-8">
            <div className="text-center space-y-4">
                 <h1 className="text-3xl font-bold text-white drop-shadow-lg">Cartão de Fidelidade {card.business_name}</h1>
                 <p className="text-lg text-white/90">Quer participar para colecionar selos e ganhar prémios?</p>
            </div>
            
            <CardPreview cardData={cardData} size="lg" className="shadow-elegant" />

            <Card className="bg-white/95 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle className="text-center">Adira Agora!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-muted-foreground text-sm">
                        Crie uma conta gratuita para guardar os seus selos e nunca mais perder um prémio.
                    </p>
                    <Button
                        onClick={() => navigate(`/card/${publicCode}/signup`)}
                        variant="hero"
                        size="lg"
                        className="w-full"
                    >
                        Quero Participar
                    </Button>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
};

export default PublicCardPage;
