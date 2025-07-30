import { useState } from "react";
import { Card } from "@/components/ui/card";
import { WizardSteps } from "@/components/wizard/WizardSteps";
import { Step1BusinessData } from "@/components/wizard/Step1BusinessData";
import { Step2Customize } from "@/components/wizard/Step2Customize";
import { Step3SetupRewards } from "@/components/wizard/Step3SetupRewards";
import { CardPreview } from "@/components/wizard/CardPreview";
import { WizardProvider } from "@/components/wizard/WizardContext";

const WizardPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BusinessData onNext={() => setCurrentStep(2)} />;
      case 2:
        return <Step2Customize onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />;
      case 3:
        return <Step3SetupRewards onBack={() => setCurrentStep(2)} />;
      default:
        return null;
    }
  };

  return (
    <WizardProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Criar Cartela de Fidelidade
              </h1>
              <p className="text-muted-foreground text-sm">
                Configure sua cartela em 3 passos simples
              </p>
            </div>

            {/* Steps Navigation */}
            <WizardSteps currentStep={currentStep} />

            {/* Fixed Card Preview */}
            <div className="sticky top-4 z-10 mb-6">
              <Card className="p-4 shadow-soft bg-background/95 backdrop-blur-sm border-2">
                <div className="flex justify-center">
                  <div className="scale-75">
                    <CardPreview />
                  </div>
                </div>
              </Card>
            </div>

            {/* Form Section */}
            <Card className="p-6 shadow-soft">
              {renderStep()}
            </Card>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Criar Cartela de Fidelidade
              </h1>
              <p className="text-muted-foreground text-lg">
                Configure sua cartela em 3 passos simples e veja o resultado em tempo real
              </p>
            </div>

            {/* Steps Navigation */}
            <WizardSteps currentStep={currentStep} />

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-8 mt-8">
              {/* Form Section */}
              <div className="space-y-6">
                <Card className="p-6 shadow-soft">
                  {renderStep()}
                </Card>
              </div>

              {/* Preview Section */}
              <div className="space-y-6">
                <Card className="p-6 shadow-soft bg-muted/30 sticky top-8">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    Preview da Cartela
                  </h3>
                  <CardPreview />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WizardProvider>
  );
};

export default WizardPage;