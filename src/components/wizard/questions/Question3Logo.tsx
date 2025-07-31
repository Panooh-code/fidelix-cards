import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useWizard } from "../WizardContext";
import { Upload, Image as ImageIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
  canSkip: boolean;
}

export const Question3Logo = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateBusinessData } = useWizard();
  const [logoPreview, setLogoPreview] = useState<string>(state.businessData.logoUrl || "");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 5MB.");
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione uma imagem válida.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      updateBusinessData({ logoFile: file, logoUrl: result });
      setTimeout(onNext, 500); // Auto-advance after upload
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Adicione a marca ou ícone do seu negócio
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Uma imagem quadrada funciona melhor na cartela
        </p>
      </div>

      {/* Upload Area */}
      <div className="max-w-md mx-auto">
        <Label className="text-base font-medium mb-3 block">
          Logo/Ícone *
        </Label>
        
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer
            ${isDragging 
              ? 'border-primary bg-primary/5' 
              : logoPreview 
                ? 'border-primary/50 bg-primary/5' 
                : 'border-muted hover:border-primary/50 hover:bg-muted/10'
            }`}
        >
          <label className="flex flex-col items-center justify-center w-full h-48 cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {logoPreview ? (
                <div className="space-y-3">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                  <p className="text-sm text-primary font-medium">
                    ✅ Imagem carregada com sucesso!
                  </p>
                </div>
              ) : (
                <>
                  <Upload className={`w-10 h-10 mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="text-base font-medium text-foreground mb-1">
                    Clique aqui ou arraste sua imagem
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG até 5MB
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        {/* Helper */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Dica:</strong> Use uma imagem quadrada com fundo transparente ou branco para melhor resultado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};