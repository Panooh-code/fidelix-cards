import { Input } from "@/components/ui/input";
import { useWizard } from "../WizardContext";
import { Infinity, Users } from "lucide-react";
import { StandardQuestionLayout } from "../StandardQuestionLayout";

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
    <StandardQuestionLayout title="Nº de cartões">
      <div className="space-y-2">
        <Input
          id="cardLimit"
          type="number"
          placeholder="Deixe vazio para ilimitado"
          value={state.rewardConfig.maxCards || ''}
          onChange={(e) => handleLimitChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="h-10 text-sm text-center"
        />
        
        <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
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
    </StandardQuestionLayout>
  );
};