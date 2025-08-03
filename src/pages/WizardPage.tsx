import { QuestionWizard } from "@/components/wizard/QuestionWizard";
import { CardPreviewWizard } from "@/components/wizard/CardPreview";
import { WizardProvider } from "@/components/wizard/WizardContext";

const WizardPage = () => {
  return (
    <WizardProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-fidelix-gray-light to-background/80">
        {/* Mobile Layout - iOS Style */}
        <div className="lg:hidden">
          <div className="min-h-screen flex flex-col">
            {/* Card Stage - Enhanced iOS Style */}
            <div className="relative bg-gradient-to-b from-fidelix-purple/5 to-fidelix-purple/10 border-b border-fidelix-purple/10">
              {/* Backlight Effect */}
              <div className="absolute inset-0 bg-gradient-radial from-fidelix-purple/8 via-transparent to-transparent opacity-60"></div>
              
              <div className="relative flex flex-col items-center justify-center py-8 px-6 min-h-[45vh]">
                {/* Stage Title */}
                <div className="mb-4">
                  <h1 className="text-lg font-medium text-fidelix-purple text-center">
                    Criando seu cartão
                  </h1>
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    Veja sua obra ganhar vida
                  </p>
                </div>

                {/* Enhanced Card Container with Hover Effect */}
                <div className="group perspective-1000 cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95">
                  <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-radial from-fidelix-purple/20 via-fidelix-purple/10 to-transparent rounded-3xl blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Card with Enhanced Shadows */}
                    <div className="relative transform transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
                      <CardPreviewWizard />
                    </div>
                    
                    {/* Reflection Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 rounded-3xl opacity-60 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section - iOS Card Style */}
            <div className="flex-1 p-4 pb-8">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30">
                <QuestionWizard />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Enhanced */}
        <div className="hidden lg:block">
          <div className="min-h-screen grid lg:grid-cols-2 gap-0">
            {/* Card Stage - Desktop */}
            <div className="relative bg-gradient-to-br from-fidelix-purple/5 via-fidelix-purple/8 to-fidelix-purple/3 flex items-center justify-center p-12 sticky top-0">
              {/* Backlight Effect */}
              <div className="absolute inset-0 bg-gradient-radial from-fidelix-purple/12 via-transparent to-transparent opacity-40"></div>
              
              <div className="relative flex flex-col items-center">
                {/* Stage Title */}
                <div className="mb-8">
                  <h1 className="text-2xl font-semibold text-fidelix-purple text-center">
                    Palco de criação
                  </h1>
                  <p className="text-muted-foreground text-center mt-2">
                    Seu cartão de fidelidade digital
                  </p>
                </div>

                {/* Enhanced Card Container */}
                <div className="group perspective-1000 cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95">
                  <div className="relative">
                    {/* Enhanced Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-radial from-fidelix-purple/25 via-fidelix-purple/15 to-transparent rounded-3xl blur-2xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* Card with Premium Shadows */}
                    <div className="relative transform transition-all duration-500 group-hover:shadow-premium group-hover:-translate-y-2 group-hover:rotate-y-5">
                      <div className="scale-125">
                        <CardPreviewWizard />
                      </div>
                    </div>
                    
                    {/* Enhanced Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/8 rounded-3xl opacity-70 pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section - Desktop */}
            <div className="bg-background/95 backdrop-blur-sm flex items-start justify-center p-8">
              <div className="w-full max-w-lg">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-slate-700/40">
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