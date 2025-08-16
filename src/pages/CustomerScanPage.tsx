import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, QrCode, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const CustomerScanPage = () => {
  const { cardCode } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleScan = async () => {
      if (!user) {
        navigate('/auth', { 
          state: { redirectTo: `/customer-scan/${cardCode}` } 
        });
        return;
      }

      if (!cardCode) {
        setError('Código do cartão não encontrado');
        setLoading(false);
        return;
      }

      try {
        // Verificar se o lojista tem acesso a este cartão do cliente
        const { data, error } = await supabase.functions.invoke('get-customer-card-info', {
          body: {
            cardCode,
            businessOwnerId: user.id
          }
        });

        if (error) {
          console.error('Erro ao verificar acesso:', error);
          setError('Você não tem permissão para acessar este cartão');
          setLoading(false);
          return;
        }

        if (!data.success) {
          setError(data.error || 'Cartão não encontrado ou inválido');
          setLoading(false);
          return;
        }

        // Encontrar o ID do programa de fidelidade do lojista
        const { data: loyaltyCards, error: cardError } = await supabase
          .from('loyalty_cards')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .limit(1);

        if (cardError || !loyaltyCards?.length) {
          setError('Você precisa ter um programa de fidelidade ativo');
          setLoading(false);
          return;
        }

        // Redirecionar para gestão do cliente com o modal aberto
        navigate(`/my-cards/${loyaltyCards[0].id}/customers?openCard=${cardCode}`);
        
      } catch (error) {
        console.error('Erro ao processar escaneamento:', error);
        setError('Erro ao processar escaneamento do QR code');
        setLoading(false);
      }
    };

    handleScan();
  }, [cardCode, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <QrCode className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-xl font-semibold">Processando QR Code</h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verificando acesso ao cartão...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <AlertCircle className="h-16 w-16 mx-auto text-destructive" />
            <h1 className="text-xl font-semibold">Acesso Negado</h1>
            <p className="text-muted-foreground">{error}</p>
            <div className="flex flex-col gap-2 pt-4">
              <Button onClick={() => navigate('/my-cards')} variant="default">
                Meus Cartões
              </Button>
              <Button onClick={() => navigate('/')} variant="outline">
                Página Inicial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default CustomerScanPage;