import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CardPreview, CardData } from '@/components/wizard/CardPreview';
import { toast } from 'sonner';

interface LoyaltyCard {
  id: string;
  business_name: string;
  business_segment: string;
  business_phone: string;
  business_email: string;
  business_address?: string;
  social_network?: string;
  logo_url: string;
  public_code?: string;
  primary_color: string;
  background_color: string;
  background_pattern: string;
  seal_shape: string;
  seal_count: number;
  reward_description: string;
  instructions: string;
  is_active: boolean;
}

const PublicCardPage = () => {
  const { publicCode } = useParams<{ publicCode: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<LoyaltyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (!publicCode) {
      setError('Código do cartão inválido.');
      setLoading(false);
      return;
    }

    const fetchCard = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('loyalty_cards')
          .select('*')
          .eq('public_code', publicCode)
          .eq('is_active', true)
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

  const handleParticipate = () => {
    if (!agreedToTerms) {
      toast.error('Deve concordar com os termos para poder participar.');
      return;
    }
    navigate(`/card/${publicCode}/signup`);
  };
  
  // Renderização de Ecrã de Carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">A carregar o cartão...</p>
        </div>
      </div>
    );
  }

  // Renderização de Ecrã de Erro
  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle className="text-center text-destructive">Ocorreu um Erro</CardTitle></CardHeader>
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

  // Se tudo correr bem, renderiza a página do cartão
  const cardData: CardData = {
    logo_url: card.logo_url,
    business_name: card.business_name,
    reward_description: card.reward_description,
    primary_color: card.primary_color,
    backgroundColor: card.background_color,
    pattern: card.background_pattern as any,
    clientCode: '',
    phone: card.business_phone,
    email: card.business_email,
    address: card.business_address,
    socialNetwork: card.social_network,
    sealCount: card.seal_count,
    sealShape: card.seal_shape as any,
    instructions: card.instructions,
  };

  return (
    <div className="min-h-screen bg-gradient-hero-new">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
              Cartão de Fidelidade {card.business_name}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Gostaria de aderir ao nosso cartão de fidelidade para acumular selos e ganhar recompensas fantásticas?
            </p>
          </div>
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardPreview cardData={cardData} size="lg" className="shadow-elegant" />
          </div>
          <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              Adira agora!
            </h2>
          </div>
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Card className="w-full max-w-lg bg-white/95 backdrop-blur-lg border-0 shadow-elegant rounded-3xl">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-start space-x-4">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className="mt-1 border-2 border-primary data-[state=checked]:bg-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-foreground leading-relaxed cursor-pointer font-medium">
                    Concordo em participar na promoção e fazer parte do cartão de fidelidade {card.business_name}, e em receber comunicações sobre o programa.
                  </label>
                </div>
                <div className="space-y-4">
                  <Button 
                    onClick={handleParticipate}
                    disabled={!agreedToTerms}
                    variant="hero"
                    size="lg"
                    className="w-full h-14 text-lg font-bold shadow-glow"
                  >
                    Quero Aderir!
                  </Button>
                  <Button variant="link" onClick={() => navigate('/')} className="w-full h-12">
                    Não, obrigado
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicCardPage;
