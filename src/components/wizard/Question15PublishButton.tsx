import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWizard } from "./WizardContext";
import { useAuth } from "@/hooks/useAuth";
import { useLoyaltyCardSave } from "@/hooks/useLoyaltyCardSave";
import { Upload, CheckCircle } from "lucide-react";

export const Question15PublishButton = () => {
  const { state } = useWizard();
  const { user } = useAuth();
  const { saveCard, saving } = useLoyaltyCardSave();
  const navigate = useNavigate();
  const [published, setPublished] = useState(false);

  // Only show for question 15
  if (state.currentQuestion !== 15) {
    return null;
  }

  const handlePublish = async () => {
    if (!user) {
      navigate('/auth?redirect=/wizard');
      return;
    }

    const { success } = await saveCard(state);
    if (success) {
      setPublished(true);
      setTimeout(() => {
        navigate('/my-cards');
      }, 2000);
    }
  };

  return (
    <div className="px-4 pb-6">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30 p-4">
        <div className="text-center space-y-3">
          <h3 className="font-semibold text-primary">
            Tudo pronto! 🎉
          </h3>
          <p className="text-sm text-muted-foreground">
            {user ? 
              'Clique em "Publicar" para salvar seu cartão de fidelidade' :
              'Faça login para publicar seu cartão'
            }
          </p>
          
          {published ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Cartão publicado com sucesso!</span>
            </div>
          ) : (
            <Button
              onClick={handlePublish}
              disabled={saving}
              className="w-full h-12 text-base font-semibold bg-fidelix-purple hover:bg-fidelix-purple-dark"
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
        </div>
      </div>
    </div>
  );
};