import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, QrCode, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CustomerCardItem from '@/components/CustomerCardItem';
import QRCodeModal from '@/components/QRCodeModal';
import { Skeleton } from '@/components/ui/skeleton';

interface CustomerCard {
  id: string;
  card_code: string;
  qr_code_url: string;
  current_seals: number;
  total_rewards_earned: number;
  is_active: boolean;
  created_at: string;
  loyalty_cards: {
    id: string;
    business_name: string;
    business_segment: string;
    business_phone: string;
    business_address: string;
    logo_url: string;
    seal_count: number;
    reward_description: string;
    primary_color: string;
    background_color: string;
    background_pattern: string;
    seal_shape: string;
    is_active: boolean;
    expiration_date: string | null;
  };
}

const MyCustomerCardsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cards, setCards] = useState<CustomerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQRCode, setSelectedQRCode] = useState<{ url: string; businessName: string } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCustomerCards();
  }, [user, navigate]);

  const fetchCustomerCards = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_cards')
        .select(`
          *,
          loyalty_cards (
            id,
            business_name,
            business_segment,
            business_phone,
            business_address,
            logo_url,
            seal_count,
            reward_description,
            primary_color,
            background_color,
            background_pattern,
            seal_shape,
            is_active,
            expiration_date
          )
        `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Error fetching customer cards:', error);
      toast({
        title: "Erro ao carregar cartões",
        description: "Não foi possível carregar seus cartões de fidelidade.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewCard = (cardCode: string) => {
    navigate(`/my-card/${cardCode}`);
  };

  const handleShowQRCode = (qrCodeUrl: string, businessName: string) => {
    setSelectedQRCode({ url: qrCodeUrl, businessName });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Meus Cartões</h1>
        </div>

        {/* Cards Grid */}
        {cards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhum cartão encontrado</h3>
              <p>Você ainda não participa de nenhum programa de fidelidade.</p>
            </div>
            <Button onClick={() => navigate('/')}>
              Descobrir Cartões
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {cards.map((card) => (
              <CustomerCardItem
                key={card.id}
                card={card}
                onViewCard={() => handleViewCard(card.card_code)}
                onShowQRCode={() => handleShowQRCode(card.qr_code_url, card.loyalty_cards.business_name)}
              />
            ))}
          </div>
        )}

        {/* QR Code Modal */}
        <QRCodeModal
          isOpen={!!selectedQRCode}
          onClose={() => setSelectedQRCode(null)}
          qrCodeUrl={selectedQRCode?.url || ''}
          businessName={selectedQRCode?.businessName || ''}
        />
      </div>
    </div>
  );
};

export default MyCustomerCardsPage;