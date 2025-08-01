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
    <div className="p-2 space-y-1">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-0">
          Como ganha os selos? *
        </h2>
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <Textarea
          id="rules"
          placeholder="Ex: A cada compra acima de R$ 50,00 você ganha um selo"
          value={state.rewardConfig.instructions}
          onChange={(e) => handleRulesChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-[60px] text-sm resize-none"
        />
        
        <div className="text-right text-xs text-muted-foreground">
          {state.rewardConfig.instructions.length} caracteres
        </div>
      </div>
    </div>
  );
};