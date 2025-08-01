import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image } from "lucide-react";
import { useWizard } from "./WizardContext";
import { toast } from "sonner";

interface Step1Props {
  onNext: () => void;
}

export const Step1BusinessData = ({ onNext }: Step1Props) => {
  const { state, updateBusinessData } = useWizard();
  const [logoPreview, setLogoPreview] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        updateBusinessData({ logoFile: file, logoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (!state.businessData.name || !state.businessData.phone || !state.businessData.email) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Step Header */}
      <div className="text-center pb-6 border-b border-border/20 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Passo 1: Dados do Negócio
        </h2>
        <p className="text-sm text-muted-foreground">
          Informe os dados básicos da sua empresa
        </p>
      </div>

      <div className="space-y-4">
        {/* Nome do Negócio */}
        <div>
          <Label htmlFor="businessName">Nome do Negócio *</Label>
          <Input
            id="businessName"
            placeholder="Ex: Café Central"
            value={state.businessData.name}
            onChange={(e) => updateBusinessData({ name: e.target.value })}
            className="mt-1"
          />
        </div>

        {/* Upload de Logo */}
        <div>
          <Label>Logo/Ícone do Negócio</Label>
          <div className="mt-2 flex items-center space-x-4">
            <div className="flex-1">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:bg-muted/10 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-16 h-16 object-contain rounded"
                    />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Clique para fazer upload
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Telefone */}
        <div>
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={state.businessData.phone}
            onChange={(e) => updateBusinessData({ phone: e.target.value })}
            className="mt-1"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            placeholder="contato@cafeecentral.com"
            value={state.businessData.email}
            onChange={(e) => updateBusinessData({ email: e.target.value })}
            className="mt-1"
          />
        </div>

        {/* Endereço */}
        <div>
          <Label htmlFor="address">Endereço Completo</Label>
          <Textarea
            id="address"
            placeholder="Rua das Flores, 123 - Centro - São Paulo/SP"
            value={state.businessData.address}
            onChange={(e) => updateBusinessData({ address: e.target.value })}
            className="mt-1"
            rows={3}
          />
        </div>

        {/* WhatsApp Business */}
        <div>
          <Label htmlFor="whatsapp">WhatsApp Business (opcional)</Label>
          <Input
            id="whatsapp"
            type="tel"
            placeholder="5511999999999 (só números)"
            value={state.businessData.phone}
            onChange={(e) => updateBusinessData({ phone: e.target.value })}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Formato: código do país + DDD + número (exemplo: 5511999999999)
          </p>
        </div>

        {/* Rede Social Principal */}
        <div>
          <Label htmlFor="socialNetwork">Principal Rede Social ou Site (opcional)</Label>
          <Input
            id="socialNetwork"
            type="url"
            placeholder="https://instagram.com/seunegocios ou https://seusite.com"
            value={state.businessData.socialNetwork || ""}
            onChange={(e) => updateBusinessData({ socialNetwork: e.target.value })}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Instagram, Facebook, LinkedIn ou site da empresa
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} variant="hero" size="lg">
          Próximo Passo
        </Button>
      </div>
    </div>
  );
};