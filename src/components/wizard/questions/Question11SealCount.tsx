import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useWizard } from "../WizardContext";
import { Target, Star, Circle, Square, Heart } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
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

export const Question11SealCount = ({ onNext, onPrev }: QuestionProps) => {
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
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold text-center mb-3">
        Quantos selos? *
      </h2>
      
      <div className="flex-1 flex flex-col justify-center space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {state.rewardConfig.sealCount}
          </div>
        </div>

        <div className="mx-auto w-full max-w-xs">
          <Slider
            value={[state.rewardConfig.sealCount]}
            onValueChange={handleCountChange}
            min={1}
            max={20}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1</span>
            <span>20</span>
          </div>
        </div>
      </div>
    </div>
  );
};