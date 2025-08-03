import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CardPreview, type CardData } from '@/components/wizard/CardPreview';
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

  // Debug: Log dos dados do cartão
  console.log('Card data from DB:', card);
  
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
    whatsapp: card.is_whatsapp ? card.business_phone : undefined,
    sealCount: card.seal_count,
    sealShape: card.seal_shape as any,
    instructions: card.instructions,
  };
  
  // Debug: Log dos dados mapeados
  console.log('Mapped cardData:', cardData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-purple-100/50">
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-fidelix-purple hover:bg-fidelix-purple/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToHome')}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border border-white/40 shadow-elegant">
          <CardContent className="p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-fidelix-purple mb-4 animate-fade-in">
                {t('loyaltyCard')} {cardData.business_name}
              </h1>
              <p className="text-fidelix-purple/70 text-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {t('subtitle')}
              </p>
            </div>

            <div className="my-8 border-t border-fidelix-purple/20" />

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

            {/* Terms and Actions */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white/50 backdrop-blur rounded-xl p-6 border border-fidelix-purple/20">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-1 border-fidelix-purple/30 data-[state=checked]:bg-fidelix-purple"
                  />
                  <label htmlFor="terms" className="text-sm text-fidelix-purple/80 leading-relaxed cursor-pointer">
                    {t('terms')}
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleParticipate}
                  className="bg-gradient-to-r from-fidelix-purple to-fidelix-purple-dark hover:from-fidelix-purple-dark hover:to-fidelix-purple text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  {t('ctaPrimary')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="border-fidelix-purple/30 text-fidelix-purple hover:bg-fidelix-purple/10 px-8 py-3 rounded-xl transition-all duration-300"
                  size="lg"
                >
                  {t('decline')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicCardPage;