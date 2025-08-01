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

export const Question8SecondaryColor = ({ onNext, onPrev }: QuestionProps) => {
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
    // Don't auto-advance - user needs to click "Avançar"
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    updateCustomization({ backgroundColor: color });
  };

  return (
    <div className="p-4 space-y-3 h-full flex flex-col justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Cor de fundo *
        </h2>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((preset) => {
            const isSelected = state.customization.backgroundColor === preset.color;
            
            return (
              <button
                key={preset.color}
                onClick={() => handleColorSelect(preset.color)}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all",
                  isSelected 
                    ? "border-foreground" 
                    : "border-muted hover:border-muted-foreground"
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
            placeholder="#ffffff"
            className="flex-1 h-8 text-xs font-mono"
          />
        </div>
      </div>
    </div>
  );
};