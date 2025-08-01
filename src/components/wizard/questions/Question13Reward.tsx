import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { Gift, AlertCircle } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
}

const rewardExamples = [
  "Complete a cartela e ganhe um café grátis*",
  "Complete a cartela e ganhe 10% de desconto*",
  "Complete a cartela e ganhe um produto grátis*",
  "Complete a cartela e ganhe uma refeição grátis*",
  "Complete a cartela e ganhe um corte de cabelo*",
  "Complete a cartela e ganhe uma consulta grátis*",
];

export const Question13Reward = ({ onNext, onPrev }: QuestionProps) => {
  const { state, updateRewardConfig } = useWizard();

  const handleRewardChange = (value: string) => {
    updateRewardConfig({ rewardDescription: value });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && state.rewardConfig.rewardDescription) {
      onNext();
    }
  };

  const handleExampleClick = (example: string) => {
    updateRewardConfig({ rewardDescription: example });
  };

  const remainingChars = 45 - state.rewardConfig.rewardDescription.length;

  return (
    <div className="p-2 space-y-1">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-0">
          Definir recompensa *
        </h2>
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <Input
          id="reward"
          placeholder="Ex: Complete a cartela e ganhe um café grátis*"
          value={state.rewardConfig.rewardDescription}
          onChange={(e) => handleRewardChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="h-10 text-sm"
          maxLength={45}
        />
        
        <div className="text-right text-xs text-muted-foreground">
          {state.rewardConfig.rewardDescription.length}/45
        </div>
      </div>
    </div>
  );
};