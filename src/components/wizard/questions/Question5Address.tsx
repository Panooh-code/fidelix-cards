import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { MapPin, AlertCircle } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
  canSkip: boolean;
}

export const Question5Address = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateBusinessData } = useWizard();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && state.businessData.address) {
      onNext();
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Onde fica seu negócio?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Seus clientes poderão encontrar você facilmente
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 max-w-md mx-auto">
        <Label htmlFor="address" className="text-base font-medium">
          Endereço Completo (opcional)
        </Label>
        <Textarea
          id="address"
          placeholder="Rua das Flores, 123 - Centro - São Paulo/SP"
          value={state.businessData.address}
          onChange={(e) => updateBusinessData({ address: e.target.value })}
          onKeyPress={handleKeyPress}
          className="min-h-[120px] text-base resize-none"
          autoFocus
        />

        {/* Skip Info */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-700 dark:text-amber-300">
              <p><strong>Opcional:</strong> Se você não quiser exibir seu endereço na cartela, pode pular esta etapa.</p>
              <p className="mt-1 text-xs">Você pode adicionar o endereço mais tarde se mudar de ideia.</p>
            </div>
          </div>
        </div>

        {/* Character counter */}
        {state.businessData.address && (
          <div className="text-right text-sm text-muted-foreground">
            {state.businessData.address.length} caracteres
          </div>
        )}
      </div>
    </div>
  );
};