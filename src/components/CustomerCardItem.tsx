import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QrCode, ExternalLink, Star, Heart, Circle } from 'lucide-react';

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

interface CustomerCardItemProps {
  card: CustomerCard;
  onViewCard: () => void;
  onShowQRCode: () => void;
}

const CustomerCardItem = ({ card, onViewCard, onShowQRCode }: CustomerCardItemProps) => {
  const { loyalty_cards: loyaltyCard } = card;
  const progress = (card.current_seals / loyaltyCard.seal_count) * 100;
  const sealsRemaining = loyaltyCard.seal_count - card.current_seals;

  const getSealIcon = () => {
    switch (loyaltyCard.seal_shape) {
      case 'heart':
        return Heart;
      case 'circle':
        return Circle;
      default:
        return Star;
    }
  };

  const SealIcon = getSealIcon();

  const getStatusBadge = () => {
    if (!card.is_active || !loyaltyCard.is_active) {
      return <Badge variant="secondary">Inativo</Badge>;
    }
    if (card.current_seals >= loyaltyCard.seal_count) {
      return <Badge className="bg-green-500 hover:bg-green-600">Recompensa Disponível</Badge>;
    }
    return <Badge variant="outline">Ativo</Badge>;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={loyaltyCard.logo_url}
              alt={`Logo ${loyaltyCard.business_name}`}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-lg">{loyaltyCard.business_name}</h3>
              <p className="text-sm text-muted-foreground">{loyaltyCard.business_segment}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SealIcon 
                className="h-4 w-4" 
                style={{ color: loyaltyCard.primary_color }}
                fill={loyaltyCard.primary_color}
              />
              <span className="text-sm font-medium">
                {card.current_seals} de {loyaltyCard.seal_count} selos
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {sealsRemaining > 0 ? `Faltam ${sealsRemaining}` : 'Completo!'}
            </span>
          </div>

          <Progress 
            value={progress} 
            className="h-2"
            style={{
              '--progress-background': loyaltyCard.primary_color
            } as React.CSSProperties}
          />

          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Recompensa:</span> {loyaltyCard.reward_description}
          </div>

          {card.total_rewards_earned > 0 && (
            <div className="text-sm text-emerald-600">
              🎉 {card.total_rewards_earned} recompensa(s) conquistada(s)
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={onViewCard} className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
          <Button variant="outline" onClick={onShowQRCode} size="icon">
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCardItem;