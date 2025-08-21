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
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold text-center mb-3">
        Validade (opcional)
      </h2>
      
      <div className="flex-1 flex flex-col justify-center space-y-3">
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

        <div className="mx-auto w-full max-w-xs">
          <div className="grid grid-cols-4 gap-1 mb-3">
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

          <div className="flex gap-2">
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
        </div>

        {/* Publish Section */}
        <div className="border-t pt-4 mt-4">
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-primary">
              Tudo pronto! 🎉
            </h3>
            <p className="text-sm text-muted-foreground">
              {user ? 
                'Clique em "Publicar" para salvar seu cartão de fidelidade' :
                'Para publicar seu cartão, você precisa fazer login. Seu progresso está salvo!'
              }
            </p>
            
            {published ? (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Cartão publicado com sucesso!</span>
                <p className="text-sm text-muted-foreground mt-1">
                  Redirecionando para seus cartões...
                </p>
              </div>
            ) : (
              <Button
                onClick={handlePublish}
                disabled={saving}
                className="w-full"
                variant="hero"
                size="lg"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {user ? 'Publicar Cartão' : 'Fazer Login e Publicar'}
                  </>
                )}
              </Button>
            )}

            {!user && (
              <p className="text-xs text-muted-foreground italic">
                Após o login, você voltará automaticamente para esta tela
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
