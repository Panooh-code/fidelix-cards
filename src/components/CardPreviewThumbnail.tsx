import { CardPreview, CardData } from './wizard/CardPreview';

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
  };
}

export const CardPreviewThumbnail = ({ card }: CardPreviewThumbnailProps) => {
  const cardData: CardData = {
    logo_url: card.logo_url,
    business_name: card.business_name,
    reward_description: card.reward_description,
    primary_color: card.primary_color,
    backgroundColor: card.background_color || '#ffffff',
    pattern: (card.background_pattern as 'dots' | 'lines' | 'waves' | 'grid' | 'none') || 'none',
    clientCode: card.public_code || card.client_code,
    phone: card.business_phone,
    email: card.business_email,
    address: card.business_address,
    socialNetwork: card.social_network,
    sealCount: card.seal_count,
    sealShape: card.seal_shape as 'star' | 'circle' | 'square' | 'heart',
    instructions: card.instructions,
  };

  return (
    <div className="w-48 h-48 flex items-center justify-center overflow-visible">
      <CardPreview cardData={cardData} size="sm" />
    </div>
  );
};