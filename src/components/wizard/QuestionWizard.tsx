import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWizard } from "./WizardContext";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Import all question components
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
  const { state, setCurrentQuestion, nextQuestion, prevQuestion, setComplete } = useWizard();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const progress = (state.currentQuestion / TOTAL_QUESTIONS) * 100;

  const handleNext = () => {
    if (state.currentQuestion < TOTAL_QUESTIONS) {
      setIsTransitioning(true);
      setTimeout(() => {
        nextQuestion();
        setIsTransitioning(false);
      }, 150);
    } else {
      // Finish wizard
      setComplete(true);
    }
  };

  const handlePrev = () => {
    if (state.currentQuestion > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        prevQuestion();
        setIsTransitioning(false);
      }, 150);
    }
  };

  const canSkip = () => {
    const skippableQuestions = [5, 6, 12, 15]; // Address, Social, Card limit, Expiration
    return skippableQuestions.includes(state.currentQuestion);
  };

  const canAdvance = () => {
    switch (state.currentQuestion) {
      case 1: return !!state.businessData.name;
      case 2: return !!state.businessData.segment;
      case 3: return !!state.businessData.logoFile;
      case 4: return !!state.businessData.phone;
      case 5: return true; // Optional
      case 6: return true; // Optional
      case 7: return !!state.customization.primaryColor;
      case 8: return !!state.customization.backgroundColor;
      case 9: return !!state.customization.backgroundPattern;
      case 10: return !!state.rewardConfig.sealShape;
      case 11: return !!state.rewardConfig.sealCount;
      case 12: return true; // Optional
      case 13: return !!state.rewardConfig.rewardDescription;
      case 14: return !!state.rewardConfig.instructions;
      case 15: return true; // Optional
      default: return false;
    }
  };

  const renderQuestion = () => {
    const questionProps = {
      onNext: handleNext,
      onPrev: handlePrev,
      canSkip: canSkip(),
    };

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
      default: return null;
    }
  };

  return (
    <Card className="shadow-elegant border-0 bg-card/50 backdrop-blur-sm overflow-hidden max-h-[300px] flex flex-col">
      {/* Progress Bar */}
      <div className="p-2 border-b border-border/20 flex-shrink-0">
        <Progress value={progress} className="h-1" />
      </div>

      {/* Question Content */}
      <div className={cn(
        "flex-1 transition-all duration-300 overflow-hidden",
        isTransitioning ? "opacity-50 transform translate-x-2" : "opacity-100 transform translate-x-0"
      )}>
        {renderQuestion()}
      </div>

      {/* Navigation Buttons */}
      <div className="p-3 border-t border-border/20 bg-muted/30 flex-shrink-0">
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrev}
            variant="outline"
            size="sm"
            disabled={state.currentQuestion === 1}
            className="h-8 px-3"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Voltar
          </Button>

          <div className="flex items-center gap-2">
            {canSkip() && (
              <Button
                onClick={handleNext}
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-8 px-3"
              >
                Pular
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              variant="hero"
              size="sm"
              disabled={!canAdvance() && !canSkip()}
              className="h-8 px-3"
            >
              {state.currentQuestion === TOTAL_QUESTIONS ? "Publicar" : "Avançar"}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};