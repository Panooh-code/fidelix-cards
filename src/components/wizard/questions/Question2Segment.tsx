import { useWizard } from "../WizardContext";
import { Utensils, Shirt, Heart, Calendar, Monitor, GraduationCap, Stethoscope, MapPin, Gamepad2, Wrench, MoreHorizontal } from "lucide-react";
import { CompactSelect } from "../CompactSelect";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
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

export const Question2Segment = ({ onNext, onPrev }: QuestionProps) => {
  const { state, updateBusinessData } = useWizard();

  const handleSelect = (segmentId: string) => {
    updateBusinessData({ segment: segmentId });
  };

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold text-center mb-3">
        Segmento do negócio *
      </h2>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-xs">
          <CompactSelect
            options={segments}
            value={state.businessData.segment || ''}
            onValueChange={handleSelect}
            placeholder="Escolha seu segmento"
            showIcons={true}
            showDescriptions={true}
          />
        </div>
      </div>
    </div>
  );
};