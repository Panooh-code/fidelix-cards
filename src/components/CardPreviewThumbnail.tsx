import { useState } from 'react';
import { CardPreview, CardData } from './wizard/CardPreview';
import { RotateCcw } from 'lucide-react';

interface CardPreviewThumbnailProps {
  card: {
    business_name: string;
    business_segment: string;
    client_code: string;
    public_code: string;
    primary_color: string;
    seal_shape: string;
    seal_count: number;
    reward_description: string;
    logo_url?: string;
    background_color?: string;
    background_pattern?: string;
    business_phone?: string;
    business_email?: string;
    business_address?: string;
    social_network?: string;
    instructions?: string;
    qr_code_url?: string;
  };
}

export const CardPreviewThumbnail = ({ card }: CardPreviewThumbnailProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardData: CardData = {
    logo_url: card.logo_url,
    business_name: card.business_name,
    reward_description: card.reward_description,
    primary_color: card.primary_color,
    backgroundColor: card.background_color || '#ffffff',
    clientCode: card.public_code || card.client_code,
    phone: card.business_phone,
    email: card.business_email,
    address: card.business_address,
    socialNetwork: card.social_network,
    sealCount: card.seal_count,
    instructions: card.instructions,
    qrCodeUrl: card.qr_code_url,
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="w-72 h-72 flex items-center justify-center">
        <CardPreview cardData={cardData} size="md" isFlipped={isFlipped} showFlipButton={false} />
      </div>
      <button
        onClick={() => setIsFlipped(!isFlipped)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 text-muted-foreground border border-border rounded-full transition-colors shadow-sm"
      >
        <RotateCcw className="w-3 h-3" />
        Girar cartão
      </button>
    </div>
  );
};