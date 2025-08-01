import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { Globe, Instagram, Facebook, Linkedin, AlertCircle } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
}

export const Question6Social = ({ onNext, onPrev }: QuestionProps) => {
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
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold text-center mb-3">
        Rede social ou site (opcional)
      </h2>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-xs">
          <Input
            id="socialNetwork"
            type="url"
            placeholder="instagram.com/seunegocio"
            value={state.businessData.socialNetwork || ""}
            onChange={(e) => handleUrlChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-10 text-sm"
          />
          
          {state.businessData.socialNetwork && (
            <div className="text-center text-xs text-primary font-medium mt-2">
              {getUrlPreview()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};