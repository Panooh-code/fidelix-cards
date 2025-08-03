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
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold text-center mb-3">
        Endereço (opcional)
      </h2>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-xs">
          <Textarea
            id="address"
            placeholder="Rua das Flores, 123 - Centro - SP"
            value={state.businessData.address}
            onChange={(e) => updateBusinessData({ address: e.target.value })}
            onKeyPress={handleKeyPress}
            className="min-h-[80px] text-sm resize-none"
          />
          
          {state.businessData.address && (
            <div className="text-right text-xs text-muted-foreground mt-2">
              {state.businessData.address.length} caracteres
            </div>
          )}
        </div>
      </div>
    </div>
  );
};