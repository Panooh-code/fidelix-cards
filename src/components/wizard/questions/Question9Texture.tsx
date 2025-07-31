import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { Grid3X3, Waves, Minus, Circle, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
  canSkip: boolean;
}

const patterns = [
  { 
    name: "Sem Padrão", 
    value: 'none' as const, 
    icon: MoreHorizontal,
    preview: '',
    description: 'Limpo e minimalista'
  },
  { 
    name: "Pontos", 
    value: 'dots' as const, 
    icon: Circle,
    preview: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
    description: 'Textura sutil com pontos'
  },
  { 
    name: "Linhas", 
    value: 'lines' as const, 
    icon: Minus,
    preview: 'linear-gradient(45deg, currentColor 1px, transparent 1px)',
    description: 'Padrão diagonal discreto'
  },
  { 
    name: "Ondas", 
    value: 'waves' as const, 
    icon: Waves,
    preview: 'repeating-linear-gradient(0deg, currentColor, currentColor 2px, transparent 2px, transparent 20px)',
    description: 'Ondas suaves e elegantes'
  },
  { 
    name: "Grade", 
    value: 'grid' as const, 
    icon: Grid3X3,
    preview: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
    description: 'Grade organizada e profissional'
  },
];

export const Question9Texture = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateCustomization } = useWizard();

  const handleSelect = (pattern: 'dots' | 'lines' | 'waves' | 'grid' | 'none') => {
    updateCustomization({ backgroundPattern: pattern });
    // Don't auto-advance - user needs to click "Avançar"
  };

  return (
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Grid3X3 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Escolha a textura da cartela
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Adicione um padrão sutil para dar mais personalidade
        </p>
      </div>

      {/* Pattern Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {patterns.map((pattern) => {
          const IconComponent = pattern.icon;
          const isSelected = state.customization.backgroundPattern === pattern.value;
          
          return (
            <button
              key={pattern.value}
              onClick={() => handleSelect(pattern.value)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all hover:scale-[1.02] text-left",
                isSelected
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-muted hover:border-primary/50 hover:shadow-sm"
              )}
            >
              <div className="space-y-3">
                {/* Pattern Preview */}
                <div 
                  className="w-full h-16 rounded-lg border bg-white relative overflow-hidden"
                  style={{
                    backgroundImage: pattern.preview,
                    backgroundSize: pattern.value === 'grid' ? '10px 10px' : '10px 10px',
                    color: `${state.customization.primaryColor}20`
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IconComponent className={cn(
                      "w-6 h-6",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                </div>

                {/* Pattern Info */}
                <div>
                  <div className={cn(
                    "font-medium mb-1",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {pattern.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {pattern.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tip */}
      <div className="text-center text-sm text-muted-foreground max-w-sm mx-auto">
        💡 O padrão aparece de forma sutil como marca d'água
      </div>
    </div>
  );
};