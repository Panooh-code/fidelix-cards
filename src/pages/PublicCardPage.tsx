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
import { useTranslations } from '@/hooks/useTranslations';

// A interface permanece a mesma
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

// ========= COMPONENTE FILHO PARA A LÓGICA DE TRADUÇÃO (NOVA ABORDAGEM) =========
// Este componente só será renderizado quando tivermos a certeza de que o 'card' existe.
const CardDisplay = ({ card }: { card: LoyaltyCard }) => {
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const imageUrls = getFidelixImageUrls();
  
  // O hook de tradução é chamado aqui, de forma segura, com os dados do cartão já disponíveis.
  const { t } = useTranslations(card.business_name);

  const handleParticipate = () => {
    if (!agreedToTerms) {
      toast.error(t('agreeToTermsError'));
      return;
    }
    // A lógica de navegação para a página de registo permanece.
    // Futuramente, isto será substituído pelo formulário direto nesta página.
    navigate(`/card/${card.public_code}/signup`);
  };

  const cardData: CardData = {
    logo_url: card.logo_url,
    business_name: card.business_name,
    reward_description: card.reward_description,
    primary_color: card.primary_color,
    backgroundColor: card.background_color,
    pattern: card.background_pattern as any,
    clientCode: '', // Não é necessário para a pré-visualização pública
    phone: card.business_phone,
    email: card.business_email,
    address: card.business_address,
    socialNetwork: card.social_network,
    sealCount: card.seal_count,
    sealShape: card.seal_shape as any,
    instructions: card.instructions,
  };

  return (
    <>
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
              <img src={imageUrls.logoText} alt="Fidelix" className="h-10" />
            </div>
            <div className="w-16" />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="hover:scale-105 transition-transform duration-300">
              <CardPreview cardData={cardData} size="lg" className="shadow-elegant" />
            </div>
          </div>
          <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              {t('ctaIntermediate')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-fidelix-yellow to-accent mx-auto rounded-full shadow-glow"></div>
          </div>
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Card className="w-full max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-0 shadow-elegant rounded-3xl">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-start space-x-4">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className="mt-1 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-foreground leading-relaxed cursor-pointer font-medium">
                    {t('terms')}
                  </label>
                </div>
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
                  <Button variant="outline" onClick={() => navigate('/')} className="w-full h-12 border-2 hover:bg-muted/50" size="lg">
                    {t('decline')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};


// ========= COMPONENTE PRINCIPAL (MAIS LIMPO E ROBUSTO) =========
const PublicCardPage = () => {
  const { publicCode } = useParams<{ publicCode: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<LoyaltyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!publicCode) {
      setError('Código do cartão não encontrado.');
      setLoading(false);
      return;
    }
    
    const fetchCard = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, error: dbError } = await supabase
          .from('loyalty_cards')
          .select('*')
          .eq('public_code', publicCode)
          .eq('is_active', true)
          .single();

        if (dbError) {
          console.error('Erro ao buscar o cartão na base de dados:', dbError.message);
          throw new Error('O cartão que procura não foi encontrado ou está inativo.');
        }
        
        if (!data) {
          throw new Error('Nenhum dado retornado para este cartão.');
        }

        setCard(data);
      } catch (err: any) {
        console.error('Erro no processo de fetch:', err);
        setError(err.message || 'Ocorreu um erro inesperado.');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [publicCode]);

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

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle className="text-center text-destructive">Erro</CardTitle></CardHeader>
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

  // Só renderiza o componente de exibição quando o 'card' está totalmente carregado.
  return (
    <div className="min-h-screen bg-gradient-hero-new">
      <CardDisplay card={card} />
    </div>
  );
};

export default PublicCardPage;