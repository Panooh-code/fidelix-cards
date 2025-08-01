import { Cat } from "lucide-react";
import { useWizard } from "./WizardContext";

interface FidelixTipProps {
  questionNumber: number;
}

const getTipsByQuestion = (question: number): string => {
  const tips: Record<number, string> = {
    1: "Nome pelo qual as pessoas conhecem o seu negócio.",
    2: "Área de atuação do seu negócio.",
    3: "Ícones quadrados e sem texto funcionam melhor!",
    4: "Seu nº de Whatsapp no cartão.",
    5: "Deixe as pessoas irem ao seu encontro!",
    6: "Leve os clientes para seu insta ou site.",
    7: "A cor predominante da sua marca.",
    8: "Use outra cor presente na sua marca.",
    9: "Personalize seu card com texturas e padrões.",
    10: "Eu prefiro estrelas. E você?",
    11: "Pegue leve, quanto menos selos, mais engajamento.",
    12: "Defina o número de cartões ou deixe ilimitado.",
    13: "Você pode oferecer descontos e brindes.",
    14: "Seja claro e objetivo.",
    15: "Definir um prazo final ajuda a criar senso de urgência."
  };

  return tips[question] || "Vamos criar algo incrível!";
};

export const FidelixTip = ({ questionNumber }: FidelixTipProps) => {
  const tip = getTipsByQuestion(questionNumber);

  return (
    <div className="text-xs text-muted-foreground bg-muted/30 rounded-full flex items-center gap-2 px-3 py-1">
      <span className="text-primary">🐱</span>
      <span className="truncate">{tip}</span>
    </div>
  );
};