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

const Question8SecondaryColor = ({ onNext, onPrev }: QuestionProps) => {
  const { state, updateCustomization } = useWizard();
  const [customColor, setCustomColor] = useState(state.customization.backgroundColor);

  // Usar cores extraídas da logo se disponíveis, senão usar cores predefinidas
  const presetColors = state.customization.extractedColors && state.customization.extractedColors.length > 0 
    ? state.customization.extractedColors.slice(0, 10)
    : [
        '#ffffff', '#f8fafc', '#fef7ed', '#fdf2f8', '#eff6ff',
        '#f0fdf4', '#fefce8', '#e2e8f0', '#f3f4f6', '#fffbeb'
      ];

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
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold text-center mb-3">
        Cor de fundo *
        {state.customization.autoExtractedColors && (
          <span className="block text-xs text-muted-foreground font-normal mt-1">
            ✨ {state.customization.extractedColors ? 'Cores extraídas da logo' : 'Cor extraída automaticamente da logo'}
          </span>
        )}
      </h2>
      
      <div className="flex-1 flex flex-col justify-center space-y-3">
        <div className="mx-auto w-full max-w-xs">
          <div className="grid grid-cols-5 gap-2 mb-3">
            {presetColors.map((color, index) => {
              const isSelected = state.customization.backgroundColor === color;
              
              return (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    isSelected 
                      ? "border-foreground" 
                      : "border-muted hover:border-muted-foreground"
                  )}
                  style={{ backgroundColor: color }}
                  title={state.customization.extractedColors ? `Cor ${index + 1} da logo` : `Cor ${index + 1}`}
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
    </div>
  );
};

export { Question8SecondaryColor };