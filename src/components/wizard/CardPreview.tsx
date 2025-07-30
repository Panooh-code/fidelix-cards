import { useState } from "react";
import { useWizard } from "./WizardContext";
import { cn } from "@/lib/utils";
import { Star, Circle, Square, MapPin } from "lucide-react";

export const CardPreview = () => {
  const { state } = useWizard();
  const [isFlipped, setIsFlipped] = useState(false);

  const renderSeals = () => {
    const { sealCount, sealShape } = state.rewardConfig;
    const seals = [];
    const sealsPerRow = 5;
    const rows = Math.ceil(sealCount / sealsPerRow);

    for (let i = 0; i < sealCount; i++) {
      const isFirstSeal = i === 0;
      let SealIcon;

      switch (sealShape) {
        case 'star':
          SealIcon = Star;
          break;
        case 'square':
          SealIcon = Square;
          break;
        default:
          SealIcon = Circle;
      }

      seals.push(
        <div
          key={i}
          className={cn(
            "relative flex items-center justify-center border-2 rounded-lg transition-all hover:scale-110 shadow-sm",
            state.rewardConfig.sealCount <= 10 ? "w-8 h-8" : state.rewardConfig.sealCount <= 15 ? "w-7 h-7" : "w-6 h-6"
          )}
          style={{
            borderColor: state.customization.primaryColor,
            backgroundColor: isFirstSeal ? state.customization.primaryColor : 'transparent',
          }}
        >
          {isFirstSeal && state.businessData.logoUrl ? (
            <img
              src={state.businessData.logoUrl}
              alt="Logo"
              className={cn(
                "object-cover rounded",
                state.rewardConfig.sealCount <= 10 ? "w-5 h-5" : state.rewardConfig.sealCount <= 15 ? "w-4 h-4" : "w-3 h-3"
              )}
            />
          ) : (
            <>
              <SealIcon 
                className={cn(
                  state.rewardConfig.sealCount <= 10 ? "w-4 h-4" : state.rewardConfig.sealCount <= 15 ? "w-3 h-3" : "w-2 h-2"
                )}
                style={{ color: isFirstSeal ? 'white' : state.customization.primaryColor }}
                fill={isFirstSeal ? 'white' : 'none'}
              />
              <span 
                className={cn(
                  "absolute -bottom-1 -right-1 font-bold bg-background rounded-full flex items-center justify-center border",
                  state.rewardConfig.sealCount <= 10 ? "text-xs w-4 h-4" : "text-[10px] w-3 h-3"
                )}
                style={{ color: state.customization.primaryColor }}
              >
                {i + 1}
              </span>
            </>
          )}
        </div>
      );
    }

    return seals;
  };

  const getBackgroundPattern = () => {
    const { backgroundPattern, primaryColor } = state.customization;
    const patternColor = `${primaryColor}10`; // Very transparent

    switch (backgroundPattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      case 'lines':
        return {
          backgroundImage: `linear-gradient(45deg, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      case 'waves':
        return {
          backgroundImage: `repeating-linear-gradient(0deg, ${patternColor}, ${patternColor} 2px, transparent 2px, transparent 20px)`,
        };
      case 'grid':
        return {
          backgroundImage: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      default:
        return {};
    }
  };

  return (
    <div className="flex justify-center">
      <div
        className="relative w-72 h-72 sm:w-80 sm:h-80 cursor-pointer perspective-1000 hover:scale-105 transition-transform duration-300"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={cn(
            "w-full h-full transition-transform duration-700 transform-style-preserve-3d",
            isFlipped && "rotate-y-180"
          )}
        >
          {/* Face Frontal */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rounded-3xl shadow-elegant border-2 p-6 flex flex-col"
            style={{
              backgroundColor: state.customization.backgroundColor,
              borderColor: `${state.customization.primaryColor}20`,
              ...getBackgroundPattern(),
            }}
          >
            {/* Header com Logo e Nome */}
            <div className="flex items-center space-x-4 mb-6">
              {state.businessData.logoUrl && (
                <div className="w-14 h-14 rounded-xl overflow-hidden border-2 shadow-sm" style={{ borderColor: state.customization.primaryColor }}>
                  <img
                    src={state.businessData.logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground leading-tight">
                  {state.businessData.name || "Seu Negócio"}
                </h3>
              </div>
            </div>

            {/* Prêmio */}
            <div 
              className="rounded-xl p-4 mb-6 border-2 shadow-sm"
              style={{ 
                backgroundColor: `${state.customization.primaryColor}10`,
                borderColor: `${state.customization.primaryColor}30`
              }}
            >
              <p className="text-sm font-semibold text-center" style={{ color: state.customization.primaryColor }}>
                🎁 {state.rewardConfig.rewardDescription || "Seu prêmio aqui"}
              </p>
            </div>

            {/* Grid de Selos */}
            <div className="flex-1 flex items-center justify-center py-2">
              <div 
                className="grid gap-3 justify-items-center w-full max-w-[200px]"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(5, state.rewardConfig.sealCount)}, 1fr)`,
                }}
              >
                {renderSeals()}
              </div>
            </div>

            {/* Rodapé */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t border-muted">
              <div className="flex items-center space-x-2">
                <span>Criado com</span>
                <a 
                  href="https://www.fidelix.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline transition-colors"
                  style={{ color: state.customization.primaryColor }}
                >
                  Fidelix
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-6 h-6 rounded border-2"
                  style={{ 
                    backgroundColor: state.customization.backgroundColor,
                    borderColor: state.customization.primaryColor 
                  }}
                ></div>
                <span className="font-mono font-semibold">#12345</span>
              </div>
            </div>
          </div>

          {/* Face Traseira */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl shadow-elegant border-2 p-6 flex flex-col"
            style={{ 
              backgroundColor: state.customization.backgroundColor,
              borderColor: `${state.customization.primaryColor}20`
            }}
          >
            {/* Logo Grande */}
            <div className="flex justify-center mb-6">
              {state.businessData.logoUrl ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 shadow-md" style={{ borderColor: state.customization.primaryColor }}>
                  <img
                    src={state.businessData.logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="w-24 h-24 rounded-2xl flex items-center justify-center border-2 shadow-md"
                  style={{ 
                    backgroundColor: `${state.customization.primaryColor}10`,
                    borderColor: state.customization.primaryColor 
                  }}
                >
                  <span className="text-muted-foreground text-xs font-medium">Logo</span>
                </div>
              )}
            </div>

            {/* Nome do Negócio */}
            <h2 className="text-xl font-bold text-center text-foreground mb-6">
              {state.businessData.name || "Seu Negócio"}
            </h2>

            {/* QR Code Grande */}
            <div className="flex justify-center mb-6">
              <div 
                className="w-20 h-20 rounded-xl border-2 flex items-center justify-center shadow-md"
                style={{ 
                  backgroundColor: state.customization.backgroundColor,
                  borderColor: state.customization.primaryColor 
                }}
              >
                <span className="text-xs font-medium" style={{ color: state.customization.primaryColor }}>QR Code</span>
              </div>
            </div>

            {/* Código */}
            <div className="text-center mb-6">
              <span className="font-mono text-lg font-bold" style={{ color: state.customization.primaryColor }}>
                #12345
              </span>
            </div>

            {/* Informações do Negócio Condensadas */}
            <div className="space-y-2 text-sm text-center">
              {(state.businessData.phone || state.businessData.email || state.businessData.address) && (
                <div 
                  className="rounded-xl p-3 border"
                  style={{ 
                    backgroundColor: `${state.customization.primaryColor}05`,
                    borderColor: `${state.customization.primaryColor}20`
                  }}
                >
                  {state.businessData.phone && (
                    <p className="text-muted-foreground">📞 {state.businessData.phone}</p>
                  )}
                  {state.businessData.email && (
                    <p className="text-muted-foreground">📧 {state.businessData.email}</p>
                  )}
                  {state.businessData.address && (
                    <p className="text-muted-foreground">📍 {state.businessData.address}</p>
                  )}
                </div>
              )}
            </div>

            {/* Rodapé */}
            <div className="flex items-end justify-between mt-auto pt-4 border-t border-muted">
              <span className="text-xs text-muted-foreground font-medium">João Silva</span>
              <MapPin className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};