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
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold text-center mb-3">
        Qual formato dos selos? *
      </h2>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-xs">
          <div className="grid grid-cols-4 gap-2">
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
      </div>
    </div>
  );
};