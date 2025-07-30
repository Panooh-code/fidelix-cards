import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useWizard } from "./WizardContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Palette, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

const ColorPicker = ({ color, onChange, label }: { color: string; onChange: (color: string) => void; label: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const presetColors = [
    "#480da2", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
    "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1", "#14b8a6",
    "#000000", "#ffffff", "#6b7280", "#374151", "#1f2937", "#111827"
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-12"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-6 h-6 rounded-full border-2 border-border"
              style={{ backgroundColor: color }}
            />
            <span>{label}</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Cores Predefinidas</Label>
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className="w-8 h-8 rounded-full border-2 border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    onChange(presetColor);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Cor Personalizada</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const Step2Customize = ({ onNext, onBack }: Step2Props) => {
  const { state, updateCustomization } = useWizard();

  const patterns = [
    { name: "Sem Padrão", value: 'none' as const, preview: '' },
    { name: "Pontos", value: 'dots' as const, preview: 'radial-gradient(circle, currentColor 1px, transparent 1px)' },
    { name: "Linhas", value: 'lines' as const, preview: 'linear-gradient(45deg, currentColor 1px, transparent 1px)' },
    { name: "Ondas", value: 'waves' as const, preview: 'repeating-linear-gradient(0deg, currentColor, currentColor 2px, transparent 2px, transparent 20px)' },
    { name: "Grade", value: 'grid' as const, preview: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)' },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Step Header */}
      <div className="text-center pb-6 border-b border-border/20 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Passo 2: Design da Cartela
        </h2>
        <p className="text-sm text-muted-foreground">
          Personalize as cores e padrões da sua cartela
        </p>
      </div>

      <div className="space-y-6">
        {/* Cor Principal */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Cor Principal
          </Label>
          <p className="text-sm text-muted-foreground">
            Esta cor será usada nos selos e detalhes
          </p>
          <ColorPicker
            color={state.customization.primaryColor}
            onChange={(color) => updateCustomization({ primaryColor: color })}
            label="Selecionar cor principal"
          />
        </div>

        {/* Cor de Fundo */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Cor de Fundo
          </Label>
          <p className="text-sm text-muted-foreground">
            Cor base do cartão de fidelidade
          </p>
          <ColorPicker
            color={state.customization.backgroundColor}
            onChange={(color) => updateCustomization({ backgroundColor: color })}
            label="Selecionar cor de fundo"
          />
        </div>

        {/* Padrão de Fundo */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Padrão de Fundo</Label>
          <p className="text-sm text-muted-foreground">
            Adicione um padrão sutil como marca d'água
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {patterns.map((pattern) => (
              <button
                key={pattern.value}
                onClick={() => updateCustomization({ backgroundPattern: pattern.value })}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all hover:scale-105",
                  state.customization.backgroundPattern === pattern.value
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-muted hover:border-primary/50"
                )}
              >
                <div 
                  className="w-full h-8 rounded mb-2 border"
                  style={{
                    backgroundImage: pattern.preview,
                    backgroundSize: pattern.value === 'grid' ? '10px 10px' : '10px 10px',
                    color: `${state.customization.primaryColor}20`
                  }}
                />
                <div className="text-sm font-medium">{pattern.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" size="lg">
          Voltar
        </Button>
        <Button onClick={onNext} variant="hero" size="lg">
          Próximo Passo
        </Button>
      </div>
    </div>
  );
};