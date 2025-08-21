import { Textarea } from "@/components/ui/textarea";
import { useWizard } from "../WizardContext";
import { StandardQuestionLayout } from "../StandardQuestionLayout";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
}

export const Question5Address = ({ onNext, onPrev }: QuestionProps) => {
  const { state, updateBusinessData } = useWizard();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && state.businessData.address) {
      onNext();
    }
  };

  return (
    <StandardQuestionLayout title="Endereço (opcional)">
      <div className="space-y-1">
        <Textarea
          id="address"
          placeholder="Rua das Flores, 123 - Centro - SP"
          value={state.businessData.address}
          onChange={(e) => updateBusinessData({ address: e.target.value })}
          onKeyPress={handleKeyPress}
          className="min-h-[50px] text-sm resize-none"
        />
        
        {state.businessData.address && (
          <div className="text-right text-xs text-muted-foreground">
            {state.businessData.address.length} caracteres
          </div>
        )}
      </div>
    </StandardQuestionLayout>
  );
};