import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWizard } from "./WizardContext";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FidelixTip } from "./FidelixTip";

// Importar todos os 15 componentes de pergunta
import { Question1Name } from "./questions/Question1Name";
import { Question2Segment } from "./questions/Question2Segment";
import { Question3Logo } from "./questions/Question3Logo";
import { Question4Phone } from "./questions/Question4Phone";
import { Question5Address } from "./questions/Question5Address";
import { Question6Social } from "./questions/Question6Social";
import { Question7PrimaryColor } from "./questions/Question7PrimaryColor";
import { Question8SecondaryColor } from "./questions/Question8SecondaryColor";
import { Question9Texture } from "./questions/Question9Texture";
import { Question10SealShape } from "./questions/Question10SealShape";
import { Question11SealCount } from "./questions/Question11SealCount";
import { Question12CardLimit } from "./questions/Question12CardLimit";
import { Question13Reward } from "./questions/Question13Reward";
import { Question14Rules } from "./questions/Question14Rules";
import { Question15Expiration } from "./questions/Question15Expiration";


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
    // Lógica de validação para cada passo
    switch (state.currentQuestion) {
      case 1: return !!state.businessData.name;
      case 2: return !!state.businessData.segment;
      case 3: return !!state.businessData.logoFile;
      case 4: return !!state.businessData.phone;
      case 7: return !!state.customization.primaryColor;
      case 8: return !!state.customization.backgroundColor;
      case 10: return !!state.rewardConfig.sealShape;
      case 11: return !!state.rewardConfig.sealCount;
      case 13: return !!state.rewardConfig.rewardDescription;
      case 14: return !!state.rewardConfig.instructions;
      // Perguntas opcionais permitem avançar sempre
      case 5:
      case 6:
      case 9:
      case 12:
      case 15:
      default: return true;
    }
  };

  const renderQuestion = () => {
    const questionProps = { onNext: handleNext, onPrev: handlePrev };
    switch (state.currentQuestion) {
      case 1: return <Question1Name {...questionProps} />;
      case 2: return <Question2Segment {...questionProps} />;
      case 3: return <Question3Logo {...questionProps} />;
      case 4: return <Question4Phone {...questionProps} />;
      case 5: return <Question5Address {...questionProps} />;
      case 6: return <Question6Social {...questionProps} />;
      case 7: return <Question7PrimaryColor {...questionProps} />;
      case 8: return <Question8SecondaryColor {...questionProps} />;
      case 9: return <Question9Texture {...questionProps} />;
      case 10: return <Question10SealShape {...questionProps} />;
      case 11: return <Question11SealCount {...questionProps} />;
      case 12: return <Question12CardLimit {...questionProps} />;
      case 13: return <Question13Reward {...questionProps} />;
      case 14: return <Question14Rules {...questionProps} />;
      case 15: return <Question15Expiration {...questionProps} />;
      default: return <Question1Name {...questionProps} />;
    }
  };

  return (
    <div className="border-0 overflow-hidden flex flex-col h-full">
      
      {/* iOS Style Progress Bar */}
      <div className="px-6 pt-6 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-fidelix-purple">
            Pergunta {state.currentQuestion} de {TOTAL_QUESTIONS}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-1 bg-fidelix-purple/10 [&>div]:bg-gradient-to-r [&>div]:from-fidelix-purple [&>div]:to-fidelix-purple-light" />
      </div>

      {/* Fidelix Tip - iOS Style */}
      <div className="px-6 py-2 flex items-center justify-center flex-shrink-0">
        <div className="bg-fidelix-purple/5 rounded-full px-4 py-2 border border-fidelix-purple/10">
          <FidelixTip questionNumber={state.currentQuestion} />
        </div>
      </div>

      {/* Question Content - iOS Style */}
      <div className={cn(
        "flex-1 transition-all duration-300 overflow-hidden px-6",
        isTransitioning ? "opacity-0 transform translate-y-2" : "opacity-100 transform translate-y-0"
      )}>
        <div className="h-full flex items-center justify-center">
          <div className="w-full max-w-sm">
            {renderQuestion()}
          </div>
        </div>
      </div>

      {/* iOS Style Navigation */}
      <div className="px-6 py-4 flex items-center justify-between flex-shrink-0 border-t border-fidelix-purple/10 bg-gradient-to-t from-fidelix-purple/2 to-transparent">
        <Button
          onClick={handlePrev}
          variant="ghost"
          size="lg"
          className="text-fidelix-purple hover:bg-fidelix-purple/10 border border-fidelix-purple/20 hover:border-fidelix-purple/30 rounded-full px-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
          
        <Button
          onClick={handleNext}
          variant="default"
          size="lg"
          disabled={!canAdvance()}
          className="bg-gradient-to-r from-fidelix-purple to-fidelix-purple-dark hover:from-fidelix-purple-dark hover:to-fidelix-purple text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full px-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.currentQuestion === TOTAL_QUESTIONS ? "Publicar" : "Avançar"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
