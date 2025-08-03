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
    <div className="h-full flex flex-col overflow-hidden">
      
      {/* Ultra Minimal Progress Bar */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="w-full bg-muted/20 rounded-full h-0.5">
          <div 
            className="bg-fidelix-purple h-0.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Fidelix Tip - Redesigned */}
      <div className="px-4 py-3 flex items-center justify-center flex-shrink-0">
        <FidelixTip questionNumber={state.currentQuestion} />
      </div>

      {/* Question Content - Better Spacing */}
      <div className={cn(
        "flex-1 min-h-0 transition-all duration-300 px-4 py-2",
        isTransitioning ? "opacity-0 transform translate-y-2" : "opacity-100 transform translate-y-0"
      )}>
        <div className="h-full flex flex-col justify-center">
          <div className="w-full">
            {renderQuestion()}
          </div>
        </div>
      </div>

      {/* Compact Navigation with Better Spacing */}
      <div className="px-4 py-4 flex items-center justify-between flex-shrink-0">
        <button
          onClick={handlePrev}
          className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Voltar
        </button>
        
        <button
          onClick={handleNext}
          disabled={!canAdvance()}
          className="px-4 py-2 bg-fidelix-purple text-white text-sm font-medium rounded-lg hover:bg-fidelix-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {state.currentQuestion === TOTAL_QUESTIONS ? 'Publicar' : 'Avançar'}
        </button>
      </div>
    </div>
  );
};
