import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CardPreview, CardData } from '@/components/wizard/CardPreview';
import { getFidelixImageUrls } from '@/utils/uploadImages';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

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
  public_code?: string;
  qr_code_url?: string;
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
  const [isFlipped, setIsFlipped] = useState(false);
  const imageUrls = getFidelixImageUrls();
  const { t } = useTranslations(card?.business_name);

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
        setError(t('cardNotFound'));
        return;
      }

      setCard(data);
    } catch (error) {
      console.error('Error fetching card:', error);
      setError(t('cardNotFound'));
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = () => {
    if (!agreedToTerms) {
      toast.error(t('agreeToTermsError'));
      return;
    }
    navigate(`/card/${publicCode}/signup`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('loading')}</p>
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
              {t('cardNotFound')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {error || t('cardNotFoundMessage')}
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToHome')}
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
    <div className="min-h-screen bg-gradient-hero-new">
      {/* Header Redesigned */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-border/20 shadow-elegant">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('back')}
            </Button>
            
            <div 
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate('/')}
            >
              <img 
                src={imageUrls.logoText} 
                alt="Fidelix" 
                className="h-10"
              />
            </div>
            
            <div className="w-16" /> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Title Section */}
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              {t('subtitle')}
            </p>
          </div>

          {/* Card Display */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="hover:scale-105 transition-transform duration-300">
              <CardPreview 
                cardData={cardData} 
                size="lg"
                className="shadow-elegant"
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              {t('ctaIntermediate')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-fidelix-yellow to-accent mx-auto rounded-full shadow-glow"></div>
          </div>

          {/* Participation Form */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Card className="w-full max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-0 shadow-elegant rounded-3xl">
              <CardContent className="p-8 space-y-8">
                {/* Terms Checkbox */}
                <div className="flex items-start space-x-4">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className="mt-1 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label 
                    htmlFor="terms" 
                    className="text-sm text-foreground leading-relaxed cursor-pointer font-medium"
                  >
                    {t('terms')}
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button 
                    onClick={handleParticipate}
                    disabled={!agreedToTerms}
                    variant="hero"
                    size="lg"
                    className="w-full h-14 text-lg font-bold shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('ctaPrimary')}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/')}
                    className="w-full h-12 border-2 hover:bg-muted/50"
                    size="lg"
                  >
                    {t('decline')}
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