import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useWizard } from "./WizardContext";
import { cn } from "@/lib/utils";
import { Star, Circle, Square } from "lucide-react";
import { toast } from "sonner";

interface Step3Props {
  onBack: () => void;
}

export const Step3SetupRewards = ({ onBack }: Step3Props) => {
  const { state, updateRewardConfig, setComplete } = useWizard();

  const shapes = [
    { name: "Estrela", value: 'star' as const, icon: Star },
    { name: "Círculo", value: 'circle' as const, icon: Circle },
    { name: "Quadrado", value: 'square' as const, icon: Square },
  ];

  const handlePublish = () => {
    if (!state.rewardConfig.rewardDescription || !state.rewardConfig.instructions) {
      toast.error("Preencha a descrição do prêmio e as instruções");
      return;
    }
    
    setComplete(true);
    toast.success("Cartela criada com sucesso! 🎉");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Configure os Selos e Prêmio
        </h2>
        <p className="text-muted-foreground">
          Defina como os clientes ganharão selos e qual será o prêmio
        </p>
      </div>

      <div className="space-y-6">
        {/* Formato do Selo */}
        <div>
          <Label className="text-base font-medium">Formato do Selo</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Escolha o formato visual dos selos
          </p>
          <div className="grid grid-cols-3 gap-3">
            {shapes.map((shape) => {
              const IconComponent = shape.icon;
              return (
                <button
                  key={shape.value}
                  onClick={() => updateRewardConfig({ sealShape: shape.value })}
                  className={cn(
                    "flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all hover:scale-[1.02]",
                    state.rewardConfig.sealShape === shape.value
                      ? "border-foreground bg-muted"
                      : "border-muted hover:border-muted-foreground"
                  )}
                >
                  <IconComponent className="w-8 h-8" />
                  <span className="text-sm font-medium">{shape.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Número de Selos */}
        <div>
          <Label className="text-base font-medium">Número de Selos</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Quantos selos o cliente precisa para ganhar o prêmio (3-25)
          </p>
          <div className="space-y-4">
            <Slider
              value={[state.rewardConfig.sealCount]}
              onValueChange={(value) => updateRewardConfig({ sealCount: value[0] })}
              min={3}
              max={25}
              step={1}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-2xl font-bold text-foreground">
                {state.rewardConfig.sealCount}
              </span>
              <span className="text-muted-foreground ml-1">selos</span>
            </div>
          </div>
        </div>

        {/* Descrição do Prêmio */}
        <div>
          <Label htmlFor="reward">Prêmio *</Label>
          <p className="text-sm text-muted-foreground mb-2">
            O que o cliente ganha ao completar a cartela
          </p>
          <Input
            id="reward"
            placeholder="Ex: 1 Café Expresso Grátis"
            value={state.rewardConfig.rewardDescription}
            onChange={(e) => updateRewardConfig({ rewardDescription: e.target.value })}
            className="mt-1"
          />
        </div>

        {/* Instruções */}
        <div>
          <Label htmlFor="instructions">Como Ganhar Selos *</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Explique como os clientes ganham selos
          </p>
          <Textarea
            id="instructions"
            placeholder="Ex: A cada compra acima de R$ 50,00 você ganha 1 selo"
            value={state.rewardConfig.instructions}
            onChange={(e) => updateRewardConfig({ instructions: e.target.value })}
            className="mt-1"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" size="lg">
          Voltar
        </Button>
        <Button onClick={handlePublish} variant="hero" size="lg">
          Confirmar e Publicar
        </Button>
      </div>
    </div>
  );
};