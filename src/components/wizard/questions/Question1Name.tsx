import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { Building2 } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
  canSkip: boolean;
}

export const Question1Name = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateBusinessData } = useWizard();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && state.businessData.name) {
      onNext();
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Qual é o nome do seu negócio?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Este nome aparecerá na sua cartela de fidelidade
        </p>
      </div>

      {/* Input Field */}
      <div className="space-y-3 max-w-md mx-auto">
        <Label htmlFor="businessName" className="text-base font-medium">
          Nome do Negócio *
        </Label>
        <Input
          id="businessName"
          placeholder="Ex: Café Central, Loja da Maria, Dr. Silva..."
          value={state.businessData.name}
          onChange={(e) => updateBusinessData({ name: e.target.value })}
          onKeyPress={handleKeyPress}
          className="h-14 text-lg text-center"
          autoFocus
        />
      </div>

      {/* Helper Text */}
      <div className="text-center text-sm text-muted-foreground max-w-sm mx-auto">
        💡 Use o nome pelo qual seus clientes conhecem seu negócio
      </div>
    </div>
  );
};