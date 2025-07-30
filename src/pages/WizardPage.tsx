import { useState } from "react";
import { Card } from "@/components/ui/card";
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
      <div className="min-h-screen bg-gradient-subtle">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="min-h-screen flex flex-col">
            {/* Fixed Card Preview */}
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/50 p-4">
              <div className="flex justify-center">
                <div className="scale-90">
                  <CardPreview />
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="flex-1 p-4">
              <Card className="shadow-elegant border-0 bg-card/50 backdrop-blur-sm">
                {renderStep()}
              </Card>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="min-h-screen">
            <div className="grid lg:grid-cols-2 gap-0 min-h-screen">
              {/* Preview Section */}
              <div className="bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center p-8 sticky top-0">
                <div className="scale-110">
                  <CardPreview />
                </div>
              </div>

              {/* Form Section */}
              <div className="bg-background flex items-start justify-center p-8">
                <div className="w-full max-w-lg">
                  <Card className="shadow-elegant border-0 bg-card/50 backdrop-blur-sm">
                    {renderStep()}
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WizardProvider>
  );
};

export default WizardPage;