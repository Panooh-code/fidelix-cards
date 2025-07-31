import React, { useState, useCallback } from 'react';
import { QrCode, Star, MapPin, MessageCircle, Globe, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWizard } from './WizardContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface CardData {
  logo_url?: string;
  business_name: string;
  reward_description: string;
  primary_color: string;
  backgroundColor: string;
  pattern: 'waves' | 'dots' | 'lines' | 'grid' | 'none';
  clientCode: string;
  clientName?: string;
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  socialNetwork?: string;
  sealCount: number;
  sealShape: 'star' | 'circle' | 'square' | 'heart';
}

export interface CardPreviewProps {
  cardData: CardData;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Função para detectar se a cor é clara ou escura
const isLightColor = (color: string) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

export const CardPreview: React.FC<CardPreviewProps> = ({ 
  cardData, 
  className = "", 
  size = "md" 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showRulesPopup, setShowRulesPopup] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  const handleCardClick = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    const timeDiff = now - lastTap;
    
    if (timeDiff < 300 && timeDiff > 0) {
      setIsFlipped(!isFlipped);
    }
    setLastTap(now);
  }, [lastTap, isFlipped]);

  const handleQrCodeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(true);
  }, []);

  const handleSealClick = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (index > 0) { // Não para o selo do logo
      setShowRulesPopup(true);
    }
  }, []);

  const handleContactClick = useCallback((type: 'whatsapp' | 'social' | 'maps') => {
    switch (type) {
      case 'whatsapp':
        if (cardData.whatsapp) {
          const cleanNumber = cardData.whatsapp.replace(/[^\d+]/g, '');
          window.open(`https://wa.me/${cleanNumber}`, '_blank');
        }
        break;
      case 'social':
        if (cardData.socialNetwork) {
          const url = cardData.socialNetwork.startsWith('http') 
            ? cardData.socialNetwork 
            : `https://${cardData.socialNetwork}`;
          window.open(url, '_blank');
        }
        break;
      case 'maps':
        if (cardData.address) {
          const encodedAddress = encodeURIComponent(cardData.address);
          window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
        }
        break;
    }
  }, [cardData.whatsapp, cardData.socialNetwork, cardData.address]);

  // Algoritmo para calcular grid otimizado
  const getOptimalGrid = (count: number) => {
    if (count <= 4) return { cols: 2, rows: 2 };
    if (count <= 9) return { cols: 3, rows: 3 };
    if (count <= 16) return { cols: 4, rows: 4 };
    return { cols: 5, rows: Math.ceil(count / 5) };
  };

  const renderSeals = () => {
    const { cols, rows } = getOptimalGrid(cardData.sealCount);
    const seals = [];

    for (let i = 0; i < cardData.sealCount; i++) {
      const isEmpty = i > 0; // Primeiro selo sempre é o logo
      
      seals.push(
        <div
          key={i}
          className={cn(
            "aspect-square rounded-lg flex items-center justify-center transition-all duration-200",
            "hover:scale-105 cursor-pointer",
            i === 0 
              ? "bg-white shadow-md ring-2" 
              : isEmpty 
                ? "bg-white/20 border border-white/30 text-white/60" 
                : "bg-white shadow-sm",
            size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'
          )}
          style={i === 0 ? { 
            borderColor: cardData.primary_color 
          } : {}}
          onClick={(e) => handleSealClick(e, i)}
        >
          {i === 0 ? (
            cardData.logo_url ? (
              <img 
                src={cardData.logo_url} 
                alt="Logo" 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium text-primary">LOGO</span>
              </div>
            )
          ) : (
            <span className="text-xs font-medium">{i}</span>
          )}
        </div>
      );
    }

    return (
      <div 
        className="w-full flex-1 p-4"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: size === 'sm' ? '8px' : size === 'lg' ? '16px' : '12px'
        }}
      >
        {seals}
      </div>
    );
  };

  const getBackgroundPattern = () => {
    const { pattern, primary_color, backgroundColor } = cardData;
    const isLight = isLightColor(backgroundColor);
    const patternOpacity = isLight ? '0.05' : '0.1';
    
    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle at 25% 25%, ${primary_color}33 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      case 'lines':
        return {
          backgroundImage: `linear-gradient(45deg, ${primary_color}33 1px, transparent 1px)`,
          backgroundSize: '15px 15px',
        };
      case 'waves':
        return {
          backgroundImage: `radial-gradient(circle at 50% 50%, ${primary_color}33 1px, transparent 1px)`,
          backgroundSize: '10px 10px',
        };
      case 'grid':
        return {
          backgroundImage: `linear-gradient(${primary_color}33 1px, transparent 1px), linear-gradient(90deg, ${primary_color}33 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      default:
        return {};
    }
  };

  // Configurações de tamanho
  const sizeConfig = {
    sm: { width: 'w-60', height: 'h-60' },
    md: { width: 'w-72', height: 'h-72' },
    lg: { width: 'w-84', height: 'h-84' }
  };

  const currentSize = sizeConfig[size];
  const isLight = isLightColor(cardData.backgroundColor);
  const textColor = isLight ? 'text-gray-800' : 'text-white';

  return (
    <div className={cn("relative", className)}>
      <div 
        className={cn(
          "relative w-full h-full cursor-pointer perspective-1000",
          className
        )}
        onClick={handleCardClick}
        onTouchEnd={handleDoubleTap}
      >
        {/* Wrapper com animação 3D */}
        <div 
          className={cn(
            "relative transition-transform duration-700 transform-style-preserve-3d",
            currentSize.width,
            currentSize.height,
            isFlipped ? 'rotate-y-180' : ''
          )}
        >
          {/* Face Frontal - Selos */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-xl shadow-card-elegant paper-texture overflow-hidden"
            style={{ 
              backgroundColor: cardData.backgroundColor,
              ...getBackgroundPattern()
            }}
          >
            <div className="h-full flex flex-col p-6">
              {/* Header com logo e textos */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  {cardData.logo_url ? (
                    <img 
                      src={cardData.logo_url} 
                      alt="Logo" 
                      className="w-full h-full object-cover"
                      style={{ border: `3px solid ${cardData.primary_color}` }}
                    />
                  ) : (
                    <div 
                      className="w-full h-full rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: cardData.primary_color, color: 'white' }}
                    >
                      LOGO
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={cn("font-bold text-lg leading-tight", textColor)}>
                    {cardData.business_name}
                  </h3>
                  <p className={cn("text-sm leading-relaxed", isLight ? 'text-gray-600' : 'text-white/80')}>
                    {cardData.reward_description}
                  </p>
                </div>
              </div>

              {/* Grid de selos */}
              {renderSeals()}

              {/* Rodapé */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/20">
                <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
                  <Star size={12} fill="currentColor" />
                  <a 
                    href="https://www.fidelix.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Criado com Fidelix
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-mono text-muted-foreground">
                    {cardData.clientCode}
                  </div>
                  <QrCode 
                    size={12} 
                    className="text-muted-foreground/60 cursor-pointer hover:text-muted-foreground transition-colors" 
                    onClick={handleQrCodeClick}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Face do Verso - QR Code e Identificação */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-background to-background/95 rounded-xl border shadow-card-elegant p-6">
            <div className="w-full h-full flex flex-col items-center justify-center space-y-6 text-center">
              {/* Logo Principal */}
              {cardData.logo_url ? (
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg ring-4 ring-white/20 flex-shrink-0">
                  <img 
                    src={cardData.logo_url} 
                    alt={cardData.business_name}
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '1/1' }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center shadow-lg ring-4 ring-white/20 flex-shrink-0">
                  <span className="text-sm font-bold text-primary">LOGO</span>
                </div>
              )}

              {/* Nome do Negócio */}
              <h2 className="font-bold text-lg leading-tight max-w-full px-2">
                {cardData.business_name}
              </h2>

              {/* QR Code */}
              <div className="w-32 h-32 bg-white rounded-lg shadow-lg flex items-center justify-center flex-shrink-0">
                <QrCode size={80} className="text-foreground" />
              </div>

              {/* Código do Cliente */}
              <div className="font-mono text-lg font-bold tracking-wider text-primary">
                {cardData.clientCode}
              </div>

              {/* Rodapé com Detalhes */}
              <div className="w-full flex justify-between items-center mt-auto pt-4 border-t border-border/20">
                {/* Nome do Cliente */}
                <div className="text-sm text-muted-foreground flex-1 text-left">
                  {cardData.clientName || "Cliente"}
                </div>

                {/* Ícones de Contato */}
                <div className="flex items-center gap-3">
                  {cardData.address && (
                    <button 
                      onClick={() => handleContactClick('maps')}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="Ver no mapa"
                    >
                      <MapPin size={16} />
                    </button>
                  )}
                  
                  {cardData.whatsapp && (
                    <button 
                      onClick={() => handleContactClick('whatsapp')}
                      className="text-muted-foreground hover:text-green-600 transition-colors"
                      title="WhatsApp"
                    >
                      <MessageCircle size={16} />
                    </button>
                  )}
                  
                  {cardData.socialNetwork && (
                    <button 
                      onClick={() => handleContactClick('social')}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="Rede Social"
                    >
                      <Globe size={16} />
                    </button>
                  )}
                  
                  <button 
                    onClick={() => setShowContactDetails(!showContactDetails)}
                    className="text-muted-foreground hover:text-primary transition-colors ml-2"
                    title="Mais informações"
                  >
                    <MapPin size={16} />
                  </button>
                </div>
              </div>

              {/* Detalhes de Contato - Expansível */}
              {showContactDetails && (
                <div className="w-full mt-4 p-3 bg-muted/30 rounded-lg text-xs space-y-2 animate-fade-in">
                  <div className="font-medium text-primary mb-2">{cardData.business_name}</div>
                  {cardData.phone && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Telefone:</span>
                      <span>{cardData.phone}</span>
                    </div>
                  )}
                  {cardData.email && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Email:</span>
                      <span>{cardData.email}</span>
                    </div>
                  )}
                  {cardData.address && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Endereço:</span>
                      <span>{cardData.address}</span>
                      <button 
                        onClick={() => handleContactClick('maps')}
                        className="text-primary hover:text-primary/80 text-xs underline ml-1"
                      >
                        (ver mapa)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Popup de Regras dos Selos */}
      {showRulesPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full animate-scale-in">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-primary">Como Ganhar Selos</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowRulesPopup(false)}
                  className="h-8 w-8 p-0"
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  {cardData.reward_description || "Colecione selos a cada compra e ganhe prêmios incríveis!"}
                </p>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="font-medium mb-1">Regras:</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• 1 selo por compra</li>
                    <li>• Válido por 12 meses</li>
                    <li>• Não acumulável com outras promoções</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Componente Wrapper que usa o contexto (para compatibilidade)
export const CardPreviewWizard = () => {
  const { state } = useWizard();
  
  const cardData: CardData = {
    logo_url: state.businessData.logoUrl,
    business_name: state.businessData.name || 'Nome do Negócio',
    reward_description: state.rewardConfig.rewardDescription || 'Complete sua cartela e ganhe prêmios incríveis!',
    primary_color: state.customization.primaryColor,
    backgroundColor: state.customization.backgroundColor,
    pattern: state.customization.backgroundPattern,
    clientCode: '#00001',
    clientName: undefined,
    phone: state.businessData.phone,
    email: state.businessData.email,
    address: state.businessData.address,
    whatsapp: state.businessData.whatsapp,
    socialNetwork: state.businessData.socialNetwork,
    sealCount: state.rewardConfig.sealCount,
    sealShape: state.rewardConfig.sealShape,
  };
  
  return <CardPreview cardData={cardData} />;
};