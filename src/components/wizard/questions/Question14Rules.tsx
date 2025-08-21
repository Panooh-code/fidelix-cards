import { Textarea } from "@/components/ui/textarea";
import { useWizard } from "../WizardContext";
import { StandardQuestionLayout } from "../StandardQuestionLayout";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
}

export const Question14Rules = ({ onNext, onPrev }: QuestionProps) => {
  const { state, updateRewardConfig } = useWizard();

  const handleRulesChange = (value: string) => {
    updateRewardConfig({ instructions: value });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && state.rewardConfig.instructions) {
      onNext();
    }
  };

  return (
    <StandardQuestionLayout title="Como ganha os selos? *">
      <div className="space-y-1">
        <Textarea
          id="rules"
          placeholder="Ex: A cada compra acima de R$ 50,00 você ganha um selo"
          value={state.rewardConfig.instructions}
          onChange={(e) => handleRulesChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-[50px] text-sm resize-none"
        />
        
        <div className="text-right text-xs text-muted-foreground">
          {state.rewardConfig.instructions.length} caracteres
        </div>
      </div>
    </StandardQuestionLayout>
  );
};