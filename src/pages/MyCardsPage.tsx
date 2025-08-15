import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, ArrowLeft, Share2, Copy, QrCode, ExternalLink, MessageCircle, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { CardPreviewThumbnail } from '@/components/CardPreviewThumbnail';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getFidelixImageUrls } from '@/utils/uploadImages';

interface LoyaltyCard {
  id: string;
  business_name: string;
  business_segment: string;
  client_code: string;
  public_code: string;
  public_url: string;
  qr_code_url: string;
  primary_color: string;
  background_color: string;
  background_pattern: string;
  seal_shape: string;
  seal_count: number;
  reward_description: string;
  logo_url: string;
  business_phone: string;
  business_email: string;
  business_address: string;
  social_network: string;
  instructions: string;
  is_active: boolean;
  created_at: string;
}

const MyCardsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
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
        .select(`
          id, business_name, business_segment, client_code, public_code, public_url, qr_code_url, 
          primary_color, background_color, background_pattern, seal_shape, seal_count, reward_description, 
          logo_url, business_phone, business_email, business_address, social_network, instructions, 
          is_active, created_at
        `)
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

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copiado!`);
  };

  const shareViaWhatsApp = (card: LoyaltyCard) => {
    const text = `Confira o cartão de fidelidade da ${card.business_name}! ${card.public_url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
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
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Cartões de fidelidade do Meu Negócio
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
                    {/* Card Preview */}
                    <div className="flex justify-center mb-4 h-48">
                      <CardPreviewThumbnail card={card} />
                    </div>
                    
                    {/* Business Name - Centered */}
                    <div className="text-center space-y-2">
                      <CardTitle className="text-lg leading-tight font-bold">
                        {card.business_name}
                      </CardTitle>
                      <Badge 
                        variant={card.is_active ? "default" : "secondary"}
                        className="mx-auto"
                      >
                        {card.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {card.business_segment}
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Código:</span>
                        <span className="font-mono">{card.public_code || 'Não publicado'}</span>
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

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => card.public_code ? navigate(`/card/${card.public_code}/view`) : toast.error('Cartão ainda não publicado')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/wizard?edit=${card.id}`)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          console.log('Navegando para:', `/my-cards/${card.id}/customers`);
                          navigate(`/my-cards/${card.id}/customers`);
                        }}
                      >
                        <Users className="w-4 h-4 mr-1" />
                        Clientes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Partilhar
                      </Button>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCard(card.id)}
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </div>

                    {/* Expanded sharing options */}
                    {expandedCard === card.id && card.public_code && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                        <h4 className="text-sm font-medium">Compartilhar Cartão</h4>
                        
                        {/* QR Code */}
                        {card.qr_code_url && (
                          <div className="text-center space-y-2">
                            <img 
                              src={card.qr_code_url} 
                              alt="QR Code do cartão"
                              className="w-24 h-24 mx-auto border rounded"
                            />
                            <p className="text-xs text-muted-foreground">QR Code público</p>
                          </div>
                        )}
                        
                        {/* Share options */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => copyToClipboard(card.public_url, 'Link')}
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Copiar Link
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => shareViaWhatsApp(card)}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(card.public_url, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            <span>Código público: </span>
                            <span className="font-mono">{card.public_code}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-1 h-auto p-1"
                              onClick={() => copyToClipboard(card.public_code, 'Código')}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {expandedCard === card.id && !card.public_code && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">
                          Este cartão ainda não foi publicado. Edite-o para gerar os códigos de compartilhamento.
                        </p>
                      </div>
                    )}

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