import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle } from 'lucide-react';
import { CardPreview, CardData } from '@/components/wizard/CardPreview';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OneClickAdhesionBoxProps {
  cardData: CardData;
  publicCode: string;
  businessName: string;
  onSuccess: () => void;
  userId: string;
  showCardPreview?: boolean;
}

export const OneClickAdhesionBox = ({ 
  cardData, 
  publicCode, 
  businessName, 
  onSuccess, 
  userId, 
  showCardPreview = true,
}: OneClickAdhesionBoxProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleAdhesion = async () => {
    if (!agreedToTerms) {
      toast.error('Deve concordar com os termos para poder participar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-customer-participation', {
        body: { 
          publicCode: publicCode, 
          customerId: userId, 
          agreedToTerms: true 
        },
      });

      if (error) {
        throw new Error("A função de adesão falhou: " + error.message);
      }

      toast.success(`Parabéns! Já faz parte do cartão fidelidade ${businessName}! Você ganhou seu primeiro selo!`);
      
      // Redirecionar para a página do cartão do cliente
      if (data?.customerCard?.cardCode) {
        window.location.href = `/my-card/${data.customerCard.cardCode}`;
      } else {
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro desconhecido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Card Preview (optional) */}
      {showCardPreview && (
        <CardPreview cardData={cardData} size="lg" className="shadow-elegant" />
      )}
      
      {/* Adhesion Box */}
      <Card className="bg-white/95 backdrop-blur-lg border-primary/20">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl text-primary">
            Aderir ao Cartão Fidelidade
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {businessName}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Benefits */}
          <div className="bg-primary/5 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Acumule selos a cada compra</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Ganhe recompensas exclusivas</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Ofertas especiais para clientes fiéis</span>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="terms" 
              checked={agreedToTerms} 
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)} 
            />
            <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
              Concordo em participar no programa de fidelidade de <strong>{businessName}</strong> e 
              aceito receber comunicações relacionadas com ofertas e promoções.
            </Label>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleAdhesion}
            disabled={isSubmitting || !agreedToTerms} 
            variant="default"
            size="lg" 
            className="w-full h-12 text-base font-medium bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              `Aderir ao Cartão ${businessName}`
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};