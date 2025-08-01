import { Cat } from "lucide-react";
import { useWizard } from "./WizardContext";

interface FidelixTipProps {
  questionNumber: number;
}

const getTipBySegmentAndQuestion = (segment: string, question: number): string => {
  const tipsBySegment: Record<string, Record<number, string>> = {
    alimentacao: {
      1: "Nome marcante gera fidelização",
      2: "Alimentação motiva retorno frequente",
      3: "Logo no cartão cria reconhecimento",
      4: "Contato direto aumenta engajamento",
      5: "Localização facilita entregas",
      6: "Redes sociais divulgam promoções",
      7: "Cor primária marca sua identidade",
      8: "Fundo claro destaca selos",
      9: "Textura adiciona personalidade",
      10: "Formato do selo é sua assinatura",
      11: "Quantidade ideal motiva cliente",
      12: "Limite controla distribuição",
      13: "Recompensa atrativa gera fidelidade",
      14: "Regras claras evitam confusão",
      15: "Prazo cria senso de urgência"
    },
    beleza: {
      1: "Nome elegante atrai clientes",
      2: "Beleza valoriza experiência única",
      3: "Logo sofisticada no cartão",
      4: "WhatsApp facilita agendamentos",
      5: "Endereço gera credibilidade",
      6: "Instagram mostra seus trabalhos",
      7: "Cores femininas conquistam",
      8: "Tons suaves valorizam cartão",
      9: "Padrões delicados encantam",
      10: "Coração conecta com público",
      11: "Selos ideais para serviços",
      12: "Controle de cartelas por agenda",
      13: "Prêmio atrativo fideliza cliente",
      14: "Como ganhar deve ser claro",
      15: "Tempo suficiente para usar"
    },
    tecnologia: {
      1: "Nome tech transmite inovação",
      2: "Tecnologia é sobre soluções",
      3: "Logo clean funciona melhor",
      4: "WhatsApp Business é essencial",
      5: "Endereço para credibilidade",
      6: "LinkedIn conecta profissionais",
      7: "Azul transmite confiança tech",
      8: "Cores neutras são universais",
      9: "Padrões geométricos são modernos",
      10: "Formas tech atraem público",
      11: "Poucos selos para alto valor",
      12: "Limite por questões de segurança",
      13: "Recompensa de valor agregado",
      14: "Regras técnicas bem definidas",
      15: "Prazo longo para projetos"
    },
    moda: {
      1: "Nome fashion marca estilo",
      2: "Moda é expressão pessoal",
      3: "Logo estilosa no cartão",
      4: "WhatsApp para novidades",
      5: "Localização da loja física",
      6: "Instagram é fundamental na moda",
      7: "Cores da moda atual",
      8: "Fundo que destaca produtos",
      9: "Texturas remetem a tecidos",
      10: "Estrela é versátil na moda",
      11: "Selos conforme faixa de preço",
      12: "Controla peças limitadas",
      13: "Peça grátis motiva compra",
      14: "Valor por selo deve ser justo",
      15: "Tempo para usar nova coleção"
    },
    saude: {
      1: "Nome profissional gera confiança",
      2: "Saúde exige responsabilidade",
      3: "Logo transmite credibilidade",
      4: "Contato para emergências",
      5: "Endereço para consultas",
      6: "Redes para informações úteis",
      7: "Verde simboliza saúde",
      8: "Cores calmas relaxam paciente",
      9: "Padrões suaves acalmam",
      10: "Cruz é símbolo universal",
      11: "Selos adequados para consultas",
      12: "Limite conforme agenda médica",
      13: "Consulta grátis incentiva retorno",
      14: "Regras médicas claras",
      15: "Prazo longo para tratamentos"
    }
  };

  const segmentTips = tipsBySegment[segment];
  if (segmentTips && segmentTips[question]) {
    return segmentTips[question];
  }

  // Default tips
  const defaultTips: Record<number, string> = {
    1: "Nome marcante gera fidelização",
    2: "Segmento define estratégia",
    3: "Logo no cartão marca presença",
    4: "Contato direto aumenta vendas", 
    5: "Endereço facilita localização",
    6: "Redes sociais divulgam cartão",
    7: "Cor primária é sua identidade",
    8: "Fundo claro destaca selos",
    9: "Textura adiciona charme",
    10: "Formato único do seu selo",
    11: "Quantidade ideal motiva cliente",
    12: "Controle inteligente de cartelas",
    13: "Prêmio atrativo fideliza",
    14: "Regras simples funcionam melhor",
    15: "Prazo gera senso de urgência"
  };

  return defaultTips[question] || "Vamos criar algo incrível!";
};

export const FidelixTip = ({ questionNumber }: FidelixTipProps) => {
  const { state } = useWizard();
  const tip = getTipBySegmentAndQuestion(state.businessData.segment || '', questionNumber);

  return (
    <div className="text-xs text-muted-foreground bg-muted/30 rounded-full flex items-center gap-1.5 px-2.5 py-0.5">
      <span className="text-primary">🐱</span>
      <span>{tip}</span>
    </div>
  );
};