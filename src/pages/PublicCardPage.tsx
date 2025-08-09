// CAMINHO DO FICHEIRO: src/pages/PublicCardPage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CardPreview, CardData } from '@/components/wizard/CardPreview';
import { OneClickAdhesionBox } from '@/components/OneClickAdhesionBox';
import { toast } from 'sonner';

interface LoyaltyCard { id: string; business_name: string; reward_description: string; logo_url: string; primary_color: string; background_color: string; background_pattern: string; seal_shape: string; seal_count: number; instructions: string; business_phone: string; business_email: string; public_code?: string; qr_code_url?: string; business_address?: string; social_network?: string; is_whatsapp?: boolean; client_code?: string; }

const PublicCardPage = () => {
  const { publicCode } = useParams<{ publicCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [card, setCard] = useState<LoyaltyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAndCheckData = async () => {
      if (!publicCode) { 
        setError('Código do cartão inválido.'); 
        setLoading(false); 
        return; 
      }

      try {
        const { data: cardData, error: cardError } = await supabase
          .from('loyalty_cards')
          .select('*')
          .eq('public_code', publicCode)
          .maybeSingle();
        
        if (cardError) throw new Error(`Erro na base de dados: ${cardError.message}`);
        if (!cardData) throw new Error('Este cartão não foi encontrado ou já não se encontra ativo.');
        if (!cardData.is_active) throw new Error('Este cartão não está ativo.');

        setCard(cardData as LoyaltyCard);

        // Check if user is already participating
        if (user) {
          const { data: participationData } = await supabase
            .from('customer_cards')
            .select('id')
            .eq('customer_id', user.id)
            .eq('loyalty_card_id', cardData.id)
            .maybeSingle();
            
          if (participationData) {
            toast.info("Já participa neste programa! A redirecionar...");
            navigate('/my-customer-cards');
            return;
          }
        }
      } catch (err: any) { 
        setError(err.message); 
      } finally { 
        setLoading(false); 
      }
    };

    fetchAndCheckData();
  }, [publicCode, user, navigate]);

  // Redirect unauthenticated users to auth page
  useEffect(() => {
    if (!loading && !user && !error) {
      const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
      navigate(`/auth?redirect=${redirectUrl}`);
    }
  }, [loading, user, error, navigate]);

  const handleAdhesionSuccess = () => {
    navigate('/my-customer-cards');
  };

  if (loading) { 
    return (
      <div className="min-h-screen bg-gradient-hero-new flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    ); 
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-hero-new flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center bg-white/95 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-destructive">Ocorreu um Erro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is not authenticated, auth redirect will handle it
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero-new flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

const cardData: CardData = { 
  logo_url: card.logo_url, 
  business_name: card.business_name, 
  reward_description: card.reward_description, 
  primary_color: card.primary_color, 
  backgroundColor: card.background_color, 
  pattern: card.background_pattern as any, 
  clientCode: (card.public_code || card.client_code || ''), 
  phone: card.business_phone, 
  email: card.business_email, 
  address: (card as any).business_address, 
  socialNetwork: (card as any).social_network, 
  whatsapp: card.is_whatsapp ? card.business_phone : undefined,
  sealCount: card.seal_count, 
  sealShape: card.seal_shape as any, 
  instructions: card.instructions,
  qrCodeUrl: card.qr_code_url || undefined,
};

  return (
    <div className="min-h-screen bg-gradient-hero-new py-12">
      <main className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            Cartão de Fidelidade
          </h1>
          <p className="text-white/90 text-lg">
            Olá, {user.user_metadata.full_name || user.email}!
          </p>
          <p className="text-white/80">
            Adira ao programa de fidelidade com apenas um clique
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <CardPreview cardData={cardData} size="md" />
        </div>
        
        <OneClickAdhesionBox
          cardData={cardData}
          publicCode={publicCode!}
          businessName={card.business_name}
          onSuccess={handleAdhesionSuccess}
          userId={user.id}
          showCardPreview={false}
        />
      </main>
    </div>
  );
};

export default PublicCardPage;
