import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useWizard } from "./WizardContext";
import { cn } from "@/lib/utils";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
}

export const Step2Customize = ({ onNext, onBack }: Step2Props) => {
  const { state, updateCustomization } = useWizard();

  const colors = [
    { name: "Roxo Primário", value: "#480da2" },
    { name: "Azul Oceano", value: "#2563eb" },
    { name: "Verde Esmeralda", value: "#059669" },
    { name: "Laranja Vibrante", value: "#ea580c" },
    { name: "Rosa Moderno", value: "#db2777" },
    { name: "Vermelho Clássico", value: "#dc2626" },
  ];

  const backgroundColors = [
    { name: "Branco", value: "#ffffff" },
    { name: "Cinza Claro", value: "#f8fafc" },
    { name: "Azul Claro", value: "#eff6ff" },
    { name: "Verde Claro", value: "#f0fdf4" },
    { name: "Rosa Claro", value: "#fdf2f8" },
    { name: "Amarelo Claro", value: "#fefce8" },
  ];

  const patterns = [
    { name: "Sem Padrão", value: 'none' as const },
    { name: "Pontos", value: 'dots' as const },
    { name: "Linhas", value: 'lines' as const },
    { name: "Ondas", value: 'waves' as const },
    { name: "Grade", value: 'grid' as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Personalize sua Cartela
        </h2>
        <p className="text-muted-foreground">
          Escolha as cores e padrões que combinam com sua marca
        </p>
      </div>

      <div className="space-y-6">
        {/* Cor Principal */}
        <div>
          <Label className="text-base font-medium">Cor Principal</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Esta cor será usada nos selos e detalhes
          </p>
          <div className="grid grid-cols-3 gap-3">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => updateCustomization({ primaryColor: color.value })}
                className={cn(
                  "flex items-center space-x-2 p-3 rounded-lg border-2 transition-all hover:scale-[1.02]",
                  state.customization.primaryColor === color.value
                    ? "border-foreground bg-muted"
                    : "border-muted hover:border-muted-foreground"
                )}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-sm font-medium">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cor de Fundo */}
        <div>
          <Label className="text-base font-medium">Cor de Fundo</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Cor base do cartão de fidelidade
          </p>
          <div className="grid grid-cols-3 gap-3">
            {backgroundColors.map((color) => (
              <button
                key={color.value}
                onClick={() => updateCustomization({ backgroundColor: color.value })}
                className={cn(
                  "flex items-center space-x-2 p-3 rounded-lg border-2 transition-all hover:scale-[1.02]",
                  state.customization.backgroundColor === color.value
                    ? "border-foreground bg-muted"
                    : "border-muted hover:border-muted-foreground"
                )}
              >
                <div
                  className="w-6 h-6 rounded-full border border-muted"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-sm font-medium">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Padrão de Fundo */}
        <div>
          <Label className="text-base font-medium">Padrão de Fundo</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Adicione um padrão sutil como marca d'água
          </p>
          <div className="grid grid-cols-2 gap-3">
            {patterns.map((pattern) => (
              <button
                key={pattern.value}
                onClick={() => updateCustomization({ backgroundPattern: pattern.value })}
                className={cn(
                  "flex items-center justify-center p-4 rounded-lg border-2 transition-all hover:scale-[1.02]",
                  state.customization.backgroundPattern === pattern.value
                    ? "border-foreground bg-muted"
                    : "border-muted hover:border-muted-foreground"
                )}
              >
                <span className="text-sm font-medium">{pattern.name}</span>
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