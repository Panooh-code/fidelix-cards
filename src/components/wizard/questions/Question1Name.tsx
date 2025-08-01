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
    <div className="p-4 space-y-3 h-full flex flex-col justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Nome do negócio *
        </h2>
      </div>

      <div className="space-y-2 max-w-sm mx-auto">
        <Input
          id="businessName"
          placeholder="Ex: Café Central, Loja da Maria..."
          value={state.businessData.name}
          onChange={(e) => updateBusinessData({ name: e.target.value })}
          onKeyPress={handleKeyPress}
          className="h-10 text-base text-center"
        />
      </div>
    </div>
  );
};