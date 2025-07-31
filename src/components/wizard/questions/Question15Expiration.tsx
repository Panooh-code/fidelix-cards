import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useWizard } from "../WizardContext";
import { Calendar as CalendarIcon, Clock, AlertCircle, Infinity } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
  canSkip: boolean;
}

export const Question15Expiration = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateRewardConfig } = useWizard();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    updateRewardConfig({ expirationDate: date });
    setIsCalendarOpen(false);
  };

  const clearDate = () => {
    updateRewardConfig({ expirationDate: undefined });
  };

  const quickDates = [
    { label: "30 dias", days: 30 },
    { label: "60 dias", days: 60 },
    { label: "90 dias", days: 90 },
    { label: "6 meses", days: 180 },
    { label: "1 ano", days: 365 },
  ];

  const handleQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    updateRewardConfig({ expirationDate: date });
  };

  const isExpired = state.rewardConfig.expirationDate && state.rewardConfig.expirationDate < new Date();

  return (
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Clock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Até quando essa promoção é válida?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Defina uma data de expiração ou deixe permanente
        </p>
      </div>

      {/* Current Status */}
      <div className="text-center space-y-2">
        {state.rewardConfig.expirationDate ? (
          <div className={cn(
            "text-lg font-medium",
            isExpired ? "text-red-600" : "text-primary"
          )}>
            {isExpired ? "⚠️ Expirada em" : "📅 Válida até"} {format(state.rewardConfig.expirationDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </div>
        ) : (
          <div className="text-lg font-medium text-green-600">
            ♾️ Promoção permanente
          </div>
        )}
      </div>

      {/* Quick Date Buttons */}
      <div className="space-y-4 max-w-md mx-auto">
        <Label className="text-base font-medium">Escolha rápida:</Label>
        <div className="grid grid-cols-2 gap-2">
          {quickDates.map((quick) => (
            <Button
              key={quick.days}
              variant="outline"
              onClick={() => handleQuickDate(quick.days)}
              className="h-12"
            >
              {quick.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar Picker */}
      <div className="space-y-4 max-w-md mx-auto">
        <Label className="text-base font-medium">Ou escolha uma data específica:</Label>
        <div className="flex gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 h-12 justify-start"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {state.rewardConfig.expirationDate ? (
                  format(state.rewardConfig.expirationDate, "dd/MM/yyyy")
                ) : (
                  "Selecionar data"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={state.rewardConfig.expirationDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          {state.rewardConfig.expirationDate && (
            <Button
              variant="outline"
              onClick={clearDate}
              className="h-12 px-3"
              title="Remover data"
            >
              <Infinity className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 max-w-md mx-auto">
        <div className="flex gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-700 dark:text-amber-300">
            <p><strong>Opcional:</strong> Se você não definir uma data, a promoção ficará ativa permanentemente.</p>
            <p className="mt-1">Você pode alterar ou remover a data a qualquer momento.</p>
          </div>
        </div>
      </div>

      {/* Warning for expired date */}
      {isExpired && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800 max-w-md mx-auto">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700 dark:text-red-300">
              <p><strong>Atenção:</strong> A data selecionada já passou. A promoção ficará inativa.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};