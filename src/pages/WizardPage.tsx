import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { QuestionWizard } from "@/components/wizard/QuestionWizard";
import { CardPreviewWizard } from "@/components/wizard/CardPreview";
import { WizardProvider, useWizard } from "@/components/wizard/WizardContext";

const WizardPageContent = () => {
  const [searchParams] = useSearchParams();
  const { loadExistingCard, isEditMode } = useWizard();
  const editId = searchParams.get('edit');

  useEffect(() => {
    if (editId && !isEditMode) {
      loadExistingCard(editId);
    }
  }, [editId, loadExistingCard, isEditMode]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="min-h-screen flex flex-col">
            {/* Fixed Card Preview */}
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/50 p-4">
              <div className="flex justify-center">
                <div className="scale-90">
            <CardPreviewWizard />
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="flex-1 p-4">
              <QuestionWizard />
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
                  <CardPreviewWizard />
                </div>
              </div>

              {/* Form Section */}
              <div className="bg-background flex items-start justify-center p-8">
                <div className="w-full max-w-lg">
                  <QuestionWizard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

const WizardPage = () => {
  return (
    <WizardProvider>
      <WizardPageContent />
    </WizardProvider>
  );
};

export default WizardPage;