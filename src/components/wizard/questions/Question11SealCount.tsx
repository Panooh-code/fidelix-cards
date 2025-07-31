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
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Quantos selos o cliente precisa coletar?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Defina quantos selos são necessários para ganhar o prêmio
        </p>
      </div>

      {/* Seal Count Display */}
      <div className="text-center space-y-4">
        <div className="text-6xl font-bold text-primary">
          {state.rewardConfig.sealCount}
        </div>
        <div className="text-lg text-muted-foreground">
          selos para ganhar o prêmio
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-6 max-w-md mx-auto">
        <Slider
          value={[state.rewardConfig.sealCount]}
          onValueChange={handleCountChange}
          min={1}
          max={20}
          step={1}
          className="w-full"
        />
        
        {/* Range Labels */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>1 selo</span>
          <span>20 selos</span>
        </div>
      </div>

      {/* Visual Preview */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-center block">
          Prévia dos selos na cartela:
        </Label>
        <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
          {[...Array(Math.min(state.rewardConfig.sealCount, 12))].map((_, i) => (
            <SealIcon 
              key={i}
              className="w-5 h-5" 
              style={{ color: state.customization.primaryColor }}
            />
          ))}
          {state.rewardConfig.sealCount > 12 && (
            <span className="text-sm text-muted-foreground self-center">
              +{state.rewardConfig.sealCount - 12} mais...
            </span>
          )}
        </div>
      </div>

      {/* Suggestion */}
      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 max-w-md mx-auto">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 <strong>{getSuggestion(state.rewardConfig.sealCount)}</strong>
        </p>
      </div>
    </div>
  );
};