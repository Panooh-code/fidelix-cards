import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useWizard } from "../WizardContext";
import { Target, Star, Circle, Square, Heart } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
  canSkip: boolean;
}

const getIconByShape = (shape: 'star' | 'circle' | 'square' | 'heart') => {
  switch (shape) {
    case 'star': return Star;
    case 'circle': return Circle;
    case 'square': return Square;
    case 'heart': return Heart;
    default: return Star;
  }
};

export const Question11SealCount = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateRewardConfig } = useWizard();
  
  const handleCountChange = (value: number[]) => {
    updateRewardConfig({ sealCount: value[0] });
  };

  const getSuggestion = (count: number) => {
    if (count <= 5) return "Ideal para vendas de alto valor";
    if (count <= 10) return "Perfeito para a maioria dos negócios";
    if (count <= 15) return "Bom para produtos de baixo valor";
    return "Para compras muito frequentes";
  };

  const SealIcon = getIconByShape(state.rewardConfig.sealShape);

  return (
    <div className="p-4 space-y-3 h-full flex flex-col justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Quantos selos? *
        </h2>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">
            {state.rewardConfig.sealCount}
          </div>
          <div className="text-sm text-muted-foreground">
            selos para o prêmio
          </div>
        </div>

        <Slider
          value={[state.rewardConfig.sealCount]}
          onValueChange={handleCountChange}
          min={1}
          max={20}
          step={1}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>20</span>
        </div>

        <div className="flex flex-wrap justify-center gap-1">
          {[...Array(Math.min(state.rewardConfig.sealCount, 8))].map((_, i) => (
            <SealIcon 
              key={i}
              className="w-3 h-3" 
              style={{ color: state.customization.primaryColor }}
            />
          ))}
          {state.rewardConfig.sealCount > 8 && (
            <span className="text-xs text-muted-foreground self-center">
              +{state.rewardConfig.sealCount - 8}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};