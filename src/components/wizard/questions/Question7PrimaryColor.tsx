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

export const Question7PrimaryColor = ({ onNext, onPrev }: QuestionProps) => {
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
    // Don't auto-advance - user needs to click "Avançar"
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    updateCustomization({ primaryColor: color });
  };

  return (
    <div className="p-4 space-y-3 h-full flex flex-col justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Cor principal *
        </h2>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((preset) => {
            const isSelected = state.customization.primaryColor === preset.color;
            
            return (
              <button
                key={preset.color}
                onClick={() => handleColorSelect(preset.color)}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all",
                  isSelected 
                    ? "border-foreground" 
                    : "border-white hover:border-muted-foreground"
                )}
                style={{ backgroundColor: preset.color }}
                title={preset.name}
              />
            );
          })}
        </div>
        
        <div className="flex gap-2">
          <Input
            type="color"
            value={customColor}
            onChange={(e) => handleCustomColorChange(e.target.value)}
            className="w-12 h-8 p-1 border rounded cursor-pointer"
          />
          <Input
            type="text"
            value={customColor}
            onChange={(e) => handleCustomColorChange(e.target.value)}
            placeholder="#480da2"
            className="flex-1 h-8 text-xs font-mono"
          />
        </div>
      </div>
    </div>
  );
};