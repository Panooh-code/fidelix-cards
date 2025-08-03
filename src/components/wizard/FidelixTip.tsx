import { useWizard } from "./WizardContext";
import { useState, useEffect } from "react";
import catIcon1 from "@/assets/cat-icon-1.png";
import catIcon2 from "@/assets/cat-icon-2.png";
import catIcon3 from "@/assets/cat-icon-3.png";
import catIcon4 from "@/assets/cat-icon-4.png";
import catIcon5 from "@/assets/cat-icon-5.png";

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

// Array de ícones de gato personalizados
const catIcons = [catIcon1, catIcon2, catIcon3, catIcon4, catIcon5];

const getRandomCatIcon = () => {
  return catIcons[Math.floor(Math.random() * catIcons.length)];
};

export const FidelixTip = ({ questionNumber }: FidelixTipProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [randomCat] = useState(getRandomCatIcon());
  const tip = getTipsByQuestion(questionNumber);

  useEffect(() => {
    setDisplayedText("");
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < tip.length) {
        setDisplayedText(tip.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [tip]);

  return (
    <div className="flex items-center gap-3 max-w-full">
      {/* Cat Icon */}
      <div className="flex-shrink-0 w-[40px] h-[40px] flex items-center justify-center">
        <img src={randomCat} alt="Fidelix Cat" className="w-full h-full object-contain rounded-full" />
      </div>
      
      {/* Speech Bubble - Optimized for 2 Lines */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl px-4 py-2 border border-fidelix-purple/20 shadow-sm min-h-[40px] flex items-center flex-1 max-w-[calc(100vw-120px)]">
        <span className="text-xs text-fidelix-purple font-medium leading-relaxed break-words">
          {displayedText}
          <span className="animate-pulse">|</span>
        </span>
      </div>
    </div>
  );
};