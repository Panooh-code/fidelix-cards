import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { QuestionWizard } from "@/components/wizard/QuestionWizard";
import { CardPreviewWizard } from "@/components/wizard/CardPreview";
import { WizardProvider, useWizard } from "@/components/wizard/WizardContext";
import { useIsMobile } from "@/hooks/use-mobile";

const WizardPageContent = () => {
  const [searchParams] = useSearchParams();
  const { loadExistingCard, isEditMode } = useWizard();
  const editId = searchParams.get('edit');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (editId && !isEditMode) {
      loadExistingCard(editId);
    }
  }, [editId, loadExistingCard, isEditMode]);

  if (isMobile) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-subtle flex flex-col">
        {/* Card Preview Section - Fixed 35% */}
        <div className="h-[35vh] flex items-center justify-center p-3 bg-gradient-to-br from-muted/20 to-muted/10">
          <div className="scale-75">
            <CardPreviewWizard />
          </div>
        </div>

        {/* Form Section - Fixed 65% */}
        <div className="h-[65vh] flex flex-col">
          <QuestionWizard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Desktop Layout */}
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