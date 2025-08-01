import { Cat } from "lucide-react";
import { useWizard } from "./WizardContext";

interface FidelixTipProps {
  questionNumber: number;
}

const getTipBySegmentAndQuestion = (segment: string, question: number): string => {
  const tipsBySegment: Record<string, Record<number, string>> = {
    alimentacao: {
      1: "Nome claro atrai mais clientes",
      2: "Alimentação tem regras específicas",
      3: "Logo deve ser legível em pequeno",
      4: "WhatsApp é essencial para delivery",
      5: "Endereço facilita entregas",
      6: "Instagram é ideal para fotos de comida",
      7: "Use cores que despertem apetite",
      8: "Fundo claro destaca melhor",
      9: "Texturas remetem ao alimento",
      10: "Estrela é clássica para pontos",
      11: "5-10 selos para ticket médio",
      12: "Controle evita desperdício",
      13: "Ex: 'Ganhe um açaí grátis'",
      14: "Ex: 'A cada R$25 um selo'",
      15: "30 dias motiva uso rápido"
    },
    beleza: {
      1: "Nome elegante transmite qualidade",
      2: "Beleza foca em experiência",
      3: "Logo deve ser sofisticada",
      4: "WhatsApp para agendamentos",
      5: "Endereço gera confiança",
      6: "Instagram mostra trabalhos",
      7: "Cores elegantes e femininas",
      8: "Tons suaves são ideais",
      9: "Padrões delicados",
      10: "Coração combina com beleza",
      11: "8-12 selos para serviços",
      12: "Limite controla agenda",
      13: "Ex: 'Unha decorada grátis'",
      14: "Ex: 'A cada serviço um selo'",
      15: "60 dias para procedimentos"
    },
    tecnologia: {
      1: "Nome tech deve ser moderno",
      2: "Tecnologia é inovação",
      3: "Logo minimalista funciona",
      4: "WhatsApp Business é melhor",
      5: "Endereço para confiança",
      6: "LinkedIn para B2B",
      7: "Azul transmite confiança",
      8: "Cores neutras são seguras",
      9: "Padrões geométricos",
      10: "Quadrado é mais tech",
      11: "3-5 selos para alto valor",
      12: "Limite por segurança",
      13: "Ex: 'Consultoria gratuita'",
      14: "Ex: 'A cada R$500 um selo'",
      15: "90 dias para projetos"
    },
    moda: {
      1: "Nome deve ser fashion",
      2: "Moda é estilo pessoal",
      3: "Logo estilosa marca presença",
      4: "WhatsApp para novidades",
      5: "Endereço da loja física",
      6: "Instagram é fundamental",
      7: "Cores da moda atual",
      8: "Fundos que destacam produtos",
      9: "Texturas de tecidos",
      10: "Estrela é versátil",
      11: "6-10 selos conforme preço",
      12: "Controla estoque limitado",
      13: "Ex: 'Peça grátis na coleção'",
      14: "Ex: 'A cada R$100 um selo'",
      15: "45 dias para coleções"
    },
    saude: {
      1: "Nome profissional é essencial",
      2: "Saúde exige responsabilidade",
      3: "Logo deve transmitir confiança",
      4: "WhatsApp para emergências",
      5: "Endereço para consultas",
      6: "Facebook para informações",
      7: "Verde transmite saúde",
      8: "Cores suaves e calmas",
      9: "Padrões que relaxam",
      10: "Cruz é símbolo universal",
      11: "4-8 selos para consultas",
      12: "Limite por agenda médica",
      13: "Ex: 'Consulta de retorno grátis'",
      14: "Ex: 'A cada consulta um selo'",
      15: "120 dias para tratamentos"
    }
  };

  const segmentTips = tipsBySegment[segment];
  if (segmentTips && segmentTips[question]) {
    return segmentTips[question];
  }

  // Default tips
  const defaultTips: Record<number, string> = {
    1: "Nome claro é fundamental",
    2: "Escolha seu segmento",
    3: "Logo marca sua identidade",
    4: "Contato facilita relacionamento", 
    5: "Endereço gera confiança",
    6: "Redes sociais conectam",
    7: "Cor representa sua marca",
    8: "Fundo destaca conteúdo",
    9: "Textura dá personalidade",
    10: "Forma representa você",
    11: "Quantidade ideal de selos",
    12: "Controle de distribuição",
    13: "Recompensa atrativa",
    14: "Regras claras são essenciais",
    15: "Prazo cria urgência"
  };

  return defaultTips[question] || "Vamos criar algo incrível!";
};

export const FidelixTip = ({ questionNumber }: FidelixTipProps) => {
  const { state } = useWizard();
  const tip = getTipBySegmentAndQuestion(state.businessData.segment || '', questionNumber);

  return (
    <div className="text-xs text-muted-foreground bg-muted/30 rounded-full flex items-center gap-2 px-3 py-1">
      <span className="text-primary">🐱</span>
      <span>{tip}</span>
    </div>
  );
};