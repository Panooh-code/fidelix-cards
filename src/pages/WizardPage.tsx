import { QuestionWizard } from "@/components/wizard/QuestionWizard";
import { CardPreviewWizard } from "@/components/wizard/CardPreview";
import { WizardProvider } from "@/components/wizard/WizardContext";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";

const WizardPage = () => {
  return (
    <WizardProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-fidelix-gray-light to-background/80">
        {/* Mobile Layout - iOS Style */}
        <div className="lg:hidden h-screen flex flex-col overflow-hidden pt-8">
          {/* Logo Header */}
          <div className="flex-shrink-0 pb-4 flex justify-center">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <Logo className="h-6 w-auto" />
            </Link>
          </div>

          {/* Card Stage - Optimized */}
          <div className="flex-shrink-0 h-[28vh] relative bg-gradient-to-b from-fidelix-purple/5 to-fidelix-purple/10">
            {/* Backlight Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-fidelix-purple/8 via-transparent to-transparent opacity-60"></div>
            
            <div className="relative h-full flex items-center justify-center px-6">
              {/* Card Container - Independent Interaction */}
              <div className="relative">
                <CardPreviewWizard />
              </div>
            </div>
          </div>

          {/* Form Section - Increased Height */}
          <div className="flex-1 min-h-0 p-4">
            <div className="h-[40vh] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30 overflow-hidden">
              <QuestionWizard />
            </div>
          </div>
        </div>

        {/* Desktop Layout - Enhanced */}
        <div className="hidden lg:block h-screen overflow-hidden">
          <div className="h-full grid lg:grid-cols-2 gap-0">
            {/* Card Stage - Desktop */}
            <div className="relative bg-gradient-to-br from-fidelix-purple/5 via-fidelix-purple/8 to-fidelix-purple/3 flex flex-col">
              {/* Logo Header */}
              <div className="flex-shrink-0 p-4 flex justify-center">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                  <Logo className="h-8 w-auto" />
                </Link>
              </div>

              {/* Card Area */}
              <div className="flex-1 flex items-center justify-center p-8">
                {/* Backlight Effect */}
                <div className="absolute inset-0 bg-gradient-radial from-fidelix-purple/12 via-transparent to-transparent opacity-40"></div>
                
                <div className="relative">
                  {/* Enhanced Card Container */}
                  <div className="relative scale-125">
                    <CardPreviewWizard />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section - Desktop */}
            <div className="bg-background/95 backdrop-blur-sm flex items-center justify-center p-8">
              <div className="w-full max-w-lg h-[70vh]">
                <div className="h-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-slate-700/40 overflow-hidden">
                  <QuestionWizard />
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