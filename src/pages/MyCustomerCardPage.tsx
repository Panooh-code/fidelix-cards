import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, QrCode, MessageCircle, Clock, Award, RotateCcw, Info, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CardPreview, CardData } from '@/components/wizard/CardPreview';
import { getFidelixImageUrls } from '@/utils/uploadImages';
import { toast } from 'sonner';

interface CustomerCardInfo {
  cardCode: string;
  qrCodeUrl: string;
  customerCardId: string;
  currentSeals: number;
  totalRewardsEarned: number;
  isActive: boolean;
  createdAt: string;
  loyaltyCard: {
    businessName: string;
    businessSegment: string;
    businessPhone: string;
    businessEmail: string;
    businessAddress?: string;
    socialNetwork?: string;
    isWhatsapp: boolean;
    logoUrl: string;
    primaryColor: string;
    backgroundColor: string;
    backgroundPattern: string;
    sealShape: string;
    sealCount: number;
    rewardDescription: string;
    instructions: string;
  };
  recentTransactions: Array<{
    id: string;
    sealsGiven: number;
    transactionDate: string;
    notes?: string;
  }>;
}

const MyCustomerCardPage = () => {
  const { cardCode } = useParams<{ cardCode: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [cardInfo, setCardInfo] = useState<CustomerCardInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const imageUrls = getFidelixImageUrls();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (user && cardCode) {
      fetchCardInfo();
    }
}, [user, authLoading, cardCode, navigate]);

  // Realtime updates for this card (seals and transactions)
  useEffect(() => {
    if (!cardInfo?.customerCardId) return;
    const channel = supabase
      .channel(`my-card-${cardInfo.customerCardId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'customer_cards', filter: `id=eq.${cardInfo.customerCardId}` }, () => {
        fetchCardInfo();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'seal_transactions', filter: `customer_card_id=eq.${cardInfo.customerCardId}` }, () => {
        fetchCardInfo();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cardInfo?.customerCardId]);

  const fetchCardInfo = async () => {
    try {
      
      
      // First get the customer card with a simpler query to debug
      const { data: customerCard, error: cardError } = await supabase
        .from('customer_cards')
        .select(`
          *,
          loyalty_cards(*)
        `)
        .eq('card_code', cardCode)
        .eq('customer_id', user?.id)
        .maybeSingle();

      

      if (cardError) {
        console.error('Error fetching customer card:', cardError);
        
        setError('Cartão não encontrado ou você não tem permissão para visualizá-lo');
        return;
      }

      if (!customerCard) {
        console.error('No customer card data returned');
        setError('Cartão não encontrado');
        return;
      }

      // Get recent transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('seal_transactions')
        .select('*')
        .eq('customer_card_id', customerCard.id)
        .order('transaction_date', { ascending: false })
        .limit(10);

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
        // Don't fail the whole page for transactions error
      }

      const loyaltyCard = customerCard.loyalty_cards;
      
setCardInfo({
        cardCode: customerCard.card_code,
        qrCodeUrl: customerCard.qr_code_url,
        customerCardId: customerCard.id,
        currentSeals: customerCard.current_seals,
        totalRewardsEarned: customerCard.total_rewards_earned,
        isActive: customerCard.is_active,
        createdAt: customerCard.created_at,
        loyaltyCard: {
          businessName: loyaltyCard.business_name,
          businessSegment: loyaltyCard.business_segment,
          businessPhone: loyaltyCard.business_phone,
          businessEmail: loyaltyCard.business_email,
          businessAddress: loyaltyCard.business_address,
          socialNetwork: loyaltyCard.social_network,
          isWhatsapp: loyaltyCard.is_whatsapp,
          logoUrl: loyaltyCard.logo_url,
          primaryColor: loyaltyCard.primary_color,
          backgroundColor: loyaltyCard.background_color,
          backgroundPattern: loyaltyCard.background_pattern,
          sealShape: loyaltyCard.seal_shape,
          sealCount: loyaltyCard.seal_count,
          rewardDescription: loyaltyCard.reward_description,
          instructions: loyaltyCard.instructions,
        },
        recentTransactions: (transactions || []).map(t => ({
          id: t.id,
          sealsGiven: t.seals_given,
          transactionDate: t.transaction_date,
          notes: t.notes
        }))
      });

    } catch (error) {
      console.error('Error fetching card info:', error);
      setError('Erro ao carregar informações do cartão');
    } finally {
      setLoading(false);
    }
  };

  const handleShareCard = () => {
    const text = `Confira meu cartão de fidelidade da ${cardInfo?.loyaltyCard.businessName}!`;
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'Meu Cartão de Fidelidade',
        text,
        url
      });
    } else {
      // Fallback to WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando cartão...</p>
        </div>
      </div>
    );
  }

  if (error || !cardInfo) {
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
              {error || 'Este cartão não existe ou você não tem permissão para visualizá-lo.'}
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/my-customer-cards')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos meus cartões
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cardData: CardData = {
    logo_url: cardInfo.loyaltyCard.logoUrl,
    business_name: cardInfo.loyaltyCard.businessName,
    reward_description: cardInfo.loyaltyCard.rewardDescription,
    primary_color: cardInfo.loyaltyCard.primaryColor,
    backgroundColor: cardInfo.loyaltyCard.backgroundColor,
    clientCode: cardInfo.cardCode,
    phone: cardInfo.loyaltyCard.businessPhone,
    email: cardInfo.loyaltyCard.businessEmail,
    address: cardInfo.loyaltyCard.businessAddress,
    whatsapp: cardInfo.loyaltyCard.isWhatsapp ? cardInfo.loyaltyCard.businessPhone : undefined,
    socialNetwork: cardInfo.loyaltyCard.socialNetwork,
    sealCount: cardInfo.loyaltyCard.sealCount,
    instructions: cardInfo.loyaltyCard.instructions,
    qrCodeUrl: cardInfo.qrCodeUrl,
    currentSeals: cardInfo.currentSeals,
  };

  

  const progressPercentage = (cardInfo.currentSeals / cardInfo.loyaltyCard.sealCount) * 100;
  const sealsRemaining = cardInfo.loyaltyCard.sealCount - cardInfo.currentSeals;

  return (
    <div className="min-h-screen bg-gradient-subtle">

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Meu Cartão de Fidelidade
            </h1>
            <p className="text-lg text-muted-foreground">
              {cardInfo.loyaltyCard.businessName}
            </p>
            <Badge variant={cardInfo.isActive ? "default" : "secondary"}>
              {cardInfo.isActive ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Progresso dos Selos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Selos coletados:</span>
                  <span className="font-medium">
                    {cardInfo.currentSeals} de {cardInfo.loyaltyCard.sealCount}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {sealsRemaining > 0 ? (
                    `Faltam ${sealsRemaining} selos para sua recompensa`
                  ) : (
                    'Parabéns! Você pode resgatar sua recompensa!'
                  )}
                </div>
              </div>
              
              {cardInfo.totalRewardsEarned > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Total de recompensas conquistadas: <span className="font-medium">{cardInfo.totalRewardsEarned}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meu Cartão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Meu Cartão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-3">
                <div className="w-72 h-72 flex items-center justify-center">
                  <CardPreview 
                    cardData={{
                      ...cardData,
                      qrCodeUrl: cardInfo.qrCodeUrl,
                      clientCode: cardInfo.cardCode
                    }} 
                    size="md"
                    isFlipped={isFlipped}
                    showFlipButton={false}
                  />
                </div>
                
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 text-muted-foreground border border-border rounded-full transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3 h-3" />
                  Girar cartão
                </button>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Seu QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex justify-center">
                <img 
                  src={cardInfo.qrCodeUrl} 
                  alt="QR Code do cartão"
                  className="w-32 h-32 border rounded-lg"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Mostre este QR Code para o estabelecimento ganhar seus selos
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                Código: {cardInfo.cardCode}
              </p>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          {cardInfo.recentTransactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Histórico Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cardInfo.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          +{transaction.sealsGiven} selo{transaction.sealsGiven > 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.transactionDate).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {transaction.notes && (
                          <p className="text-xs text-muted-foreground italic">
                            {transaction.notes}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">
                        {transaction.sealsGiven}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Message */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-lg font-semibold mb-2">
                {sealsRemaining > 0 ? (
                  `Junte mais ${sealsRemaining} selos para completar o cartão`
                ) : (
                  '🎉 Parabéns! Você pode resgatar sua recompensa!'
                )}
              </div>
              <p className="text-muted-foreground">
                Continue visitando <strong>{cardInfo.loyaltyCard.businessName}</strong> para ganhar mais selos
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MyCustomerCardPage;