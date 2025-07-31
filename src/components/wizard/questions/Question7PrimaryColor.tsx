import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { Palette, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
  canSkip: boolean;
}

const presetColors = [
  { name: 'Roxo Elegante', color: '#480da2' },
  { name: 'Azul Profissional', color: '#3b82f6' },
  { name: 'Verde Sucesso', color: '#10b981' },
  { name: 'Laranja Vibrante', color: '#f97316' },
  { name: 'Vermelho Paixão', color: '#ef4444' },
  { name: 'Rosa Moderno', color: '#ec4899' },
  { name: 'Índigo Criativo', color: '#6366f1' },
  { name: 'Turquesa Fresh', color: '#14b8a6' },
  { name: 'Âmbar Quente', color: '#f59e0b' },
  { name: 'Preto Clássico', color: '#1f2937' },
];

export const Question7PrimaryColor = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateCustomization } = useWizard();
  const [customColor, setCustomColor] = useState(state.customization.primaryColor);

  // Auto-flip card to QR code side when this question loads
  useEffect(() => {
    // Trigger card flip to show QR code side
    const event = new CustomEvent('flipCardToQR');
    window.dispatchEvent(event);
  }, []);

  const handleColorSelect = (color: string) => {
    updateCustomization({ primaryColor: color });
    setCustomColor(color);
    setTimeout(onNext, 300); // Auto-advance after selection
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    updateCustomization({ primaryColor: color });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Palette className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Escolha a cor principal da sua cartela
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Esta cor aparecerá no verso da cartela (lado do QR Code)
        </p>
      </div>

      {/* Color Preview */}
      <div className="flex justify-center">
        <div 
          className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
          style={{ backgroundColor: state.customization.primaryColor }}
        />
      </div>

      {/* Preset Colors */}
      <div className="space-y-4 max-w-lg mx-auto">
        <Label className="text-base font-medium">Cores Populares</Label>
        <div className="grid grid-cols-5 gap-3">
          {presetColors.map((preset) => {
            const isSelected = state.customization.primaryColor === preset.color;
            
            return (
              <button
                key={preset.color}
                onClick={() => handleColorSelect(preset.color)}
                className={cn(
                  "relative w-12 h-12 rounded-full border-2 transition-all hover:scale-110",
                  isSelected 
                    ? "border-foreground shadow-lg" 
                    : "border-white shadow-md hover:shadow-lg"
                )}
                style={{ backgroundColor: preset.color }}
                title={preset.name}
              >
                {isSelected && (
                  <div className="absolute inset-0 rounded-full border-2 border-foreground bg-white/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white drop-shadow" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color */}
      <div className="space-y-3 max-w-md mx-auto">
        <Label className="text-base font-medium">Cor Personalizada</Label>
        <div className="flex gap-3">
          <Input
            type="color"
            value={customColor}
            onChange={(e) => handleCustomColorChange(e.target.value)}
            className="w-16 h-12 p-1 border rounded-lg cursor-pointer"
          />
          <Input
            type="text"
            value={customColor}
            onChange={(e) => handleCustomColorChange(e.target.value)}
            placeholder="#480da2"
            className="flex-1 h-12 text-base font-mono"
          />
        </div>
      </div>

      {/* Tip */}
      <div className="text-center text-sm text-muted-foreground max-w-sm mx-auto">
        💡 Observe como a cor fica na cartela ao lado
      </div>
    </div>
  );
};