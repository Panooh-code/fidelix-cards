import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CardPreview, CardData } from '@/components/wizard/CardPreview';
import { getFidelixImageUrls } from '@/utils/uploadImages';
import { toast } from 'sonner';

interface LoyaltyCard {
  id: string;
  business_name: string;
  business_segment: string;
  business_phone: string;
  business_email: string;
  business_address?: string;
  social_network?: string;
  is_whatsapp: boolean;
  logo_url: string;
  client_code: string;
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
  const imageUrls = getFidelixImageUrls();

  useEffect(() => {
    if (publicCode) {
      fetchCard();
    }
  }, [publicCode]);

  const fetchCard = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_cards')
        .select('*')
        .eq('public_code', publicCode)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching card:', error);
        setError('Cartão não encontrado ou inativo');
        return;
      }

      setCard(data);
    } catch (error) {
      console.error('Error fetching card:', error);
      setError('Erro ao carregar cartão');
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = () => {
    if (!agreedToTerms) {
      toast.error('Você deve concordar com os termos para participar');
      return;
    }
    navigate(`/card/${publicCode}/signup`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando cartão...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">
              Cartão não encontrado
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {error || 'Este cartão não existe ou não está mais ativo.'}
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
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
    clientCode: card.client_code,
    phone: card.business_phone,
    email: card.business_email,
    address: card.business_address,
    socialNetwork: card.social_network,
    sealCount: card.seal_count,
    sealShape: card.seal_shape as any,
    instructions: card.instructions,
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <img 
                src={imageUrls.logoIcon} 
                alt="Fidelix mascote" 
                className="w-8 h-8"
              />
              <img 
                src={imageUrls.logoText} 
                alt="Fidelix" 
                className="h-6"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Cartão de Fidelidade
            </h1>
            <p className="text-lg text-muted-foreground">
              {card.business_name}
            </p>
            <p className="text-muted-foreground">
              Quer participar do nosso cartão de fidelidade para colecionar selos e conquistar recompensas incríveis?
            </p>
          </div>

          {/* Card Preview */}
          <div className="flex justify-center">
            <CardPreview 
              cardData={cardData} 
              size="lg"
              className="max-w-sm"
            />
          </div>

          {/* Participation Form */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                Participe agora!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className="mt-1"
                  />
                  <label 
                    htmlFor="terms" 
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    Concordo em participar da promoção e fazer parte do clube/cartão de fidelidade <strong>{card.business_name}</strong> e receber comunicação referente ao programa.
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleParticipate}
                  disabled={!agreedToTerms}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  Quero Participar!
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="w-full text-muted-foreground"
                >
                  Não, obrigado
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PublicCardPage;