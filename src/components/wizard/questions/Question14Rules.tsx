import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { FileText, AlertCircle } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
}

const rulesExamples = [
  "A cada compra acima de R$ 50,00 você ganha um selo",
  "A cada compra acima de R$ 100,00 você ganha um selo",
  "A cada R$ 30,00 em compras você ganha um selo",
  "A cada visita você ganha um selo",
  "A cada produto comprado você ganha um selo",
  "A cada serviço contratado você ganha um selo",
];

export const Question14Rules = ({ onNext, onPrev }: QuestionProps) => {
  const { state, updateRewardConfig } = useWizard();

  const handleRulesChange = (value: string) => {
    updateRewardConfig({ instructions: value });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && state.rewardConfig.instructions) {
      onNext();
    }
  };

  const handleExampleClick = (example: string) => {
    updateRewardConfig({ instructions: example });
  };

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold text-center mb-3">
        Como ganha os selos? *
      </h2>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-xs">
          <Textarea
            id="rules"
            placeholder="Ex: A cada compra acima de R$ 50,00 você ganha um selo"
            value={state.rewardConfig.instructions}
            onChange={(e) => handleRulesChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[60px] text-sm resize-none"
          />
          
          <div className="text-right text-xs text-muted-foreground mt-2">
            {state.rewardConfig.instructions.length} caracteres
          </div>
        </div>
      </div>
    </div>
  );
};