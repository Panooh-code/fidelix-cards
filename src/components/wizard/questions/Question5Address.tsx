import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { MapPin, AlertCircle } from "lucide-react";

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
    <div className="p-2 space-y-1 h-full flex flex-col justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-0">
          Endereço (opcional)
        </h2>
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <Textarea
          id="address"
          placeholder="Rua das Flores, 123 - Centro - SP"
          value={state.businessData.address}
          onChange={(e) => updateBusinessData({ address: e.target.value })}
          onKeyPress={handleKeyPress}
          className="min-h-[80px] text-sm resize-none"
        />
        
        {state.businessData.address && (
          <div className="text-right text-xs text-muted-foreground">
            {state.businessData.address.length} caracteres
          </div>
        )}
      </div>
    </div>
  );
};