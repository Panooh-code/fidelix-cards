import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useWizard } from "./WizardContext";
import { QrCode, X, MapPin, Phone, Mail, MessageCircle, Globe, Info, Star, Heart, Square, Circle } from "lucide-react";

import defaultQrImage from "@/assets/default-qr.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface CardData {
  name: string;
  phone: string;
  phoneCountryCode: string;
  phoneIsWhatsapp: boolean;
  email: string;
  address: string;
  socialNetwork: string;
  logoUrl: string;
  primaryColor: string;
  backgroundColor: string;
  backgroundPattern: 'dots' | 'lines' | 'waves' | 'grid' | 'none';
  sealShape: 'star' | 'circle' | 'square' | 'heart';
  sealCount: number;
  reward_description: string;
  instructions: string;
  clientCode: string;
}

interface CardPreviewProps {
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
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showRulesPopup, setShowRulesPopup] = useState(false);
  const [tapTimeout, setTapTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile
  React.useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  // Função para flip do card
  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  // Sistema robusto de double-tap para mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (tapTimeout) {
      // Double tap detectado
      clearTimeout(tapTimeout);
      setTapTimeout(null);
      handleFlip();
      return;
    }
    
    // Primeiro tap - aguardar segundo tap
    const timeout = setTimeout(() => {
      setTapTimeout(null);
      // Single tap no mobile não faz nada para evitar conflitos
    }, 300);
    
    setTapTimeout(timeout);
  }, [tapTimeout, handleFlip]);

  // QR Code clicável na face frontal - funciona sempre
  const handleQrClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleFlip();
  }, [handleFlip]);

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
              "relative rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer",
              isFirst 
                ? "border-current bg-white/95 shadow-lg" 
                : "border-white/30 bg-white/20"
            )}
            style={{ 
              borderColor: isFirst ? cardData.primaryColor : undefined,
              color: cardData.primaryColor 
            }}
            onClick={(e) => handleSealClick(e, i)}
          >
            {isFirst && cardData.logoUrl ? (
              <img 
                src={cardData.logoUrl} 
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
    const { backgroundPattern, primaryColor, backgroundColor } = cardData;
    const isLight = isLightColor(backgroundColor);
    const patternOpacity = isLight ? '0.03' : '0.08';

    switch (backgroundPattern) {
      case 'dots':
        return { 
          backgroundImage: `radial-gradient(circle, ${primaryColor}${Math.round(255 * parseFloat(patternOpacity)).toString(16).padStart(2, '0')} 1px, transparent 1px)`,
          backgroundSize: '20px 20px' 
        };
      case 'lines':
        return { 
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${primaryColor}${Math.round(255 * parseFloat(patternOpacity)).toString(16).padStart(2, '0')} 10px, ${primaryColor}${Math.round(255 * parseFloat(patternOpacity)).toString(16).padStart(2, '0')} 11px)` 
        };
      case 'waves':
        return { 
          backgroundImage: `radial-gradient(ellipse at top, ${primaryColor}${Math.round(255 * parseFloat(patternOpacity)).toString(16).padStart(2, '0')}, transparent 70%)`,
          backgroundSize: '30px 20px' 
        };
      case 'grid':
        return { 
          backgroundImage: `linear-gradient(${primaryColor}${Math.round(255 * parseFloat(patternOpacity)).toString(16).padStart(2, '0')} 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}${Math.round(255 * parseFloat(patternOpacity)).toString(16).padStart(2, '0')} 1px, transparent 1px)`,
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
  const backgroundClass = `bg-[${cardData.backgroundColor}]`;
  const backgroundPattern = getBackgroundPattern();

  return (
    <>
      <div className={cn("perspective-1000 cursor-pointer group", className)}>
        <div 
          className={cn(
            "relative transition-transform duration-700 transform-style-preserve-3d group-hover:scale-105",
            currentSize.width,
            currentSize.height,
            isFlipped ? 'rotate-y-180' : ''
          )}
          onClick={!isMobile ? handleFlip : undefined}
          onTouchStart={isMobile ? handleTouchStart : undefined}
        >
          {/* Front Face - Face dos Selos */}
          <div 
            className={cn(
              "absolute inset-0 backface-hidden rounded-3xl",
              backgroundClass,
              textColor
            )}
            style={{ ...backgroundPattern }}
          >
            <div className={cn("h-full flex flex-col", currentSize.padding)}>
              {/* Header com logo e nome */}
              <div className="flex items-center gap-3 mb-4">
                {cardData.logoUrl && (
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white/90 p-1 shadow-sm">
                    <img 
                      src={cardData.logoUrl} 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className={cn("font-bold leading-tight", currentSize.textSizes.title)}>
                    {cardData.name}
                  </h3>
                  <p className={cn("leading-relaxed", currentSize.textSizes.subtitle, "opacity-80")}>
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
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-current/20">
                <span className="text-xs opacity-60">Criado com Fidelix</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleQrClick}
                    onTouchEnd={isMobile ? handleQrClick : undefined}
                    className="w-6 h-6 bg-white/80 rounded border flex items-center justify-center hover:bg-white transition-colors cursor-pointer touch-manipulation"
                    title="Clique para virar o cartão"
                  >
                    <QrCode className="w-4 h-4 text-gray-800" />
                  </button>
                  <span className="font-mono text-xs font-medium opacity-80">
                    {cardData.clientCode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Back Face - QR Code */}
          <div 
            className={cn(
              "absolute inset-0 backface-hidden rotate-y-180 rounded-3xl",
              "p-4 text-center flex flex-col items-center justify-between",
              backgroundClass,
              textColor
            )}
            style={{ ...backgroundPattern }}
          >
            {/* Header com Logo e Nome */}
            <div className="flex flex-col items-center space-y-2">
              {cardData.logoUrl && (
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white/90 p-2 shadow-sm">
                  <img 
                    src={cardData.logoUrl} 
                    alt="Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <h2 className="text-base font-bold leading-tight">{cardData.name}</h2>
            </div>

            {/* QR Code Central */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-28 h-28 bg-white rounded-lg p-2 shadow-sm flex items-center justify-center">
                <img 
                  src={defaultQrImage} 
                  alt="QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Footer com Código e Ícones */}
            <div className="flex items-end justify-between w-full">
              {/* Ícones em coluna - lado esquerdo */}
              <div className="flex flex-col gap-1">
                {cardData.address && (
                  <div className="w-6 h-6 bg-white/80 rounded border flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-gray-800" />
                  </div>
                )}
                {cardData.phoneIsWhatsapp && cardData.phone && (
                  <div className="w-6 h-6 bg-white/80 rounded border flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 text-green-600" />
                  </div>
                )}
                {cardData.socialNetwork && (
                  <div className="w-6 h-6 bg-white/80 rounded border flex items-center justify-center">
                    <Globe className="w-3 h-3 text-gray-800" />
                  </div>
                )}
              </div>

              {/* Código Único - direita */}
              <div className="bg-white/90 rounded-lg px-3 py-1">
                <span className="text-gray-800 font-mono text-sm font-bold">{cardData.clientCode}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup de Regras dos Selos */}
      <Dialog open={showRulesPopup} onOpenChange={setShowRulesPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Como Ganhar Selos
            </DialogTitle>
            <DialogDescription>
              Veja como funciona a cartela de fidelidade
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Visualização dos Selos */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex gap-2">
                {[...Array(Math.min(cardData.sealCount, 5))].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white">
                    {cardData.sealShape === 'star' ? (
                      <Star className="w-4 h-4 text-gray-400 fill-current" />
                    ) : cardData.sealShape === 'heart' ? (
                      <Heart className="w-4 h-4 text-gray-400 fill-current" />
                    ) : cardData.sealShape === 'square' ? (
                      <Square className="w-4 h-4 text-gray-400 fill-current" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400 fill-current" />
                    )}
                  </div>
                ))}
                {cardData.sealCount > 5 && (
                  <span className="text-sm text-gray-500 self-center">
                    +{cardData.sealCount - 5} selos
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">
                Complete {cardData.sealCount} selos
              </span>
            </div>

            {/* Instruções */}
            <div className="text-sm text-gray-600">
              <p className="mb-2 font-medium">📋 Instruções:</p>
              <p>{cardData.instructions || "Complete todos os selos para ganhar sua recompensa!"}</p>
            </div>

            {/* Recompensa */}
            <div className="text-sm text-gray-600">
              <p className="mb-2 font-medium">🎁 Recompensa:</p>
              <p>{cardData.reward_description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Componente wrapper que usa o contexto do Wizard
export const CardPreviewWizard = ({ className, size }: Omit<CardPreviewProps, 'cardData'>) => {
  const { state } = useWizard();
  
  const cardData: CardData = {
    name: state.businessData.name || "Seu Negócio",
    phone: state.businessData.phone || "",
    phoneCountryCode: state.businessData.phoneCountryCode || "+55",
    phoneIsWhatsapp: state.businessData.phoneIsWhatsapp || false,
    email: state.businessData.email || "",
    address: state.businessData.address || "",
    socialNetwork: state.businessData.socialNetwork || "",
    logoUrl: state.businessData.logoUrl || "",
    primaryColor: state.customization.primaryColor,
    backgroundColor: state.customization.backgroundColor,
    backgroundPattern: state.customization.backgroundPattern,
    sealShape: state.rewardConfig.sealShape,
    sealCount: state.rewardConfig.sealCount,
    reward_description: state.rewardConfig.rewardDescription || "Recompensa especial",
    instructions: state.rewardConfig.instructions || "Complete todos os selos para ganhar sua recompensa!",
    clientCode: state.businessData.clientCode || `FI${(state.businessData.name || "XX").substring(0, 2).toUpperCase()}1234`,
  };

  return <CardPreview cardData={cardData} className={className} size={size} />;
};
