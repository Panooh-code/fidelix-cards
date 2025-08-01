import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useWizard } from "../WizardContext";
import { Calendar as CalendarIcon, Infinity } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    { label: "3 meses", days: 90 },
    { label: "6 meses", days: 180 },
    { label: "1 ano", days: 365 },
  ];

  const handleQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    updateRewardConfig({ expirationDate: date });
  };

  return (
    <div className="p-4 space-y-4 h-full flex flex-col justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Validade (opcional)
        </h2>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        {/* Current Status */}
        <div className="text-center text-sm">
          {state.rewardConfig.expirationDate ? (
            <span className="text-primary font-medium">
              Válida até {format(state.rewardConfig.expirationDate, "dd/MM/yyyy")}
            </span>
          ) : (
            <span className="text-green-600 font-medium">
              Promoção permanente
            </span>
          )}
        </div>

        {/* Quick Date Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {quickDates.map((quick) => (
            <Button
              key={quick.days}
              variant="outline"
              onClick={() => handleQuickDate(quick.days)}
              className="h-8 text-xs"
            >
              {quick.label}
            </Button>
          ))}
        </div>

        {/* Calendar Picker */}
        <div className="flex gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 h-10 justify-start text-xs"
              >
                <CalendarIcon className="w-3 h-3 mr-2" />
                {state.rewardConfig.expirationDate ? (
                  format(state.rewardConfig.expirationDate, "dd/MM/yyyy")
                ) : (
                  "Data específica"
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
              />
            </PopoverContent>
          </Popover>
          
          {state.rewardConfig.expirationDate && (
            <Button
              variant="outline"
              onClick={clearDate}
              className="h-10 px-3"
              title="Remover data"
            >
              <Infinity className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};