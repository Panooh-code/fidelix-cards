import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, RotateCcw, Info, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CardPreview, CardData } from '@/components/wizard/CardPreview';
import { getFidelixImageUrls } from '@/utils/uploadImages';

interface LoyaltyCard {
  id: string;
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
  is_active: boolean;
}

const PublicCardViewPage = () => {
  const { publicCode } = useParams<{ publicCode: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<LoyaltyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
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
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            
            <Button 
              onClick={() => setIsFlipped(!isFlipped)}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Girar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              {card.business_name}
            </h1>
            <p className="text-lg text-muted-foreground">
              Cartão de Fidelidade
            </p>
          </div>

          {/* Card Preview with Flip Animation */}
          <div className="flex justify-center">
            <div 
              className="relative w-full max-w-sm h-64 cursor-pointer"
              style={{ perspective: '1000px' }}
            >
              <div 
                className={`relative w-full h-full transition-transform duration-700 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of Card */}
                <div 
                  className="absolute inset-0"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <CardPreview 
                    cardData={cardData} 
                    size="lg"
                    className="w-full h-full"
                  />
                </div>
                
                {/* Back of Card */}
                <div 
                  className="absolute inset-0 rotate-y-180"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <Card className="w-full h-full">
                    <CardContent className="p-6 h-full flex flex-col justify-center space-y-4">
                      <div className="text-center">
                        <h3 className="font-bold text-lg mb-4">Informações do Estabelecimento</h3>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-muted-foreground" />
                          <span>{card.business_segment}</span>
                        </div>
                        {card.business_address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{card.business_address}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{card.business_phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{card.business_email}</span>
                        </div>
                        {card.social_network && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <span>{card.social_network}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                Quer participar?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Faça parte do nosso programa de fidelidade e ganhe recompensas incríveis!
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate(`/card/${publicCode}`)}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  Quero Participar!
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  );
};

export default PublicCardViewPage;