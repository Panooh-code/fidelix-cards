import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWizard } from "./WizardContext";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FidelixTip } from "./FidelixTip";

// Import all question components
import { Question1Name } from "./questions/Question1Name";
// (Mantenha os imports das outras perguntas aqui)

const TOTAL_QUESTIONS = 15;

export const QuestionWizard = () => {
  const { state, nextQuestion, prevQuestion, setComplete } = useWizard();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const progress = (state.currentQuestion / TOTAL_QUESTIONS) * 100;

  const handleNext = () => {
    if (state.currentQuestion < TOTAL_QUESTIONS) {
      setIsTransitioning(true);
      setTimeout(() => {
        nextQuestion();
        setIsTransitioning(false);
      }, 200);
    } else {
      setComplete(true);
    }
  };

  const handlePrev = () => {
    if (state.currentQuestion === 1) {
      navigate('/');
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        prevQuestion();
        setIsTransitioning(false);
      }, 200);
    }
  };

  const canAdvance = () => {
    // A sua lógica para avançar continua aqui
    switch (state.currentQuestion) {
      case 1: return !!state.businessData.name;
      // ... outros casos
      default: return true;
    }
  };

  const renderQuestion = () => {
    const questionProps = { onNext: handleNext, onPrev: handlePrev };
    switch (state.currentQuestion) {
      case 1: return <Question1Name {...questionProps} />;
      // ... outros casos
      default: return <Question1Name {...questionProps} />; // Padrão para a primeira pergunta
    }
  };

  return (
    // CORREÇÃO: Removida a altura fixa 'h-[320px]' ou 'h-[420px]' para permitir que o conteúdo defina a altura.
    <Card className="shadow-elegant border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm overflow-hidden flex flex-col">
      
      {/* CORREÇÃO: Adicionado espaçamento (pb-2) para separar a barra da dica */}
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <Progress value={progress} className="h-1.5" />
      </div>

      <div className="px-4 py-1 flex items-center justify-center flex-shrink-0">
        <FidelixTip questionNumber={state.currentQuestion} />
      </div>

      {/* CORREÇÃO: 'flex-1' permite que esta área cresça e encolha, e removida a altura fixa */}
      <div className={cn(
        "flex-1 transition-all duration-200 overflow-hidden",
        isTransitioning ? "opacity-0" : "opacity-100"
      )}>
        {renderQuestion()}
      </div>

      {/* Navegação no rodapé */}
      <div className="px-4 py-3 border-t border-slate-200/80 bg-slate-50/50 dark:border-slate-700/50 dark:bg-slate-900/30 flex items-center justify-between flex-shrink-0">
        <Button
          onClick={handlePrev}
          variant="ghost"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar
        </Button>
          
        <Button
          onClick={handleNext}
          variant="default"
          size="sm"
          disabled={!canAdvance()}
          className="bg-primary hover:bg-primary-glow"
        >
          {state.currentQuestion === TOTAL_QUESTIONS ? "Publicar" : "Avançar"}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
};
