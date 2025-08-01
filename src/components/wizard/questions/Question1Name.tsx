import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { Building2 } from "lucide-react";

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
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold text-center mb-3">
        Nome do negócio *
      </h2>
      
      <div className="flex-1 flex flex-col justify-center">
        <Input
          id="businessName"
          placeholder="Ex: Café Central, Loja da Maria..."
          value={state.businessData.name}
          onChange={(e) => updateBusinessData({ name: e.target.value })}
          onKeyPress={handleKeyPress}
          className="mx-auto w-full max-w-xs h-10 text-base text-center"
        />
      </div>
    </div>
  );
};