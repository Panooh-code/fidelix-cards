import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Star, Heart, Circle, Square, Award, User, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AddSealsModal } from '@/components/AddSealsModal';
import { QRScannerModal } from '@/components/QRScannerModal';
import { CustomerSearchToolbar } from '@/components/CustomerSearchToolbar';
import { ExpandedCustomerManagementModal } from '@/components/ExpandedCustomerManagementModal';
import Logo from '@/components/Logo';

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
    phone_number?: string;
    address?: string;
    birth_date?: string;
    is_whatsapp?: boolean;
  };
}

interface LoyaltyCard {
  id: string;
  business_name: string;
  seal_count: number;
  seal_shape: string;
  reward_description: string;
}

interface CustomerCardDetails {
  id: string;
  cardCode: string;
  currentSeals: number;
  totalRewardsEarned: number;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    birthDate?: string;
    isWhatsapp?: boolean;
  };
  loyaltyProgram: {
    businessName: string;
    businessSegment: string;
    sealCount: number;
    sealShape: string;
    rewardDescription: string;
    primaryColor: string;
    backgroundColor: string;
  };
}

interface Transaction {
  id: string;
  seals_given: number;
  transaction_date: string;
  notes?: string;
}

const CustomerManagementPage = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  console.log('CustomerManagementPage - cardId:', cardId);
  console.log('CustomerManagementPage - user:', user?.id);
  const [customers, setCustomers] = useState<CustomerCard[]>([]);
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerCard | null>(null);
  const [showAddSealsModal, setShowAddSealsModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New states for individual customer management
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<CustomerCardDetails | null>(null);
  const [customerTransactions, setCustomerTransactions] = useState<Transaction[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

      // Buscar clientes participantes (em duas etapas para evitar problemas de JOIN e RLS)
      const { data: rawCustomers, error: customersError } = await supabase
        .from('customer_cards')
        .select(
          'id, card_code, customer_id, current_seals, total_rewards_earned, is_active, created_at'
        )
        .eq('loyalty_card_id', cardId)
        .eq('is_active', true);

      if (customersError) {
        console.error('Erro ao buscar clientes:', customersError);
        toast.error('Erro ao carregar clientes');
        setCustomers([]);
      } else {
        const customerIds = Array.from(
          new Set((rawCustomers || []).map((c) => c.customer_id).filter(Boolean))
        );

        let profilesByUserId: Record<string, CustomerCard['profiles']> = {};

        if (customerIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select(
              'user_id, full_name, email, phone_number, address, birth_date, is_whatsapp'
            )
            .in('user_id', customerIds);

          if (profilesError) {
            console.error('Erro ao buscar perfis dos clientes:', profilesError);
            toast.error('Erro ao carregar perfis dos clientes');
          } else if (profilesData) {
            profilesByUserId = profilesData.reduce((acc, p) => {
              acc[p.user_id as string] = {
                full_name: p.full_name,
                email: p.email,
                phone_number: p.phone_number || undefined,
                address: p.address || undefined,
                birth_date: p.birth_date || undefined,
                is_whatsapp: p.is_whatsapp || undefined,
              };
              return acc;
            }, {} as Record<string, CustomerCard['profiles']>);
          }
        }

        const mergedCustomers: CustomerCard[] = (rawCustomers || []).map((c) => ({
          ...c,
          profiles:
            profilesByUserId[c.customer_id] || ({
              full_name: 'Cliente',
              email: '—',
            } as CustomerCard['profiles']),
        }));

        setCustomers(mergedCustomers);
      }
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

  const handleFinalizarRecompensa = async (customer: CustomerCard) => {
    if (!confirm(`Tem a certeza que deseja finalizar este cartão e entregar a recompensa? Os selos do cliente ${customer.profiles.full_name} serão repostos a zero.`)) {
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

      toast.success('Cartão finalizado e reiniciado com sucesso!');
      fetchData();
    } catch (error) {
      console.error('Erro ao resetar cartão:', error);
      toast.error('Erro ao resetar cartão');
    }
  };

  // Filtrar clientes baseado na busca - MOVED BEFORE CONDITIONAL RETURNS
  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;
    
    const term = searchTerm.toLowerCase();
    return customers.filter(customer => 
      customer.card_code.toLowerCase().includes(term) ||
      customer.profiles.full_name.toLowerCase().includes(term) ||
      customer.profiles.email.toLowerCase().includes(term)
    );
  }, [customers, searchTerm]);

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

  const handleQRScanSuccess = (scannedCode: string) => {
    setShowQRScanner(false);
    searchCustomerByCode(scannedCode);
  };

  const searchCustomerByCode = async (code: string) => {
    if (!code.trim() || !user?.id) return;

    setIsSearching(true);
    
    try {
      const response = await supabase.functions.invoke('get-customer-card-info', {
        body: {
          cardCode: code.trim(),
          businessOwnerId: user.id
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erro ao buscar cliente');
      }

      if (response.data?.success && response.data?.customerCard) {
        setSelectedCustomerDetails(response.data.customerCard);
        setCustomerTransactions(response.data.transactions || []);
        setIsManagementModalOpen(true);
      } else {
        toast.error('Cliente não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      toast.error('Erro ao buscar cliente. Verifique o código e tente novamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const openCustomerManagement = async (customer: CustomerCard) => {
    setIsSearching(true);
    
    try {
      const response = await supabase.functions.invoke('get-customer-card-info', {
        body: {
          cardCode: customer.card_code,
          businessOwnerId: user?.id
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erro ao carregar detalhes do cliente');
      }

      if (response.data?.success && response.data?.customerCard) {
        setSelectedCustomerDetails(response.data.customerCard);
        setCustomerTransactions(response.data.transactions || []);
        setIsManagementModalOpen(true);
      } else {
        toast.error('Erro ao carregar detalhes do cliente');
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      toast.error('Erro ao carregar detalhes do cliente');
    } finally {
      setIsSearching(false);
    }
  };

  const closeCustomerManagement = () => {
    setIsManagementModalOpen(false);
    setSelectedCustomerDetails(null);
    setCustomerTransactions([]);
  };

  const handleManagementAddSeals = () => {
    if (selectedCustomerDetails) {
      // Find the customer in the current list to open AddSealsModal
      const customer = customers.find(c => c.card_code === selectedCustomerDetails.cardCode);
      if (customer) {
        setSelectedCustomer(customer);
        setShowAddSealsModal(true);
        setIsManagementModalOpen(false);
      }
    }
  };

  const handleManagementFinalizeReward = async () => {
    if (!selectedCustomerDetails) return;

    if (!confirm(`Tem a certeza que deseja finalizar este cartão e entregar a recompensa? Os selos de ${selectedCustomerDetails.customer.name} serão repostos a zero.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('customer_cards')
        .update({
          current_seals: 0,
          total_rewards_earned: selectedCustomerDetails.totalRewardsEarned + 1,
        })
        .eq('id', selectedCustomerDetails.id);

      if (error) {
        console.error('Erro ao resetar cartão:', error);
        toast.error('Erro ao resetar cartão');
        return;
      }

      toast.success('Cartão finalizado e reiniciado com sucesso!');
      closeCustomerManagement();
      fetchData();
    } catch (error) {
      console.error('Erro ao resetar cartão:', error);
      toast.error('Erro ao resetar cartão');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Back */}
            <div className="flex items-center gap-4">
              <div 
                className="cursor-pointer" 
                onClick={() => navigate('/')}
              >
                <Logo />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Voltar</span>
              </Button>
            </div>

            {/* Center - Title (hidden on mobile) */}
            <div className="hidden md:block text-center">
              <h1 className="text-xl font-bold">Clientes - {loyaltyCard.business_name}</h1>
              <p className="text-sm text-muted-foreground">
                Gestão de clientes do programa de fidelidade
              </p>
            </div>

            {/* Mobile title */}
            <div className="md:hidden flex-1 ml-4">
              <h1 className="text-lg font-bold truncate">Clientes</h1>
              <p className="text-xs text-muted-foreground truncate">
                {loyaltyCard.business_name}
              </p>
            </div>

            {/* Right side - empty for balance */}
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Search Toolbar */}
          <CustomerSearchToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchByCode={searchCustomerByCode}
            onOpenQRScanner={() => setShowQRScanner(true)}
            isSearching={isSearching}
          />

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
          {filteredCustomers.length === 0 ? (
            searchTerm ? (
              <div className="text-center space-y-4 py-12">
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Não foram encontrados clientes que correspondam à sua busca "{searchTerm}".
                </p>
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Limpar busca
                </Button>
              </div>
            ) : customers.length === 0 ? (
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
            ) : null
          ) : (
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <Card 
                  key={customer.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openCustomerManagement(customer)}
                >
                   <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-primary font-bold text-sm sm:text-lg">
                            {customer.profiles.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{customer.profiles.full_name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{customer.profiles.email}</p>
                          <p className="text-xs text-muted-foreground font-mono">{customer.card_code}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                        {/* Progress Visual */}
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1 flex-wrap">
                            {Array.from({ length: Math.min(loyaltyCard.seal_count, 8) }).map((_, index) => (
                              <SealIcon
                                key={index}
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                  index < customer.current_seals
                                    ? 'text-primary fill-current'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                            {loyaltyCard.seal_count > 8 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                +{loyaltyCard.seal_count - 8}
                              </span>
                            )}
                          </div>
                          <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                            {customer.current_seals}/{loyaltyCard.seal_count}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="flex flex-col items-start sm:items-center gap-1">
                          {customer.current_seals >= loyaltyCard.seal_count ? (
                            <Badge variant="default" className="bg-green-500 text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              Pronto para recompensa
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              {loyaltyCard.seal_count - customer.current_seals} selos restantes
                            </Badge>
                          )}
                          {customer.total_rewards_earned > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {customer.total_rewards_earned} recompensa(s) recebida(s)
                            </span>
                          )}
                        </div>

                        {/* Actions - Mobile optimized */}
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openCustomerManagement(customer);
                            }}
                            className="flex-1 sm:flex-none text-xs"
                          >
                            <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            <span className="hidden sm:inline">Gerir</span>
                            <span className="sm:hidden">Gerir</span>
                          </Button>
                          
                          {customer.current_seals >= loyaltyCard.seal_count ? (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFinalizarRecompensa(customer);
                              }}
                              className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-xs"
                            >
                              <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden sm:inline">Entregar</span>
                              <span className="sm:hidden">Entregar</span>
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddSeals(customer);
                              }}
                              className="flex-1 sm:flex-none text-xs"
                            >
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden sm:inline">Adicionar Selos</span>
                              <span className="sm:hidden">Selos</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
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

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScanSuccess}
      />

      {/* Customer Management Modal */}
      <ExpandedCustomerManagementModal
        isOpen={isManagementModalOpen}
        onClose={closeCustomerManagement}
        customerDetails={selectedCustomerDetails}
        transactions={customerTransactions}
        onAddSeals={handleManagementAddSeals}
        onRefresh={fetchData}
      />
    </div>
  );
};

export default CustomerManagementPage;