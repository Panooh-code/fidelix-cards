import { Input } from "@/components/ui/input";
import { useWizard } from "@/components/wizard/WizardContext";

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
    <div className="h-full flex flex-col text-center">
      <h2 className="text-lg font-semibold text-center mb-3">
        Qual o nome do seu negócio?
      </h2>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-xs">
          <Input
            id="businessName"
            placeholder="Ex: Café Central"
            value={state.businessData.name}
            onChange={(e) => updateBusinessData({ name: e.target.value })}
            onKeyPress={handleKeyPress}
            className="h-10 text-sm text-center bg-white border border-fidelix-purple/20 focus:border-fidelix-purple rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};