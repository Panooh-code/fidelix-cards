import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getFidelixImageUrls } from '@/utils/uploadImages';

interface LoyaltyCard {
  id: string;
  business_name: string;
  business_segment: string;
  client_code: string;
  primary_color: string;
  seal_shape: string;
  seal_count: number;
  reward_description: string;
  is_active: boolean;
  created_at: string;
}

const MyCardsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const imageUrls = getFidelixImageUrls();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/my-cards');
      return;
    }

    if (user) {
      fetchCards();
    }
  }, [user, authLoading, navigate]);

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_cards')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cards:', error);
        toast.error('Erro ao carregar cartões');
        return;
      }

      setCards(data || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
      toast.error('Erro ao carregar cartões');
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!confirm('Tem certeza que deseja excluir este cartão?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('loyalty_cards')
        .delete()
        .eq('id', cardId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting card:', error);
        toast.error('Erro ao excluir cartão');
        return;
      }

      toast.success('Cartão excluído com sucesso!');
      fetchCards();
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('Erro ao excluir cartão');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <img 
                  src={imageUrls.logoIcon} 
                  alt="Fidelix mascote" 
                  className="w-8 h-8"
                />
                <img 
                  src={imageUrls.logoText} 
                  alt="Fidelix" 
                  className="h-6"
                />
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/wizard')}
              variant="hero"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Cartão
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Meus Cartões de Fidelidade
            </h1>
            <p className="text-muted-foreground">
              Gerencie todos os seus cartões criados
            </p>
          </div>

          {cards.length === 0 ? (
            <div className="text-center space-y-4 py-12">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Nenhum cartão criado ainda
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Crie seu primeiro cartão de fidelidade em apenas 1 minuto e comece a conquistar seus clientes.
              </p>
              <Button 
                onClick={() => navigate('/wizard')}
                variant="hero"
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Cartão
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <Card key={card.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg leading-tight">
                        {card.business_name}
                      </CardTitle>
                      <Badge 
                        variant={card.is_active ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {card.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {card.business_segment}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Código:</span>
                        <span className="font-mono">{card.client_code}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Selos:</span>
                        <span>{card.seal_count} {card.seal_shape}s</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Recompensa:</span>
                        <p className="text-xs mt-1">{card.reward_description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/card/${card.client_code}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/wizard?edit=${card.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCard(card.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Criado em {new Date(card.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyCardsPage;