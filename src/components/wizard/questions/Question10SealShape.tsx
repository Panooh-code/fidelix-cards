import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { Star, Circle, Square, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
  canSkip: boolean;
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

export const Question10SealShape = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateRewardConfig } = useWizard();

  const handleSelect = (shape: 'star' | 'circle' | 'square' | 'heart') => {
    updateRewardConfig({ sealShape: shape });
    // Don't auto-advance - user needs to click "Avançar"
  };

  return (
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Star className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Qual formato você quer para os selos?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Escolha o formato que mais combina com seu negócio
        </p>
      </div>

      {/* Shape Options */}
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {shapes.map((shape) => {
          const IconComponent = shape.icon;
          const isSelected = state.rewardConfig.sealShape === shape.value;
          
          return (
            <button
              key={shape.value}
              onClick={() => handleSelect(shape.value)}
              className={cn(
                "p-6 rounded-xl border-2 transition-all hover:scale-[1.02] text-center",
                isSelected
                  ? "border-primary bg-primary/10 shadow-lg"
                  : "border-muted hover:border-primary/50 hover:shadow-md"
              )}
            >
              <div className="space-y-3">
                {/* Shape Icon */}
                <div className={cn(
                  "w-16 h-16 mx-auto rounded-lg flex items-center justify-center",
                  isSelected ? "bg-primary/20" : "bg-muted/50"
                )}>
                  <IconComponent 
                    className={cn(
                      "w-8 h-8",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                    style={{ 
                      color: isSelected ? state.customization.primaryColor : undefined 
                    }}
                  />
                </div>

                {/* Shape Info */}
                <div>
                  <div className={cn(
                    "font-medium mb-1",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {shape.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {shape.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Preview */}
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Seus selos ficarão assim:</p>
        <div className="flex justify-center gap-2">
          {[...Array(3)].map((_, i) => {
            const SelectedIcon = shapes.find(s => s.value === state.rewardConfig.sealShape)?.icon || Star;
            return (
              <SelectedIcon 
                key={i}
                className="w-6 h-6" 
                style={{ color: state.customization.primaryColor }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};