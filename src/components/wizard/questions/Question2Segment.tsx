import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { Utensils, Shirt, Heart, Calendar, Monitor, GraduationCap, Stethoscope, MapPin, Gamepad2, Wrench, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
  canSkip: boolean;
}

const segments = [
  { id: 'alimentacao', name: 'Alimentação', icon: Utensils, description: 'Restaurantes, cafés, lanchonetes' },
  { id: 'moda', name: 'Moda', icon: Shirt, description: 'Roupas, acessórios, calçados' },
  { id: 'beleza', name: 'Beleza', icon: Heart, description: 'Salões, clínicas estéticas, spas' },
  { id: 'eventos', name: 'Eventos', icon: Calendar, description: 'Festas, casamentos, formaturas' },
  { id: 'tecnologia', name: 'Tecnologia', icon: Monitor, description: 'Informática, celulares, eletrônicos' },
  { id: 'educacao', name: 'Educação', icon: GraduationCap, description: 'Escolas, cursos, treinamentos' },
  { id: 'saude', name: 'Saúde e Bem-estar', icon: Stethoscope, description: 'Clínicas, farmácias, academias' },
  { id: 'turismo', name: 'Turismo', icon: MapPin, description: 'Hotéis, agências, pousadas' },
  { id: 'entretenimento', name: 'Entretenimento', icon: Gamepad2, description: 'Cinema, jogos, diversão' },
  { id: 'servicos', name: 'Serviços', icon: Wrench, description: 'Manutenção, consultoria, reparos' },
  { id: 'outros', name: 'Outros', icon: MoreHorizontal, description: 'Outros segmentos' },
];

export const Question2Segment = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateBusinessData } = useWizard();

  const handleSelect = (segmentId: string) => {
    updateBusinessData({ segment: segmentId });
    // Don't auto-advance - user needs to click "Avançar"
  };

  return (
    <div className="p-4 space-y-3 h-full flex flex-col justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Segmento do negócio
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        {segments.map((segment) => {
          const IconComponent = segment.icon;
          const isSelected = state.businessData.segment === segment.id;
          
          return (
            <button
              key={segment.id}
              onClick={() => handleSelect(segment.id)}
              className={cn(
                "p-2 rounded-lg border transition-all text-center",
                "flex flex-col items-center gap-1",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-muted hover:border-primary/50"
              )}
            >
              <IconComponent className={cn(
                "w-4 h-4",
                isSelected ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {segment.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};