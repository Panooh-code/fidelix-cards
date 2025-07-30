import { cn } from "@/lib/utils";
import { CheckCircle, Circle } from "lucide-react";

interface WizardStepsProps {
  currentStep: number;
}

export const WizardSteps = ({ currentStep }: WizardStepsProps) => {
  const steps = [
    { number: 1, title: "Dados do Negócio", description: "Nome, logo e contatos" },
    { number: 2, title: "Personalizar", description: "Cores e padrões" },
    { number: 3, title: "Configurar Selos", description: "Prêmios e regras" },
  ];

  return (
    <div className="flex justify-center">
      <div className="flex items-center space-x-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                  currentStep > step.number
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.number
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-muted text-muted-foreground"
                )}
              >
                {currentStep > step.number ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="font-semibold">{step.number}</span>
                )}
              </div>
              
              {/* Step Text */}
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    "font-medium text-sm",
                    currentStep >= step.number
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </div>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-16 h-0.5 mx-4 transition-colors duration-300",
                  currentStep > step.number
                    ? "bg-primary"
                    : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};