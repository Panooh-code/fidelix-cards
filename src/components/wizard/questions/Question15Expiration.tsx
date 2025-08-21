import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useWizard } from "../WizardContext";
import { useAuth } from "@/hooks/useAuth";
import { useLoyaltyCardSave } from "@/hooks/useLoyaltyCardSave";
import { Calendar as CalendarIcon, Infinity, Upload, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { StandardQuestionLayout } from "../StandardQuestionLayout";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
}

export const Question15Expiration = ({ onNext, onPrev }: QuestionProps) => {
  const { state, updateRewardConfig, clearSavedState } = useWizard();
  const { user } = useAuth();
  const { saveCard, saving } = useLoyaltyCardSave();
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [published, setPublished] = useState(false);

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

  const handlePublish = async () => {
    if (!user) {
      // Salvar estado atual antes de redirecionar para login
      // O WizardContext já salva automaticamente no localStorage
      const redirectUrl = encodeURIComponent('/wizard');
      navigate(`/auth?redirect=${redirectUrl}`);
      return;
    }

    const { success } = await saveCard(state);
    if (success) {
      setPublished(true);
      // Limpar estado salvo após publicação bem-sucedida
      clearSavedState();
      // Redirecionar para área de cartões do lojista
      setTimeout(() => {
        navigate('/my-cards');
      }, 2000);
    }
  };

  return (
    <StandardQuestionLayout title="Validade (opcional)">
      <div className="space-y-2">
        <div className="text-center text-xs">
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

        <div className="grid grid-cols-4 gap-1 mb-2">
          {quickDates.map((quick) => (
            <Button
              key={quick.days}
              variant="outline"
              onClick={() => handleQuickDate(quick.days)}
              className="h-6 text-xs px-1"
            >
              {quick.label === "30 dias" ? "30d" : 
               quick.label === "3 meses" ? "3m" :
               quick.label === "6 meses" ? "6m" : "1a"}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 mb-3">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 h-8 justify-start text-xs"
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
              className="h-8 px-2"
              title="Remover data"
            >
              <Infinity className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Publish Section */}
        <div className="border-t pt-2 mt-2">
          <div className="text-center space-y-2">
            <h3 className="text-sm font-semibold text-primary">
              Tudo pronto! 🎉
            </h3>
            <p className="text-xs text-muted-foreground">
              {user ? 
                'Clique em "Publicar" para salvar seu cartão' :
                'Para publicar, faça login. Progresso salvo!'
              }
            </p>
            
            {published ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <div>
                  <span className="text-xs font-medium">Cartão publicado!</span>
                  <p className="text-xs text-muted-foreground">
                    Redirecionando...
                  </p>
                </div>
              </div>
            ) : (
              <Button
                onClick={handlePublish}
                disabled={saving}
                className="w-full h-8"
                variant="hero"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Upload className="w-3 h-3 mr-2" />
                    {user ? 'Publicar' : 'Login e Publicar'}
                  </>
                )}
              </Button>
            )}

            {!user && (
              <p className="text-xs text-muted-foreground italic">
                Após login, voltará para esta tela
              </p>
            )}
          </div>
        </div>
      </div>
    </StandardQuestionLayout>
  );
};
