import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWizard } from "./WizardContext";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FidelixTip } from "./FidelixTip";

// Importar todos os 13 componentes de pergunta
import { Question1Name } from "./questions/Question1Name";
import { Question2Segment } from "./questions/Question2Segment";
import { Question3Logo } from "./questions/Question3Logo";
import { Question4Phone } from "./questions/Question4Phone";
import { Question5Address } from "./questions/Question5Address";
import { Question6Social } from "./questions/Question6Social";
import { Question7PrimaryColor } from "./questions/Question7PrimaryColor";
import { Question8SecondaryColor } from "./questions/Question8SecondaryColor";
import { Question11SealCount } from "./questions/Question11SealCount";
import { Question12CardLimit } from "./questions/Question12CardLimit";
import { Question13Reward } from "./questions/Question13Reward";
import { Question14Rules } from "./questions/Question14Rules";
import { Question15Expiration } from "./questions/Question15Expiration";


const TOTAL_QUESTIONS = 13;

export const QuestionWizard = () => {
  const { state, nextQuestion, prevQuestion, setComplete, isEditMode } = useWizard();
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
      case 3: return !!state.businessData.logoFile || !!state.businessData.logoUrl;
      case 4: return !!state.businessData.phone;
      case 7: return !!state.customization.primaryColor;
      case 8: return !!state.customization.backgroundColor;
      case 9: return !!state.rewardConfig.sealCount;
      case 11: return !!state.rewardConfig.rewardDescription;
      case 12: return !!state.rewardConfig.instructions;
      // Perguntas opcionais permitem avançar sempre
      case 5:
      case 6:
      case 10:
      case 13:
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
      case 9: return <Question11SealCount {...questionProps} />;
      case 10: return <Question12CardLimit {...questionProps} />;
      case 11: return <Question13Reward {...questionProps} />;
      case 12: return <Question14Rules {...questionProps} />;
      case 13: return <Question15Expiration {...questionProps} />;
      default: return <Question1Name {...questionProps} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 shadow-elegant border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm overflow-hidden flex flex-col">
        
        {/* Progress Bar */}
        <div className="px-3 pt-3 pb-2 flex-shrink-0">
          <Progress value={progress} className="h-1" />
        </div>

        {/* Tip Section */}
        <div className="px-3 py-1 flex items-center justify-center flex-shrink-0">
          <FidelixTip questionNumber={state.currentQuestion} />
        </div>

        {/* Question Content - Takes remaining space */}
        <div className={cn(
          "flex-1 transition-all duration-200 overflow-hidden min-h-0",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}>
          {renderQuestion()}
        </div>

        {/* Navigation Buttons */}
        <div className="px-2 py-2 border-t border-slate-200/80 bg-slate-50/50 dark:border-slate-700/50 dark:bg-slate-900/30 flex items-center justify-between flex-shrink-0">
          {state.currentQuestion > 1 && (
            <Button
              onClick={handlePrev}
              variant="ghost"
              size="sm"
              className="h-8"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Voltar
            </Button>
          )}
          
          {state.currentQuestion !== 13 && (
            <Button
              onClick={handleNext}
              variant="default"
              size="sm"
              disabled={!canAdvance()}
              className="bg-primary hover:bg-primary-glow h-8 ml-auto"
            >
              {state.currentQuestion === TOTAL_QUESTIONS ? "Publicar" : "Avançar"}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
