import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Star, Circle, Square, MapPin, Building2, QrCode, Heart, ExternalLink, MessageCircle, Globe, X } from "lucide-react";
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
  whatsapp?: string;
  socialNetwork?: string;
  sealCount: number;
  sealShape: 'star' | 'circle' | 'square' | 'heart';
  instructions?: string;
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
  const [isLocked, setIsLocked] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showRulesPopup, setShowRulesPopup] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile
  useState(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  });

  // Sistema unificado de double click/tap com travamento
  const handleDoubleClick = useCallback(() => {
    if (clickTimer) {
      // Double click detectado
      clearTimeout(clickTimer);
      setClickTimer(null);
      setClickCount(0);
      
      // Virar e travar o card
      setIsFlipped(!isFlipped);
      setIsLocked(true);
    } else {
      // Primeiro click
      setClickCount(1);
      const timer = setTimeout(() => {
        setClickCount(0);
        setClickTimer(null);
      }, 300); // 300ms para detectar double click
      
      setClickTimer(timer);
    }
  }, [isFlipped, clickTimer]);

  // Sistema de double-tap para mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (clickTimer) {
      // Double tap detectado
      clearTimeout(clickTimer);
      setClickTimer(null);
      setClickCount(0);
      
      // Virar e travar o card
      setIsFlipped(!isFlipped);
      setIsLocked(true);
    } else {
      // Primeiro tap
      setClickCount(1);
      const timer = setTimeout(() => {
        setClickCount(0);
        setClickTimer(null);
      }, 300);
      
      setClickTimer(timer);
    }
  }, [isFlipped, clickTimer]);

  // QR Code clicável na face frontal - funciona sempre
  const handleQrClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  // Click em selo vazio para mostrar regras
  const handleSealClick = useCallback((e: React.MouseEvent, index: number) => {
    if (index > 0) { // Apenas selos vazios
      e.stopPropagation();
      setShowRulesPopup(true);
    }
  }, []);

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
                : "border-white/30 bg-white/20 cursor-pointer"
            )}
            style={{ 
              borderColor: isFirst ? cardData.primary_color : undefined,
              color: cardData.primary_color 
            }}
            onClick={(e) => handleSealClick(e, i)}
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
    const patternOpacity = isLight ? '0.03' : '0.08';

    switch (pattern) {
      case 'dots':
        return { 
          backgroundImage: `radial-gradient(circle, ${primary_color}${Math.round(255 * parseFloat(patternOpacity)).toString(16).padStart(2, '0')} 1px, transparent 1px)`,
          backgroundSize: '20px 20px' 
        };
      case 'lines':
        return { 
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${primary_color}${Math.round(255 * parseFloat(patternOpacity)).toString(16).padStart(2, '0')} 10px, ${primary_color}${Math.round(255 * parseFloat(patternOpacity)).toString(16).padStart(2, '0')} 11px)` 
        };
      case 'waves':
        return { 
          backgroundImage: `radial-gradient(ellipse at top, ${primary_color}${Math.round(255 * parseFloat(patternOpacity)).toString(16).padStart(2, '0')}, transparent 70%)`,
          backgroundSize: '30px 20px' 
        };
      case 'grid':
        return { 
          backgroundImage: `linear-gradient(${primary_color}${Math.round(255 * parseFloat(patternOpacity)).toString(16).padStart(2, '0')} 1px, transparent 1px), linear-gradient(90deg, ${primary_color}${Math.round(255 * parseFloat(patternOpacity)).toString(16).padStart(2, '0')} 1px, transparent 1px)`,
          backgroundSize: '20px 20px' 
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

  // Função para criar links de ação
  const createActionLink = (type: 'maps' | 'whatsapp' | 'social', data: string) => {
    switch (type) {
      case 'maps':
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data)}`;
      case 'whatsapp':
        return `https://wa.me/${data.replace(/\D/g, '')}`;
      case 'social':
        return data.startsWith('http') ? data : `https://${data}`;
      default:
        return '#';
    }
  };

  return (
    <>
      <div className={cn("perspective-1000 cursor-pointer group", className)}>
        <div 
          className={cn(
            "relative transition-transform duration-700 transform-style-preserve-3d group-hover:scale-105",
            currentSize.width,
            currentSize.height,
            isFlipped ? 'rotate-y-180' : '',
            isLocked && "ring-2 ring-white/30 shadow-xl"
          )}
          onDoubleClick={!isMobile ? handleDoubleClick : undefined}
          onTouchStart={isMobile ? handleTouchStart : undefined}
        >
          {/* Front Face - Face dos Selos */}
          <div 
            className={cn(
              "absolute inset-0 w-full h-full backface-hidden rounded-3xl overflow-hidden shadow-paper-craft",
              cardData.pattern !== 'none' ? "paper-texture" : ""
            )}
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
                  <Star className="w-3 h-3 fill-current" />
                </a>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleQrClick}
                    onTouchEnd={isMobile ? handleQrClick : undefined}
                    className="w-6 h-6 bg-white/80 rounded border flex items-center justify-center hover:bg-white transition-colors cursor-pointer touch-manipulation"
                    title="Clique para virar o cartão"
                  >
                    <QrCode className="w-4 h-4 text-gray-800" />
                  </button>
                  <span className={cn("font-mono text-xs font-medium", isLight ? 'text-gray-700' : 'text-white/90')}>
                    {cardData.clientCode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Back Face - Face QR Redesenhada */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl overflow-hidden shadow-paper-craft paper-texture"
            style={{ 
              background: `linear-gradient(135deg, ${cardData.primary_color}, ${cardData.backgroundColor}40)`
            }}
          >
            <div className={cn("h-full flex flex-col relative", currentSize.padding)}>
              {/* Logo Bem Centralizado */}
              <div className="flex justify-center mb-3">
                {cardData.logo_url ? (
                  <img 
                    src={cardData.logo_url} 
                    alt="Logo" 
                    className="w-20 h-20 rounded-full object-cover border-4 border-white/50 shadow-card-elegant aspect-square"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/50 shadow-card-elegant aspect-square">
                    <Building2 className="w-10 h-10 text-white/80" />
                  </div>
                )}
              </div>

              {/* Nome do Negócio */}
              <h3 className={cn("font-poppins font-bold text-center mb-2 drop-shadow-md text-white", currentSize.textSizes.title)}>
                {cardData.business_name}
              </h3>

              {/* Área Principal - QR Code com Ícones ao Lado */}
              <div className="flex-1 flex items-center justify-start pl-4 -mt-4">
                  <div className="flex items-center gap-6">
                    {/* Coluna de Ícones à Esquerda */}
                    <div className="flex flex-col gap-3">
                      {cardData.address && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowContactPopup(true);
                          }}
                          className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm shadow-lg"
                          title="Ver informações de contato"
                        >
                          <MapPin className="w-5 h-5 text-white" />
                        </button>
                      )}
                      
                      {cardData.whatsapp && (
                        <a
                          href={createActionLink('whatsapp', cardData.whatsapp)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm shadow-lg"
                          title="Chamar no WhatsApp"
                        >
                          <MessageCircle className="w-5 h-5 text-white" />
                        </a>
                      )}
                      
                      {cardData.socialNetwork && (
                        <a
                          href={createActionLink('social', cardData.socialNetwork)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm shadow-lg"
                          title="Visitar rede social"
                        >
                          <Globe className="w-5 h-5 text-white" />
                        </a>
                      )}
                    </div>

                    {/* QR Code Real Menor */}
                    <div className="w-24 h-24 bg-white/95 rounded-2xl flex items-center justify-center shadow-card-elegant backdrop-blur-sm aspect-square p-2">
                      <img 
                        src="https://jpkogupeanqhhwujvkxh.supabase.co/storage/v1/object/public/assets/qr-code-default.png" 
                        alt="QR Code" 
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Código do Cliente */}
                <div className="text-center -mt-1">
                  <p className="text-white/90 font-mono text-lg font-bold tracking-widest drop-shadow-md">
                    {cardData.clientCode}
                  </p>
                </div>

              {/* Footer com Nome do Cliente */}
              <div className="mt-auto flex justify-center">
                {cardData.clientName && (
                  <span className="font-inter text-sm text-white/80">
                    {cardData.clientName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup de Contato */}
      {showContactPopup && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowContactPopup(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">{cardData.business_name}</h3>
              <button
                onClick={() => setShowContactPopup(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              {cardData.address && (
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <p className="text-gray-700 text-sm">{cardData.address}</p>
                  </div>
                  <a
                    href={createActionLink('maps', cardData.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-8 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors inline-block"
                  >
                    Ver no Mapa
                  </a>
                </div>
              )}
              
              {cardData.whatsapp && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-5 h-5 text-gray-500" />
                    <p className="text-gray-700 text-sm">WhatsApp</p>
                  </div>
                  <a
                    href={createActionLink('whatsapp', cardData.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-8 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors inline-block"
                  >
                    Chamar no WhatsApp
                  </a>
                </div>
              )}
              
              {cardData.socialNetwork && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <p className="text-gray-700 text-sm">Rede Social</p>
                  </div>
                  <a
                    href={createActionLink('social', cardData.socialNetwork)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-8 text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors inline-block"
                  >
                    Visitar Perfil
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popup de Regras dos Selos */}
      {showRulesPopup && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowRulesPopup(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">Como ganhar selos</h3>
              <button
                onClick={() => setShowRulesPopup(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {cardData.instructions || "Complete sua cartela de fidelidade e ganhe prêmios incríveis! A cada compra você ganha um selo."}
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: cardData.primary_color }}
                  >
                    {cardData.sealShape === 'star' ? (
                      <Star className="w-3 h-3 fill-current" style={{ color: cardData.primary_color }} />
                    ) : cardData.sealShape === 'heart' ? (
                      <Heart className="w-3 h-3 fill-current" style={{ color: cardData.primary_color }} />
                    ) : cardData.sealShape === 'square' ? (
                      <Square className="w-3 h-3 fill-current" style={{ color: cardData.primary_color }} />
                    ) : (
                      <Circle className="w-3 h-3 fill-current" style={{ color: cardData.primary_color }} />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    Colete {cardData.sealCount} selos
                  </span>
                </div>
                <p className="text-xs text-gray-600 ml-8">
                  {cardData.reward_description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
    clientCode: state.businessData.clientCode || 'FI0001',
    clientName: undefined,
    phone: state.businessData.phone,
    email: state.businessData.email,
    address: state.businessData.address,
    whatsapp: state.businessData.whatsapp,
    socialNetwork: state.businessData.socialNetwork,
    sealCount: state.rewardConfig.sealCount,
    sealShape: state.rewardConfig.sealShape,
    instructions: state.rewardConfig.instructions,
  };
  
  return <CardPreview cardData={cardData} />;
};