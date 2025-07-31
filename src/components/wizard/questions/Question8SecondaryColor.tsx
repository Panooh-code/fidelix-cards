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
  { name: 'Branco Puro', color: '#ffffff' },
  { name: 'Cinza Claro', color: '#f8fafc' },
  { name: 'Bege Suave', color: '#fef7ed' },
  { name: 'Rosa Claro', color: '#fdf2f8' },
  { name: 'Azul Claro', color: '#eff6ff' },
  { name: 'Verde Claro', color: '#f0fdf4' },
  { name: 'Amarelo Claro', color: '#fefce8' },
  { name: 'Cinza Médio', color: '#e2e8f0' },
  { name: 'Lavanda', color: '#f3f4f6' },
  { name: 'Creme', color: '#fffbeb' },
];

export const Question8SecondaryColor = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateCustomization } = useWizard();
  const [customColor, setCustomColor] = useState(state.customization.backgroundColor);

  // Auto-flip card to seals side when this question loads
  useEffect(() => {
    // Trigger card flip to show seals side
    const event = new CustomEvent('flipCardToSeals');
    window.dispatchEvent(event);
  }, []);

  const handleColorSelect = (color: string) => {
    updateCustomization({ backgroundColor: color });
    setCustomColor(color);
    setTimeout(onNext, 300); // Auto-advance after selection
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    updateCustomization({ backgroundColor: color });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Palette className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Escolha a cor de fundo da cartela
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Esta cor aparecerá na frente da cartela (lado dos selos)
        </p>
      </div>

      {/* Color Preview */}
      <div className="flex justify-center">
        <div 
          className="w-20 h-20 rounded-full border-4 border-gray-200 shadow-lg"
          style={{ backgroundColor: state.customization.backgroundColor }}
        />
      </div>

      {/* Preset Colors */}
      <div className="space-y-4 max-w-lg mx-auto">
        <Label className="text-base font-medium">Cores Populares</Label>
        <div className="grid grid-cols-5 gap-3">
          {presetColors.map((preset) => {
            const isSelected = state.customization.backgroundColor === preset.color;
            
            return (
              <button
                key={preset.color}
                onClick={() => handleColorSelect(preset.color)}
                className={cn(
                  "relative w-12 h-12 rounded-full border-2 transition-all hover:scale-110",
                  isSelected 
                    ? "border-foreground shadow-lg" 
                    : "border-gray-200 shadow-md hover:shadow-lg"
                )}
                style={{ backgroundColor: preset.color }}
                title={preset.name}
              >
                {isSelected && (
                  <div className="absolute inset-0 rounded-full border-2 border-foreground bg-black/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-foreground drop-shadow" />
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
            placeholder="#ffffff"
            className="flex-1 h-12 text-base font-mono"
          />
        </div>
      </div>

      {/* Tip */}
      <div className="text-center text-sm text-muted-foreground max-w-sm mx-auto">
        💡 Cores claras funcionam melhor para a legibilidade do texto
      </div>
    </div>
  );
};