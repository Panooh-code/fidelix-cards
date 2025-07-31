import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { FileText, AlertCircle } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
  canSkip: boolean;
}

const rulesExamples = [
  "A cada compra acima de R$ 50,00 você ganha um selo",
  "A cada compra acima de R$ 100,00 você ganha um selo",
  "A cada R$ 30,00 em compras você ganha um selo",
  "A cada visita você ganha um selo",
  "A cada produto comprado você ganha um selo",
  "A cada serviço contratado você ganha um selo",
];

export const Question14Rules = ({ onNext, onPrev, canSkip }: QuestionProps) => {
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
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Como o cliente ganha os selos?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Explique as regras para ganhar selos de forma clara
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 max-w-md mx-auto">
        <Label htmlFor="rules" className="text-base font-medium">
          Regulamento (Como Ganhar Selos) *
        </Label>
        <Textarea
          id="rules"
          placeholder="Ex: A cada compra acima de R$ 50,00 você ganha um selo"
          value={state.rewardConfig.instructions}
          onChange={(e) => handleRulesChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-[100px] text-base resize-none"
          autoFocus
        />

        {/* Character counter */}
        <div className="text-right text-sm text-muted-foreground">
          {state.rewardConfig.instructions.length} caracteres
        </div>

        {/* Examples */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Clique em um exemplo para usar:</Label>
          <div className="space-y-2">
            {rulesExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="w-full text-left p-3 rounded-lg border border-muted hover:border-primary/50 hover:bg-muted/30 transition-all text-sm"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-3 max-w-md mx-auto">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p><strong>Dicas para um bom regulamento:</strong></p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Seja específico sobre o valor mínimo</li>
                <li>Use linguagem simples e direta</li>
                <li>Evite regras muito complicadas</li>
                <li>Considere o valor médio das suas vendas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};