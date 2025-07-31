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
      // Don't auto-advance - user needs to click "Avançar"
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
    <div className="p-4 space-y-3 h-full flex flex-col justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Logo ou ícone *
        </h2>
      </div>

      <div className="max-w-sm mx-auto">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          className={`relative border-2 border-dashed rounded-lg transition-all cursor-pointer
            ${isDragging 
              ? 'border-primary bg-primary/5' 
              : logoPreview 
                ? 'border-primary/50 bg-primary/5' 
                : 'border-muted hover:border-primary/50'
            }`}
        >
          <label className="flex flex-col items-center justify-center w-full h-32 cursor-pointer">
            <div className="flex flex-col items-center justify-center p-2">
              {logoPreview ? (
                <div className="text-center">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-16 h-16 object-cover rounded-lg mx-auto mb-1"
                  />
                  <p className="text-xs text-primary font-medium">
                    ✅ Carregado!
                  </p>
                </div>
              ) : (
                <>
                  <Upload className={`w-6 h-6 mb-1 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="text-sm font-medium text-foreground text-center">
                    Clique ou arraste uma imagem
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG (máx 5MB)
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
      </div>
    </div>
  );
};