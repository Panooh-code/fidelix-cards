import { useState } from "react";
import { cn } from "@/lib/utils";
import { Star, Circle, Square, MapPin, Building2, QrCode, Phone, Mail, Heart, ExternalLink } from "lucide-react";
import { useWizard } from "./WizardContext";

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

export const CardPreview = ({ cardData, className = "", size = "md" }: CardPreviewProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);

  // Algoritmo para calcular grid otimizado
  const getOptimalGrid = (count: number) => {
    if (count <= 4) return { cols: 2, rows: 2 };
    if (count <= 9) return { cols: 3, rows: 3 };
    if (count <= 16) return { cols: 4, rows: 4 };
    return { cols: 5, rows: Math.ceil(count / 5) };
  };

  const renderSeals = () => {
    const { sealCount, sealShape } = cardData;
    const seals = [];
    const { cols, rows } = getOptimalGrid(sealCount);
    
    // Tamanhos adaptativos
    const sealSize = sealCount <= 4 ? 'w-10 h-10' : sealCount <= 9 ? 'w-8 h-8' : sealCount <= 16 ? 'w-6 h-6' : 'w-5 h-5';
    const iconSize = sealCount <= 4 ? 'w-5 h-5' : sealCount <= 9 ? 'w-4 h-4' : sealCount <= 16 ? 'w-3 h-3' : 'w-2.5 h-2.5';
    
    for (let i = 0; i < sealCount; i++) {
      const isFirst = i === 0;
      
      seals.push(
        <div key={i} className="flex justify-center">
          <div 
            className={cn(
              sealSize,
              "relative rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg",
              "shadow-card-elegant backdrop-blur-sm",
              isFirst 
                ? "border-current bg-white/95 shadow-lg" 
                : "border-white/30 bg-white/20"
            )}
            style={{ 
              borderColor: isFirst ? cardData.primary_color : undefined,
              color: cardData.primary_color 
            }}
          >
            {isFirst && cardData.logo_url ? (
              <img 
                src={cardData.logo_url} 
                alt="Logo" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : sealShape === 'star' ? (
              <Star className={cn(iconSize, isFirst ? "text-current" : "text-white/90", "fill-current")} />
            ) : sealShape === 'heart' ? (
              <Heart className={cn(iconSize, isFirst ? "text-current" : "text-white/90", "fill-current")} />
            ) : sealShape === 'square' ? (
              <Square className={cn(iconSize, isFirst ? "text-current" : "text-white/90", "fill-current")} />
            ) : (
              <Circle className={cn(iconSize, isFirst ? "text-current" : "text-white/90", "fill-current")} />
            )}
            {!isFirst && (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/60">
                {i}
              </span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div 
        className="grid gap-2 w-full place-items-center"
        style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
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
    const patternColor = `${primary_color}${Math.round(255 * parseFloat(patternOpacity)).toString(16).padStart(2, '0')}`;

    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle at 25% 25%, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      case 'lines':
        return {
          backgroundImage: `linear-gradient(45deg, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '15px 15px',
        };
      case 'waves':
        return {
          backgroundImage: `radial-gradient(circle at 50% 50%, ${patternColor} 1px, transparent 1px), 
                           linear-gradient(45deg, transparent 46%, ${patternColor} 47%, ${patternColor} 53%, transparent 54%)`,
          backgroundSize: '10px 10px, 20px 20px',
        };
      case 'grid':
        return {
          backgroundImage: `linear-gradient(${patternColor} 1px, transparent 1px), 
                           linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      default:
        return {};
    }
  };

  // Configurações de tamanho
  const sizeConfig = {
    sm: { width: 'w-60', height: 'h-60', padding: 'p-4', textSizes: { title: 'text-base', subtitle: 'text-xs', body: 'text-xs' } },
    md: { width: 'w-72', height: 'h-72', padding: 'p-6', textSizes: { title: 'text-lg', subtitle: 'text-sm', body: 'text-sm' } },
    lg: { width: 'w-84', height: 'h-84', padding: 'p-8', textSizes: { title: 'text-xl', subtitle: 'text-base', body: 'text-base' } }
  };

  const currentSize = sizeConfig[size];
  const isLight = isLightColor(cardData.backgroundColor);
  const textColor = isLight ? 'text-gray-800' : 'text-white';
  const hasContactData = cardData.phone || cardData.email || cardData.address;

  return (
    <div className={cn("perspective-1000 cursor-pointer group", className)}>
      <div 
        className={cn(
          "relative transition-transform duration-700 transform-style-preserve-3d group-hover:scale-105",
          currentSize.width,
          currentSize.height,
          isFlipped ? 'rotate-y-180' : ''
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Face - Face dos Selos */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-3xl overflow-hidden shadow-paper-craft paper-texture"
          style={{ 
            background: `linear-gradient(135deg, ${cardData.backgroundColor}, ${cardData.primary_color}20)`,
            ...getBackgroundPattern()
          }}
        >
          <div className={cn("h-full flex flex-col relative", currentSize.padding)}>
            {/* Header - Logo e Textos */}
            <div className="flex items-start gap-3 mb-4">
              {/* Logo no canto superior esquerdo */}
              <div className="flex-shrink-0">
                {cardData.logo_url ? (
                  <img 
                    src={cardData.logo_url} 
                    alt="Logo" 
                    className="w-12 h-12 rounded-full object-cover border-3 shadow-card-elegant"
                    style={{ borderColor: cardData.primary_color }}
                  />
                ) : (
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center border-3 shadow-card-elegant bg-white/10"
                    style={{ borderColor: cardData.primary_color }}
                  >
                    <Building2 className={cn("w-6 h-6", textColor)} />
                  </div>
                )}
              </div>
              
              {/* Textos à direita do logo */}
              <div className="flex-1 min-w-0">
                <h3 className={cn("font-poppins font-bold leading-tight drop-shadow-md", currentSize.textSizes.title, textColor)}>
                  {cardData.business_name}
                </h3>
                <p className={cn("font-inter leading-relaxed drop-shadow-sm mt-1", currentSize.textSizes.subtitle, isLight ? 'text-gray-600' : 'text-white/90')}>
                  {cardData.reward_description}
                </p>
              </div>
            </div>

            {/* Grid de Selos - Centralizado */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-[200px]">
                {renderSeals()}
              </div>
            </div>

            {/* Rodapé */}
            <div className={cn("flex justify-between items-center mt-4 pt-3 border-t", isLight ? 'border-gray-300/50' : 'border-white/20')}>
              <a 
                href="https://www.fidelix.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className={cn("flex items-center gap-1 text-xs font-semibold hover:opacity-80 transition-opacity", isLight ? 'text-gray-700' : 'text-white/90')}
                onClick={(e) => e.stopPropagation()}
              >
                <span>Criado com Fidelix</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/80 rounded border flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-gray-800" />
                </div>
                <span className={cn("font-mono text-xs font-medium", isLight ? 'text-gray-700' : 'text-white/90')}>
                  {cardData.clientCode}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Face - Face de Identificação */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl overflow-hidden shadow-paper-craft paper-texture"
          style={{ 
            background: `linear-gradient(135deg, ${cardData.primary_color}, ${cardData.backgroundColor}40)`
          }}
        >
          <div className={cn("h-full flex flex-col items-center justify-center text-center relative", currentSize.padding)}>
            {/* Logo Grande */}
            <div className="mb-6">
              {cardData.logo_url ? (
                <img 
                  src={cardData.logo_url} 
                  alt="Logo" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/50 shadow-card-elegant"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/50 shadow-card-elegant">
                  <Building2 className="w-12 h-12 text-white/80" />
                </div>
              )}
            </div>

            {/* Nome do Negócio */}
            <h3 className={cn("font-poppins font-bold mb-6 drop-shadow-md text-white", currentSize.textSizes.title)}>
              {cardData.business_name}
            </h3>

            {/* QR Code Grande */}
            <div className="w-32 h-32 bg-white/95 rounded-2xl flex items-center justify-center mb-4 shadow-card-elegant backdrop-blur-sm">
              <QrCode className="w-24 h-24 text-gray-800" />
            </div>

            {/* Código do Cliente */}
            <p className="text-white/90 mb-6 font-mono text-lg font-bold tracking-widest drop-shadow-md">
              {cardData.clientCode}
            </p>

            {/* Rodapé da Face Traseira */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              {/* Nome do Cliente */}
              {cardData.clientName && (
                <span className="font-inter text-sm text-white/80">
                  {cardData.clientName}
                </span>
              )}
              
              {/* Ícone de Localização - Toggle de Contato */}
              {hasContactData && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowContactDetails(!showContactDetails);
                  }}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  <MapPin className="w-5 h-5 text-white" />
                </button>
              )}
            </div>

            {/* Dropdown de Detalhes de Contato */}
            {showContactDetails && hasContactData && (
              <div 
                className="absolute bottom-16 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-card-elegant border border-white/30"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-3 text-sm text-gray-700">
                  {cardData.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{cardData.phone}</span>
                    </div>
                  )}
                  {cardData.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="font-medium truncate">{cardData.email}</span>
                    </div>
                  )}
                  {cardData.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="font-medium text-left leading-tight">{cardData.address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
    sealCount: state.rewardConfig.sealCount,
    sealShape: state.rewardConfig.sealShape,
  };
  
  return <CardPreview cardData={cardData} />;
};