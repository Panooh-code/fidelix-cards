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
    setTimeout(onNext, 200); // Auto-advance after selection
  };

  return (
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-foreground">
          Qual é o segmento do seu negócio?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Isso nos ajuda a personalizar melhor sua cartela
        </p>
      </div>

      {/* Segment Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
        {segments.map((segment) => {
          const IconComponent = segment.icon;
          const isSelected = state.businessData.segment === segment.id;
          
          return (
            <button
              key={segment.id}
              onClick={() => handleSelect(segment.id)}
              className={cn(
                "p-4 rounded-xl border-2 transition-all hover:scale-[1.02] text-left",
                "flex items-start gap-3",
                isSelected
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-muted hover:border-primary/50 hover:shadow-sm"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                isSelected ? "bg-primary/20" : "bg-muted/50"
              )}>
                <IconComponent className={cn(
                  "w-5 h-5",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <div className="min-w-0 flex-1">
                <div className={cn(
                  "font-medium",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {segment.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {segment.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};