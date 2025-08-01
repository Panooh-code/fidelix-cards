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
    <div className="p-4 space-y-4 h-full flex flex-col justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Textura da cartela
        </h2>
      </div>

      <div className="max-w-sm mx-auto">
        <CompactSelect
          options={patterns}
          value={state.customization.backgroundPattern || 'none'}
          onValueChange={handleSelect}
          placeholder="Escolha a textura"
          showIcons={true}
          showDescriptions={true}
        />
      </div>

      <div className="text-center text-xs text-muted-foreground max-w-sm mx-auto">
        O padrão aparece de forma sutil como marca d'água
      </div>
    </div>
  );
};