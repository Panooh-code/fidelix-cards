import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { Infinity, AlertCircle, Users } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
  canSkip: boolean;
}

export const Question12CardLimit = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateRewardConfig } = useWizard();

  const handleLimitChange = (value: string) => {
    const numValue = parseInt(value);
    if (value === '' || isNaN(numValue)) {
      updateRewardConfig({ maxCards: undefined });
    } else {
      updateRewardConfig({ maxCards: Math.max(1, numValue) });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onNext();
    }
  };

  const getSuggestion = (limit?: number) => {
    if (!limit) return "Sem limite - qualquer pessoa pode usar";
    if (limit <= 100) return "Promoção exclusiva e limitada";
    if (limit <= 500) return "Ideal para negócios pequenos";
    if (limit <= 1000) return "Bom para negócios médios";
    return "Para negócios com grande movimento";
  };

  return (
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Quantas cartelas podem ser distribuídas?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Defina um limite máximo ou deixe ilimitado
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 max-w-md mx-auto">
        <Label htmlFor="cardLimit" className="text-base font-medium">
          Quantidade máxima de cartelas (opcional)
        </Label>
        <div className="relative">
          <Input
            id="cardLimit"
            type="number"
            placeholder="Ex: 1000 (deixe vazio para ilimitado)"
            value={state.rewardConfig.maxCards || ""}
            onChange={(e) => handleLimitChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-14 text-lg pr-12"
            min="1"
            autoFocus
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {state.rewardConfig.maxCards ? (
              <Users className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Infinity className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Current Status */}
        <div className="text-center space-y-2">
          {state.rewardConfig.maxCards ? (
            <div className="text-lg font-medium text-primary">
              Máximo de {state.rewardConfig.maxCards.toLocaleString()} cartelas
            </div>
          ) : (
            <div className="text-lg font-medium text-green-600">
              🔄 Cartelas ilimitadas
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            {getSuggestion(state.rewardConfig.maxCards)}
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 max-w-md mx-auto">
        <div className="flex gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-700 dark:text-amber-300">
            <p><strong>Opcional:</strong> Se você não definir um limite, qualquer pessoa poderá acessar sua cartela.</p>
            <p className="mt-1">Você pode alterar este limite a qualquer momento.</p>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-2 max-w-md mx-auto">
        <p className="text-sm font-medium text-muted-foreground">Exemplos:</p>
        <div className="space-y-1 text-sm text-muted-foreground pl-4">
          <p>• <strong>50-100:</strong> Promoção de lançamento</p>
          <p>• <strong>500-1000:</strong> Campanha mensal</p>
          <p>• <strong>Sem limite:</strong> Programa permanente</p>
        </div>
      </div>
    </div>
  );
};