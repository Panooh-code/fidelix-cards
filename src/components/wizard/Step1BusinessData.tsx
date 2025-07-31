import React, { useState } from "react";
import { useWizard } from "./WizardContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";


interface Step1Props {
  onNext: () => void;
}

const countries = [
  { code: '+55', name: 'Brasil', flag: '🇧🇷' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹' },
  { code: '+1', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+44', name: 'Reino Unido', flag: '🇬🇧' },
  { code: '+34', name: 'Espanha', flag: '🇪🇸' },
  { code: '+33', name: 'França', flag: '🇫🇷' },
];

export const Step1BusinessData = ({ onNext }: Step1Props) => {
  const { state, updateBusinessData } = useWizard();
  const [logoPreview, setLogoPreview] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Arquivo muito grande. Máximo 5MB.");
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
      alert("Preencha os campos obrigatórios: Nome, Telefone e Email");
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

        {/* Telefone com código do país */}
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone Principal *</Label>
          <div className="flex gap-2">
            <Select 
              value={state.businessData.phoneCountryCode} 
              onValueChange={(value) => updateBusinessData({ phoneCountryCode: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.flag} {country.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="phone"
              type="tel"
              placeholder="(xx) xxxxx-xxxx"
              value={state.businessData.phone}
              onChange={(e) => updateBusinessData({ phone: e.target.value })}
              className="flex-1"
            />
          </div>
          
          {/* Checkbox WhatsApp */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="whatsapp-check"
              checked={state.businessData.phoneIsWhatsapp}
              onCheckedChange={(checked) => updateBusinessData({ phoneIsWhatsapp: !!checked })}
            />
            <Label htmlFor="whatsapp-check" className="text-sm text-muted-foreground">
              Este número é WhatsApp Business
            </Label>
          </div>
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

        {/* Website ou Rede Social */}
        <div>
          <Label htmlFor="social">Website ou Rede Social (opcional)</Label>
          <Input
            id="social"
            type="url"
            placeholder="@instagram ou https://website.com"
            value={state.businessData.socialNetwork || ""}
            onChange={(e) => updateBusinessData({ socialNetwork: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} variant="hero" size="lg">
          Próximo Passo
        </Button>
      </div>
    </div>
  );
}