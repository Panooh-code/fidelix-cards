import { Input } from "@/components/ui/input";
import { useWizard } from "../WizardContext";
import { Infinity, Users } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
}

export const Question12CardLimit = ({ onNext, onPrev }: QuestionProps) => {
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
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold text-center mb-3">
        Nº de cartões
      </h2>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-xs">
          <Input
            id="cardLimit"
            type="number"
            placeholder="Deixe vazio para ilimitado"
            value={state.rewardConfig.maxCards || ''}
            onChange={(e) => handleLimitChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-10 text-sm text-center"
          />
          
          <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1 mt-2">
            {state.rewardConfig.maxCards ? (
              <>
                <Users className="w-3 h-3" />
                <span>Limite: {state.rewardConfig.maxCards} cartões</span>
              </>
            ) : (
              <>
                <Infinity className="w-3 h-3" />
                <span>Ilimitados</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};