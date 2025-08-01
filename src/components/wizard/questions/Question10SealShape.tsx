import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { Star, Circle, Square, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
}

const shapes = [
  { 
    name: "Estrela", 
    value: 'star' as const, 
    icon: Star, 
    description: "Clássico e popular",
    color: "#fbbf24"
  },
  { 
    name: "Círculo", 
    value: 'circle' as const, 
    icon: Circle, 
    description: "Simples e limpo",
    color: "#3b82f6"
  },
  { 
    name: "Quadrado", 
    value: 'square' as const, 
    icon: Square, 
    description: "Moderno e geométrico",
    color: "#10b981"
  },
  { 
    name: "Coração", 
    value: 'heart' as const, 
    icon: Heart, 
    description: "Carinhoso e afetuoso",
    color: "#ef4444"
  },
];

export const Question10SealShape = ({ onNext, onPrev }: QuestionProps) => {
  const { state, updateRewardConfig } = useWizard();

  const handleSelect = (shape: 'star' | 'circle' | 'square' | 'heart') => {
    updateRewardConfig({ sealShape: shape });
  };

  return (
    <div className="p-2 space-y-1">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-0">
          Qual formato dos selos? *
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
        {shapes.map((shape) => {
          const IconComponent = shape.icon;
          const isSelected = state.rewardConfig.sealShape === shape.value;
          
          return (
            <button
              key={shape.value}
              onClick={() => handleSelect(shape.value)}
              className={cn(
                "h-12 rounded-lg border-2 transition-all flex items-center justify-center",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-muted hover:border-primary/50"
              )}
            >
              <IconComponent 
                className="w-5 h-5"
                style={{ 
                  color: isSelected ? state.customization.primaryColor : undefined 
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};