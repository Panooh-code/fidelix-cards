import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { Globe, Instagram, Facebook, Linkedin, AlertCircle } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
  canSkip: boolean;
}

export const Question6Social = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateBusinessData } = useWizard();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && state.businessData.socialNetwork) {
      onNext();
    }
  };

  const formatUrl = (value: string) => {
    if (!value) return value;
    
    // Se não começar com http, adiciona https://
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      return `https://${value}`;
    }
    return value;
  };

  const handleUrlChange = (value: string) => {
    updateBusinessData({ socialNetwork: value });
  };

  const getUrlPreview = () => {
    const url = state.businessData.socialNetwork || '';
    if (!url) return '';
    
    if (url.includes('instagram.com')) return '📸 Instagram';
    if (url.includes('facebook.com')) return '👥 Facebook';
    if (url.includes('linkedin.com')) return '💼 LinkedIn';
    if (url.includes('twitter.com') || url.includes('x.com')) return '🐦 Twitter/X';
    return '🌐 Website';
  };

  return (
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Qual sua principal rede social ou site?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Seus clientes poderão acompanhar você online
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 max-w-md mx-auto">
        <Label htmlFor="socialNetwork" className="text-base font-medium">
          URL da Rede Social ou Site (opcional)
        </Label>
        <div className="space-y-2">
          <Input
            id="socialNetwork"
            type="url"
            placeholder="instagram.com/seunegocios ou www.seusite.com"
            value={state.businessData.socialNetwork || ""}
            onChange={(e) => handleUrlChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-14 text-base"
            autoFocus
          />
          
          {/* URL Preview */}
          {state.businessData.socialNetwork && (
            <div className="text-sm text-primary font-medium">
              {getUrlPreview()} • {formatUrl(state.businessData.socialNetwork)}
            </div>
          )}
        </div>

        {/* Examples */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Exemplos:</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Instagram className="w-4 h-4" />
              <span>instagram.com/seunegocio</span>
            </div>
            <div className="flex items-center gap-2">
              <Facebook className="w-4 h-4" />
              <span>facebook.com/seunegocio</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>www.seusite.com.br</span>
            </div>
          </div>
        </div>

        {/* Skip Info */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-700 dark:text-amber-300">
              <p><strong>Opcional:</strong> Se você não quiser exibir sua rede social na cartela, pode pular esta etapa.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};