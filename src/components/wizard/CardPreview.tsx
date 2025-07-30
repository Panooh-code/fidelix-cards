import { useState } from "react";
import { useWizard } from "./WizardContext";
import { cn } from "@/lib/utils";
import { Star, Circle, Square, MapPin, Building2, QrCode, Phone, Mail, Heart } from "lucide-react";

export const CardPreview = () => {
  const { state } = useWizard();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);

  const renderSeals = () => {
    const { sealCount, sealShape } = state.rewardConfig;
    const seals = [];
    
    // Calculate optimal grid layout for square format
    let cols, rows;
    if (sealCount <= 4) {
      cols = 2;
      rows = 2;
    } else if (sealCount <= 9) {
      cols = 3;
      rows = 3;
    } else if (sealCount <= 16) {
      cols = 4;
      rows = 4;
    } else {
      cols = 5;
      rows = Math.ceil(sealCount / 5);
    }
    
    // Adjust seal size based on grid
    const sealSize = sealCount <= 4 ? 'w-8 h-8' : sealCount <= 9 ? 'w-6 h-6' : sealCount <= 16 ? 'w-5 h-5' : 'w-4 h-4';
    const iconSize = sealCount <= 4 ? 'w-4 h-4' : sealCount <= 9 ? 'w-3 h-3' : sealCount <= 16 ? 'w-2.5 h-2.5' : 'w-2 h-2';
    
    for (let i = 0; i < sealCount; i++) {
      const isFirst = i === 0;
      
      seals.push(
        <div key={i} className="flex justify-center">
          <div 
            className={`${sealSize} rounded-full bg-white/30 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:bg-white/40`}
          >
            {isFirst && state.businessData.logoUrl ? (
              <img 
                src={state.businessData.logoUrl} 
                alt="Logo" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : sealShape === 'star' ? (
              <Star className={`${iconSize} text-white/90 fill-current`} />
            ) : sealShape === 'heart' ? (
              <Heart className={`${iconSize} text-white/90 fill-current`} />
            ) : (
              <Circle className={`${iconSize} text-white/90 fill-current`} />
            )}
          </div>
        </div>
      );
    }

    return (
      <div 
        className="grid gap-1.5 w-full place-items-center"
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
    const { backgroundPattern, primaryColor } = state.customization;
    const patternColor = `${primaryColor}15`; // Very transparent

    switch (backgroundPattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '15px 15px',
        };
      case 'lines':
        return {
          backgroundImage: `linear-gradient(45deg, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '15px 15px',
        };
      case 'waves':
        return {
          backgroundImage: `repeating-linear-gradient(0deg, ${patternColor}, ${patternColor} 1px, transparent 1px, transparent 15px)`,
        };
      case 'grid':
        return {
          backgroundImage: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '15px 15px',
        };
      default:
        return {};
    }
  };

  const hasContactData = state.businessData.phone || state.businessData.email || state.businessData.address;

  return (
    <div 
      className="perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-72 h-72 transition-transform duration-700 transform-style-preserve-3d hover:scale-105 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-3xl shadow-2xl overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${state.customization.primaryColor || '#3b82f6'}, ${state.customization.backgroundColor || '#1e40af'})`,
            ...getBackgroundPattern()
          }}
        >
          <div className="p-6 h-full flex flex-col relative">
            {/* Header with Logo */}
            <div className="flex justify-center mb-4">
              {state.businessData.logoUrl ? (
                <img 
                  src={state.businessData.logoUrl} 
                  alt="Logo" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/40 shadow-lg"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/40 shadow-lg">
                  <Building2 className="w-6 h-6 text-white/80" />
                </div>
              )}
            </div>

            {/* Business Name */}
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg text-white drop-shadow-md">
                {state.businessData.name || 'Nome do Negócio'}
              </h3>
            </div>

            {/* Reward Description */}
            <div className="mb-6 text-center">
              <p className="text-sm text-white/95 leading-relaxed drop-shadow-sm">
                {state.rewardConfig.rewardDescription || 'Complete sua cartela e ganhe prêmios incríveis!'}
              </p>
            </div>

            {/* Seals Grid */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-[180px]">
                {renderSeals()}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center text-xs text-white/90 mt-4 pt-4 border-t border-white/20">
              <span className="font-semibold">Fidelix</span>
              <span className="font-mono">#00001</span>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl shadow-2xl overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${state.customization.backgroundColor || '#1e40af'}, ${state.customization.primaryColor || '#3b82f6'})`
          }}
        >
          <div className="p-6 h-full flex flex-col items-center justify-center text-center relative">
            {/* Large Logo */}
            <div className="mb-6">
              {state.businessData.logoUrl ? (
                <img 
                  src={state.businessData.logoUrl} 
                  alt="Logo" 
                  className="w-20 h-20 rounded-full object-cover border-3 border-white/50 shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/25 flex items-center justify-center border-3 border-white/50 shadow-xl">
                  <Building2 className="w-10 h-10 text-white/80" />
                </div>
              )}
            </div>

            {/* Business Name */}
            <h3 className="text-xl font-bold text-white mb-6 drop-shadow-md">
              {state.businessData.name || 'Nome do Negócio'}
            </h3>

            {/* QR Code */}
            <div className="w-24 h-24 bg-white/90 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <QrCode className="w-16 h-16 text-gray-800" />
            </div>

            {/* Card ID */}
            <p className="text-sm text-white/90 mb-4 font-mono">#00001</p>

            {/* Contact Toggle */}
            {hasContactData && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowContactDetails(!showContactDetails);
                }}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium">Contato</span>
              </button>
            )}

            {/* Contact Details Dropdown */}
            {showContactDetails && hasContactData && (
              <div 
                className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-2 text-xs text-gray-700">
                  {state.businessData.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-gray-500" />
                      <span>{state.businessData.phone}</span>
                    </div>
                  )}
                  {state.businessData.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-gray-500" />
                      <span className="truncate">{state.businessData.email}</span>
                    </div>
                  )}
                  {state.businessData.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3 h-3 text-gray-500 mt-0.5" />
                      <span className="text-left leading-tight">{state.businessData.address}</span>
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