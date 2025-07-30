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
          className="relative flex items-center justify-center w-10 h-10 border-2 rounded transition-all hover:scale-110"
          style={{
            borderColor: state.customization.primaryColor,
            backgroundColor: isFirstSeal ? state.customization.primaryColor : 'transparent',
          }}
        >
          {isFirstSeal && state.businessData.logoUrl ? (
            <img
              src={state.businessData.logoUrl}
              alt="Logo"
              className="w-6 h-6 object-contain rounded"
            />
          ) : (
            <>
              <SealIcon 
                className="w-5 h-5" 
                style={{ color: isFirstSeal ? 'white' : state.customization.primaryColor }}
                fill={isFirstSeal ? 'white' : 'none'}
              />
              <span 
                className="absolute -bottom-1 -right-1 text-xs font-bold bg-background rounded-full w-4 h-4 flex items-center justify-center border"
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
        className="relative w-80 h-80 cursor-pointer perspective-1000"
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
            className="absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-lg border p-4 flex flex-col"
            style={{
              backgroundColor: state.customization.backgroundColor,
              ...getBackgroundPattern(),
            }}
          >
            {/* Header com Logo e Nome */}
            <div className="flex items-center space-x-3 mb-4">
              {state.businessData.logoUrl && (
                <img
                  src={state.businessData.logoUrl}
                  alt="Logo"
                  className="w-12 h-12 object-contain rounded-lg"
                />
              )}
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  {state.businessData.name || "Seu Negócio"}
                </h3>
              </div>
            </div>

            {/* Prêmio */}
            <div className="bg-background/80 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-center" style={{ color: state.customization.primaryColor }}>
                {state.rewardConfig.rewardDescription || "Seu prêmio aqui"}
              </p>
            </div>

            {/* Grid de Selos */}
            <div className="flex-1 flex items-center justify-center">
              <div 
                className="grid gap-2 justify-items-center"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(5, state.rewardConfig.sealCount)}, 1fr)`,
                }}
              >
                {renderSeals()}
              </div>
            </div>

            {/* Rodapé */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
              <div className="flex items-center space-x-2">
                <span>Criado com</span>
                <a 
                  href="https://www.fidelix.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline"
                  style={{ color: state.customization.primaryColor }}
                >
                  Fidelix
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-muted rounded border"></div>
                <span className="font-mono">#12345</span>
              </div>
            </div>
          </div>

          {/* Face Traseira */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl shadow-lg border p-4 flex flex-col"
            style={{ backgroundColor: state.customization.backgroundColor }}
          >
            {/* Logo Grande */}
            <div className="flex justify-center mb-4">
              {state.businessData.logoUrl ? (
                <img
                  src={state.businessData.logoUrl}
                  alt="Logo"
                  className="w-20 h-20 object-contain rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">Logo</span>
                </div>
              )}
            </div>

            {/* Nome do Negócio */}
            <h2 className="text-xl font-bold text-center text-foreground mb-4">
              {state.businessData.name || "Seu Negócio"}
            </h2>

            {/* QR Code Grande */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-muted rounded border flex items-center justify-center">
                <span className="text-xs text-muted-foreground">QR Code</span>
              </div>
            </div>

            {/* Código */}
            <div className="text-center mb-4">
              <span className="font-mono text-lg font-bold" style={{ color: state.customization.primaryColor }}>
                #12345
              </span>
            </div>

            {/* Informações do Negócio */}
            <div className="space-y-2 text-sm text-center text-muted-foreground">
              {state.businessData.phone && <p>{state.businessData.phone}</p>}
              {state.businessData.email && <p>{state.businessData.email}</p>}
              {state.businessData.address && <p>{state.businessData.address}</p>}
            </div>

            {/* Rodapé */}
            <div className="flex items-end justify-between mt-auto text-xs text-muted-foreground">
              <span>João Silva</span>
              <MapPin className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};