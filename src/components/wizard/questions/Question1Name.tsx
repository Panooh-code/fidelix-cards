import { Input } from "@/components/ui/input";
import { useWizard } from "@/components/wizard/WizardContext";
import { Building2 } from "lucide-react";
import { QuestionLayout } from "./QuestionLayout";

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
    <QuestionLayout title="Qual o nome do seu negócio?">
      <div className="relative w-full">
        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          id="businessName"
          placeholder="Ex: Café Central"
          value={state.businessData.name}
          onChange={(e) => updateBusinessData({ name: e.target.value })}
          onKeyPress={handleKeyPress}
          className="h-12 text-base text-center pl-10 pr-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-lg"
          // A propriedade 'autoFocus' foi removida para não ativar o teclado automaticamente.
        />
      </div>
      <p className="text-xs text-slate-500 px-2">
        Este será o nome principal no seu cartão de fidelidade.
      </p>
    </QuestionLayout>
  );
};
