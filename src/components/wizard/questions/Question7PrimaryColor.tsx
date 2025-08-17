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

const Question7PrimaryColor = ({ onNext, onPrev }: QuestionProps) => {
  const { state, updateCustomization } = useWizard();
  const [customColor, setCustomColor] = useState(state.customization.primaryColor);

  // Usar cores extraídas da logo se disponíveis, senão usar cores predefinidas
  const presetColors = state.customization.extractedColors && state.customization.extractedColors.length > 0 
    ? state.customization.extractedColors.slice(0, 10)
    : [
        '#480da2', '#3b82f6', '#10b981', '#f97316', '#ef4444',
        '#ec4899', '#6366f1', '#14b8a6', '#f59e0b', '#1f2937'
      ];

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
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold text-center mb-3">
        Cor principal *
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
              const isSelected = state.customization.primaryColor === color;
              
              return (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    isSelected 
                      ? "border-foreground" 
                      : "border-white hover:border-muted-foreground"
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
              placeholder="#480da2"
              className="flex-1 h-8 text-xs font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Question7PrimaryColor };