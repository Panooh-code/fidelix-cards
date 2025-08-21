import { Input } from "@/components/ui/input";
import { useWizard } from "@/components/wizard/WizardContext";
import { Building2 } from "lucide-react";
import { StandardQuestionLayout } from "../StandardQuestionLayout";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
}

export const Question1Name = ({ onNext, onPrev }: QuestionProps) => {
  const { state, updateBusinessData } = useWizard();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && state.businessData.name) {
      onNext();
    }
  };

  return (
    <StandardQuestionLayout title="Qual o nome do seu negócio?">
      <div className="space-y-1">
        <div className="relative w-full">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="businessName"
            placeholder="Ex: Café Central"
            value={state.businessData.name}
            onChange={(e) => updateBusinessData({ name: e.target.value })}
            onKeyPress={handleKeyPress}
            className="h-9 text-sm text-center pl-10 pr-4"
          />
        </div>
        <p className="text-xs text-muted-foreground text-center leading-tight">
          Este será o nome principal no seu cartão de fidelidade.
        </p>
      </div>
    </StandardQuestionLayout>
  );
};