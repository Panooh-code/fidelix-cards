import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { Gift, AlertCircle } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
  canSkip: boolean;
}

const rewardExamples = [
  "Complete a cartela e ganhe um café grátis*",
  "Complete a cartela e ganhe 10% de desconto*",
  "Complete a cartela e ganhe um produto grátis*",
  "Complete a cartela e ganhe uma refeição grátis*",
  "Complete a cartela e ganhe um corte de cabelo*",
  "Complete a cartela e ganhe uma consulta grátis*",
];

export const Question13Reward = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateRewardConfig } = useWizard();

  const handleRewardChange = (value: string) => {
    updateRewardConfig({ rewardDescription: value });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && state.rewardConfig.rewardDescription) {
      onNext();
    }
  };

  const handleExampleClick = (example: string) => {
    updateRewardConfig({ rewardDescription: example });
  };

  const remainingChars = 45 - state.rewardConfig.rewardDescription.length;

  return (
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Gift className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          O que o cliente ganha ao completar a cartela?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Descreva a recompensa de forma clara e atrativa
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 max-w-md mx-auto">
        <Label htmlFor="reward" className="text-base font-medium">
          Descrição do Prêmio *
        </Label>
        <div className="space-y-2">
          <Input
            id="reward"
            placeholder="Ex: Complete a cartela e ganhe um café grátis*"
            value={state.rewardConfig.rewardDescription}
            onChange={(e) => handleRewardChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-14 text-base"
            maxLength={45}
            autoFocus
          />
          
          {/* Character Counter */}
          <div className="flex justify-between text-sm">
            <span className={remainingChars < 0 ? "text-red-500" : "text-muted-foreground"}>
              {remainingChars} caracteres restantes
            </span>
            <span className="text-muted-foreground">
              {state.rewardConfig.rewardDescription.length}/45
            </span>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Clique em um exemplo para usar:</Label>
          <div className="space-y-2">
            {rewardExamples.map((example, index) => (
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
              <p><strong>Dicas:</strong></p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Use verbos como "ganhe", "receba", "leve"</li>
                <li>Termine sempre com um asterisco (*)</li>
                <li>Seja específico sobre o prêmio</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};