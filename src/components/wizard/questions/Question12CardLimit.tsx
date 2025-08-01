import { Input } from "@/components/ui/input";
import { useWizard } from "../WizardContext";
import { Infinity, Users } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
  canSkip: boolean;
}

export const Question12CardLimit = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateRewardConfig } = useWizard();

  const handleLimitChange = (value: string) => {
    const numValue = parseInt(value);
    if (value === '' || isNaN(numValue)) {
      updateRewardConfig({ maxCards: undefined });
    } else {
      updateRewardConfig({ maxCards: Math.max(1, numValue) });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onNext();
    }
  };

  return (
    <div className="p-4 space-y-4 h-full flex flex-col justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Limite de cartelas (opcional)
        </h2>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <div className="relative">
          <Input
            type="number"
            placeholder="Ex: 1000 (vazio = ilimitado)"
            value={state.rewardConfig.maxCards || ""}
            onChange={(e) => handleLimitChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-10 pr-10"
            min="1"
            autoFocus
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {state.rewardConfig.maxCards ? (
              <Users className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Infinity className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="text-center text-sm">
          {state.rewardConfig.maxCards ? (
            <span className="text-primary font-medium">
              Máximo: {state.rewardConfig.maxCards.toLocaleString()} cartelas
            </span>
          ) : (
            <span className="text-green-600 font-medium">
              Cartelas ilimitadas
            </span>
          )}
        </div>
      </div>
    </div>
  );
};