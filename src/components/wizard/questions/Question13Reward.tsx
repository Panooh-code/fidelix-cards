import { Input } from "@/components/ui/input";
import { useWizard } from "../WizardContext";
import { StandardQuestionLayout } from "../StandardQuestionLayout";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
}

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

  return (
    <StandardQuestionLayout title="Definir recompensa *">
      <div className="space-y-2">
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
    </StandardQuestionLayout>
  );
};