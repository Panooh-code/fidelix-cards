import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Star, Heart, Circle, Square, CheckCircle, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AddSealsModal } from '@/components/AddSealsModal';

interface CustomerCard {
  id: string;
  card_code: string;
  customer_id: string;
  current_seals: number;
  total_rewards_earned: number;
  is_active: boolean;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface LoyaltyCard {
  id: string;
  business_name: string;
  seal_count: number;
  seal_shape: string;
  reward_description: string;
}

const CustomerManagementPage = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<CustomerCard[]>([]);
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerCard | null>(null);
  const [showAddSealsModal, setShowAddSealsModal] = useState(false);

  useEffect(() => {
    if (!user || !cardId) return;
    fetchData();
  }, [user, cardId]);

  const fetchData = async () => {
    try {
      // Buscar dados do cartão
      const { data: cardData, error: cardError } = await supabase
        .from('loyalty_cards')
        .select('id, business_name, seal_count, seal_shape, reward_description')
        .eq('id', cardId)
        .eq('user_id', user?.id)
        .single();

      if (cardError || !cardData) {
        toast.error('Cartão não encontrado');
        navigate('/my-cards');
        return;
      }

      setLoyaltyCard(cardData);

      // Buscar clientes participantes
      const { data: customersData, error: customersError } = await supabase
        .from('customer_cards')
        .select(`
          id, card_code, customer_id, current_seals, total_rewards_earned, is_active, created_at,
          profiles!customer_cards_customer_id_fkey (full_name, email)
        `)
        .eq('loyalty_card_id', cardId);

      if (customersError) {
        console.error('Erro ao buscar clientes:', customersError);
        toast.error('Erro ao carregar clientes');
        return;
      }

      setCustomers(customersData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const getSealIcon = (shape: string) => {
    switch (shape) {
      case 'star': return Star;
      case 'heart': return Heart;
      case 'square': return Square;
      default: return Circle;
    }
  };

  const handleAddSeals = (customer: CustomerCard) => {
    setSelectedCustomer(customer);
    setShowAddSealsModal(true);
  };

  const handleResetCard = async (customer: CustomerCard) => {
    if (!confirm(`Tem certeza que deseja finalizar e zerar o cartão de ${customer.profiles.full_name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('customer_cards')
        .update({
          current_seals: 0,
          total_rewards_earned: customer.total_rewards_earned + 1,
        })
        .eq('id', customer.id);

      if (error) {
        console.error('Erro ao resetar cartão:', error);
        toast.error('Erro ao resetar cartão');
        return;
      }

      toast.success('Cartão finalizado e resetado com sucesso!');
      fetchData();
    } catch (error) {
      console.error('Erro ao resetar cartão:', error);
      toast.error('Erro ao resetar cartão');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!loyaltyCard) {
    return null;
  }

  const SealIcon = getSealIcon(loyaltyCard.seal_shape);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/my-cards')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-xl font-bold">Clientes - {loyaltyCard.business_name}</h1>
                <p className="text-sm text-muted-foreground">
                  Gerencie os clientes do seu cartão de fidelidade
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customers.filter(c => c.is_active).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recompensas Concedidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customers.reduce((sum, c) => sum + c.total_rewards_earned, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customers List */}
          {customers.length === 0 ? (
            <div className="text-center space-y-4 py-12">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Plus className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Nenhum cliente ainda
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Quando os clientes se inscreverem no seu cartão de fidelidade, eles aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {customers.map((customer) => (
                <Card key={customer.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">
                          {customer.profiles.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{customer.profiles.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{customer.profiles.email}</p>
                        <p className="text-xs text-muted-foreground font-mono">{customer.card_code}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Progress Visual */}
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {Array.from({ length: loyaltyCard.seal_count }).map((_, index) => (
                            <SealIcon
                              key={index}
                              className={`w-5 h-5 ${
                                index < customer.current_seals
                                  ? 'text-primary fill-current'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {customer.current_seals}/{loyaltyCard.seal_count}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="flex flex-col items-center gap-1">
                        {customer.current_seals >= loyaltyCard.seal_count ? (
                          <Badge variant="default" className="bg-green-500">
                            <Award className="w-3 h-3 mr-1" />
                            Pronto para recompensa
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            {loyaltyCard.seal_count - customer.current_seals} selos restantes
                          </Badge>
                        )}
                        {customer.total_rewards_earned > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {customer.total_rewards_earned} recompensa(s) recebida(s)
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSeals(customer)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Adicionar Selos
                        </Button>
                        {customer.current_seals >= loyaltyCard.seal_count && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleResetCard(customer)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Finalizar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Seals Modal */}
      {showAddSealsModal && selectedCustomer && loyaltyCard && (
        <AddSealsModal
          isOpen={showAddSealsModal}
          onClose={() => setShowAddSealsModal(false)}
          customer={selectedCustomer}
          loyaltyCard={loyaltyCard}
          onSuccess={() => {
            fetchData();
            setShowAddSealsModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CustomerManagementPage;