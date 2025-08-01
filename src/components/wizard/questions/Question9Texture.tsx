import { useWizard } from "../WizardContext";
import { Grid3X3, Waves, Minus, Circle, MoreHorizontal } from "lucide-react";
import { CompactSelect } from "../CompactSelect";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
}

const patterns = [
  { 
    id: 'none',
    name: "Sem Padrão", 
    icon: MoreHorizontal,
    description: 'Limpo e minimalista'
  },
  { 
    id: 'dots',
    name: "Pontos", 
    icon: Circle,
    description: 'Textura sutil com pontos'
  },
  { 
    id: 'lines',
    name: "Linhas", 
    icon: Minus,
    description: 'Padrão diagonal discreto'
  },
  { 
    id: 'waves',
    name: "Ondas", 
    icon: Waves,
    description: 'Ondas suaves e elegantes'
  },
  { 
    id: 'grid',
    name: "Grade", 
    icon: Grid3X3,
    description: 'Grade organizada e profissional'
  },
];

export const Question9Texture = ({ onNext, onPrev }: QuestionProps) => {
  const { state, updateCustomization } = useWizard();

  const handleSelect = (pattern: string) => {
    updateCustomization({ backgroundPattern: pattern as 'dots' | 'lines' | 'waves' | 'grid' | 'none' });
  };

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold text-center mb-3">
        Textura da cartela
      </h2>
      
      <div className="flex-1 flex flex-col justify-center space-y-3">
        <div className="mx-auto w-full max-w-xs">
          <CompactSelect
            options={patterns}
            value={state.customization.backgroundPattern || 'none'}
            onValueChange={handleSelect}
            placeholder="Escolha a textura"
            showIcons={true}
            showDescriptions={true}
          />
        </div>

        <div className="text-center text-xs text-muted-foreground">
          O padrão aparece de forma sutil como marca d'água
        </div>
      </div>
    </div>
  );
};