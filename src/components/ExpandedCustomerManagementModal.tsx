import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Star, Heart, Circle, Square, Award, Calendar, Mail, User, CreditCard, Phone, MapPin, Trash2, Ban, RotateCcw, Edit, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface ExpandedCustomerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerDetails: CustomerCardDetails | null;
  transactions: Transaction[];
  onAddSeals: () => void;
  onRefresh: () => void;
}

export const ExpandedCustomerManagementModal = ({
  isOpen,
  onClose,
  customerDetails,
  transactions,
  onAddSeals,
  onRefresh
}: ExpandedCustomerManagementModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    birth_date: '',
    is_whatsapp: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customerDetails) {
      setEditForm({
        full_name: customerDetails.customer.name || '',
        email: customerDetails.customer.email || '',
        phone_number: customerDetails.customer.phone || '',
        address: customerDetails.customer.address || '',
        birth_date: customerDetails.customer.birthDate || '',
        is_whatsapp: customerDetails.customer.isWhatsapp || false
      });
    }
  }, [customerDetails]);

  if (!customerDetails) return null;

  const getSealIcon = (shape: string) => {
    switch (shape) {
      case 'star': return Star;
      case 'heart': return Heart;
      case 'square': return Square;
      default: return Circle;
    }
  };

  const SealIcon = getSealIcon(customerDetails.loyaltyProgram.sealShape);
  const isReadyForReward = customerDetails.currentSeals >= customerDetails.loyaltyProgram.sealCount;

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          email: editForm.email,
          phone_number: editForm.phone_number || null,
          address: editForm.address || null,
          birth_date: editForm.birth_date || null,
          is_whatsapp: editForm.is_whatsapp
        })
        .eq('user_id', customerDetails.customer.id);

      if (error) {
        toast.error('Erro ao atualizar perfil');
        return;
      }

      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleZeroCard = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('customer_cards')
        .update({
          current_seals: 0,
          total_rewards_earned: customerDetails.totalRewardsEarned + 1,
        })
        .eq('id', customerDetails.id);

      if (error) {
        toast.error('Erro ao zerar cartão');
        return;
      }

      toast.success('Cartão zerado e recompensa entregue!');
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Erro ao zerar cartão:', error);
      toast.error('Erro ao zerar cartão');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('customer_cards')
        .update({ is_active: false })
        .eq('id', customerDetails.id);

      if (error) {
        toast.error('Erro ao excluir cartão');
        return;
      }

      toast.success('Cartão excluído com sucesso! Cliente preservado.');
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Erro ao excluir cartão:', error);
      toast.error('Erro ao excluir cartão');
    } finally {
      setLoading(false);
    }
  };

  const handleBanCustomer = async () => {
    setLoading(true);
    try {
      // First delete customer card
      const { error: cardError } = await supabase
        .from('customer_cards')
        .delete()
        .eq('id', customerDetails.id);

      if (cardError) {
        toast.error('Erro ao banir cliente');
        return;
      }

      toast.success('Cliente banido permanentemente!');
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Erro ao banir cliente:', error);
      toast.error('Erro ao banir cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-7xl h-[95vh] max-h-[95vh] p-0 gap-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-4 sm:px-6 py-4 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" />
              <span className="truncate">Gestão - {customerDetails.customer.name}</span>
              {isReadyForReward && (
                <Badge className="bg-green-500 text-white ml-auto shrink-0">
                  <Award className="w-3 h-3 mr-1" />
                  Pronto para Prêmio
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            <div className="space-y-6">
              {/* Customer Profile Section - Mobile Optimized */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      Informações do Cliente
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className="min-h-[44px] touch-manipulation"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="full_name">Nome Completo</Label>
                          <Input
                            id="full_name"
                            value={editForm.full_name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone_number">Telefone</Label>
                          <Input
                            id="phone_number"
                            value={editForm.phone_number}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone_number: e.target.value }))}
                            placeholder="Ex: +351 912 345 678"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="is_whatsapp"
                            checked={editForm.is_whatsapp}
                            onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_whatsapp: !!checked }))}
                          />
                          <Label htmlFor="is_whatsapp">WhatsApp</Label>
                        </div>
                        <div>
                          <Label htmlFor="address">Endereço</Label>
                          <Input
                            id="address"
                            value={editForm.address}
                            onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Rua, número, cidade"
                          />
                        </div>
                        <div>
                          <Label htmlFor="birth_date">Data de Nascimento</Label>
                          <Input
                            id="birth_date"
                            type="date"
                            value={editForm.birth_date}
                            onChange={(e) => setEditForm(prev => ({ ...prev, birth_date: e.target.value }))}
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button onClick={handleSaveProfile} disabled={loading} size="sm">
                            Guardar
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{customerDetails.customer.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{customerDetails.customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-mono">{customerDetails.cardCode}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">ID:</span>
                          <span className="text-xs font-mono">{customerDetails.customer.id}</span>
                        </div>
                        {customerDetails.customer.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{customerDetails.customer.phone}</span>
                            {customerDetails.customer.isWhatsapp && (
                              <Badge variant="secondary" className="text-xs">WhatsApp</Badge>
                            )}
                          </div>
                        )}
                        {customerDetails.customer.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{customerDetails.customer.address}</span>
                          </div>
                        )}
                        {customerDetails.customer.birthDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(customerDetails.customer.birthDate).toLocaleDateString('pt-PT')}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            Cliente desde {new Date(customerDetails.createdAt).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className={isReadyForReward ? 'border-green-200 bg-green-50/30' : ''}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      Progresso do Cartão
                      {isReadyForReward && (
                        <Badge className="bg-green-500 text-white">
                          <Award className="w-3 h-3 mr-1" />
                          Completo!
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Seal Progress Visual - Mobile Optimized */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Selos Coletados</span>
                        <span className="font-medium text-lg">
                          {customerDetails.currentSeals}/{customerDetails.loyaltyProgram.sealCount}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className={`rounded-full h-3 transition-all duration-500 ${
                            isReadyForReward ? 'bg-green-500' : 'bg-primary'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (customerDetails.currentSeals / customerDetails.loyaltyProgram.sealCount) * 100)}%` 
                          }}
                        />
                      </div>
                      
                      {/* Seal Icons - Limited for mobile */}
                      <div className="flex gap-1 flex-wrap justify-center">
                        {Array.from({ length: Math.min(customerDetails.loyaltyProgram.sealCount, 12) }).map((_, index) => (
                          <SealIcon
                            key={index}
                            className={`w-6 h-6 transition-colors ${
                              index < customerDetails.currentSeals
                                ? (isReadyForReward ? 'text-green-500 fill-current' : 'text-primary fill-current')
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                        {customerDetails.loyaltyProgram.sealCount > 12 && (
                          <span className="text-sm text-muted-foreground ml-1 self-center">
                            +{customerDetails.loyaltyProgram.sealCount - 12}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Message */}
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      {isReadyForReward ? (
                        <p className="text-green-600 font-medium">
                          🎉 Cartão completo! Cliente pronto para receber o prêmio.
                        </p>
                      ) : (
                        <p className="text-muted-foreground">
                          Faltam {customerDetails.loyaltyProgram.sealCount - customerDetails.currentSeals} selos para completar
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center pt-2">
                      <div className="p-3 rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold">{customerDetails.totalRewardsEarned}</div>
                        <div className="text-xs text-muted-foreground">Recompensas</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold">{transactions.length}</div>
                        <div className="text-xs text-muted-foreground">Transações</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Recent Transactions */}
              {transactions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Histórico Recente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              transaction.seals_given > 0 ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <span className={`font-bold text-sm ${
                                transaction.seals_given > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {transaction.seals_given > 0 ? '+' : ''}{transaction.seals_given}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">
                                {Math.abs(transaction.seals_given)} selo{Math.abs(transaction.seals_given) !== 1 ? 's' : ''} {transaction.seals_given > 0 ? 'adicionado' : 'removido'}{Math.abs(transaction.seals_given) !== 1 ? 's' : ''}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(transaction.transaction_date).toLocaleString('pt-PT')}
                              </p>
                            </div>
                          </div>
                          {transaction.notes && (
                            <p className="text-sm text-muted-foreground italic max-w-xs text-right">
                              {transaction.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Action Buttons - Mobile First Design */}
          <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t pt-4 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-4">
            {isReadyForReward ? (
              /* Two-Step Reward Process */
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800 mb-1">Cartão Completo!</h3>
                  <p className="text-sm text-green-600">
                    {customerDetails.customer.name} completou o cartão. Confirme a entrega do prêmio.
                  </p>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        className="w-full min-h-[50px] bg-green-600 hover:bg-green-700 text-white touch-manipulation"
                        size="lg"
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Iniciar Novo Ciclo
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="mx-4">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Novo Ciclo</AlertDialogTitle>
                        <AlertDialogDescription>
                          Confirma que o prêmio foi entregue para {customerDetails.customer.name}? 
                          O cartão será zerado para um novo ciclo de selos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleZeroCard} disabled={loading}>
                          Confirmar e Zerar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full min-h-[50px] border-red-500 text-red-600 hover:bg-red-50 touch-manipulation"
                        size="lg"
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Remover Cliente
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="mx-4">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover {customerDetails.customer.name}? 
                          O cartão será desativado permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteCard} disabled={loading}>
                          Remover Cliente
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ) : (
              /* Normal Actions when card is not complete */
              <div className="space-y-3">
                <Button 
                  onClick={onAddSeals} 
                  className="w-full min-h-[50px] touch-manipulation"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Gerir Selos
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full min-h-[50px] bg-red-600 hover:bg-red-700 touch-manipulation"
                      size="lg"
                    >
                      <Ban className="w-5 h-5 mr-2" />
                      Banir Cliente
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="mx-4">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Banimento</AlertDialogTitle>
                      <AlertDialogDescription>
                        ATENÇÃO: Esta ação é irreversível! O cliente {customerDetails.customer.name} será 
                        permanentemente removido do sistema. Use apenas em casos extremos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBanCustomer} disabled={loading} className="bg-red-600 hover:bg-red-700">
                        Banir Permanentemente
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};