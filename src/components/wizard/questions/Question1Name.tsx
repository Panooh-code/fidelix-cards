import { Input } from "@/components/ui/input";
import { useWizard } from "@/components/wizard/WizardContext";
import { Building2 } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
}

export const Question1Name = ({ onNext, onPrev }: QuestionProps) => {
  const { state, updateBusinessData } = useWizard();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && state.businessData.name) {
      onNext();
    }
  };

  return (
    // O div principal continua igual
    <div className="h-full flex flex-col p-4 text-center animate-fade-in">
      
      {/* MUDANÇA 1: TÍTULO
        - Aumentamos o tamanho da fonte para 'text-2xl' para mais destaque.
        - Aumentamos a margem inferior para 'mb-6' para dar mais espaço.
        - Trocamos a fonte para 'font-poppins' para consistência com a marca.
      */}
      <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-6">
        Qual o nome do seu negócio?
      </h2>
      
      {/* Área de Conteúdo */}
      <div className="flex-1 flex flex-col justify-center">
        {/* MUDANÇA 2: ORGANIZAÇÃO E ESPAÇAMENTO
          - Usamos um 'div' com 'space-y-2' para criar um espaçamento vertical
            consistente entre o campo de input e o texto de ajuda.
        */}
        <div className="mx-auto w-full max-w-xs space-y-2">
          
          {/* MUDANÇA 3: CAMPO DE INPUT PROFISSIONAL */}
          <div className="relative w-full">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              id="businessName"
              placeholder="Ex: Café Central"
              value={state.businessData.name}
              onChange={(e) => updateBusinessData({ name: e.target.value })}
              onKeyPress={handleKeyPress}
              className="h-12 text-base text-center pl-10 pr-4 bg-white border-2 border-slate-200 focus:border-primary focus:ring-primary rounded-lg"
              autoFocus
            />
          </div>

          {/* MUDANÇA 4: TEXTO DE AJUDA */}
          <p className="text-xs text-slate-500 px-2">
            Este será o nome principal no seu cartão de fidelidade.
          </p>
        </div>
      </div>
    </div>
  );
};