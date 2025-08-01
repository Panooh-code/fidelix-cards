import { Cat } from "lucide-react";
import { useWizard } from "./WizardContext";

interface FidelixTipProps {
  questionNumber: number;
}

const getTipBySegmentAndQuestion = (segment: string, question: number) => {
  const tips = {
    alimentacao: {
      2: "Restaurantes adoram recompensar clientes fiéis!",
      13: "Que tal uma sobremesa grátis ou desconto na próxima refeição?",
      11: "6-8 carimbos funciona bem para restaurantes"
    },
    beleza: {
      2: "Salões têm ótimos resultados com fidelização!",
      13: "Uma sessão gratuita é sempre um prêmio irresistível",
      11: "5-7 carimbos é ideal para serviços de beleza"
    },
    tecnologia: {
      2: "Tech stores se beneficiam muito de programas de fidelidade",
      13: "Desconto na próxima compra funciona muito bem!",
      11: "3-5 carimbos para produtos de tecnologia"
    },
    moda: {
      2: "Lojas de moda adoram clientes que voltam sempre!",
      13: "Desconto percentual ou peça grátis são ideais",
      11: "4-6 carimbos para roupas e acessórios"
    },
    saude: {
      2: "Clínicas de saúde valorizam muito a fidelização",
      13: "Consulta ou exame com desconto especial",
      11: "3-5 carimbos para serviços de saúde"
    }
  };

  const segmentTips = tips[segment as keyof typeof tips];
  if (segmentTips && segmentTips[question as keyof typeof segmentTips]) {
    return segmentTips[question as keyof typeof segmentTips];
  }

  // Default tips
  const defaultTips = {
    2: "Escolha o segmento que melhor representa seu negócio",
    7: "Use a cor principal da sua marca",
    8: "Uma cor complementar deixa tudo mais bonito",
    9: "Texturas sutis dão um toque especial",
    10: "Escolha uma forma que combine com sua marca",
    11: "Nem muito poucos, nem muitos carimbos",
    13: "Pense em algo que seus clientes realmente querem",
    default: "Vamos criar algo incrível para seu negócio!"
  };

  return defaultTips[question as keyof typeof defaultTips] || defaultTips.default;
};

export const FidelixTip = ({ questionNumber }: FidelixTipProps) => {
  const { state } = useWizard();
  const tip = getTipBySegmentAndQuestion(state.businessData.segment || '', questionNumber);

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg mx-4 mb-2">
      <Cat className="w-3 h-3 text-primary flex-shrink-0" />
      <span className="truncate">{tip}</span>
    </div>
  );
};