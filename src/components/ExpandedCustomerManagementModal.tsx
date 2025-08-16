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
import { Star, Heart, Circle, Square, Award, Calendar, Mail, User, CreditCard, Phone, MapPin, Trash2, Ban, RotateCcw, Edit } from 'lucide-react';
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
      <DialogContent className="sm:max-w-3xl max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Gestão do Cliente - {customerDetails.customer.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Profile Section */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  Informações do Cliente
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
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

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Progresso do Cartão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Seal Progress Visual */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Selos Coletados</span>
                    <span className="font-medium">
                      {customerDetails.currentSeals}/{customerDetails.loyaltyProgram.sealCount}
                    </span>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {Array.from({ length: customerDetails.loyaltyProgram.sealCount }).map((_, index) => (
                      <SealIcon
                        key={index}
                        className={`w-6 h-6 ${
                          index < customerDetails.currentSeals
                            ? 'text-primary fill-current'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  {isReadyForReward ? (
                    <Badge variant="default" className="bg-green-500">
                      <Award className="w-3 h-3 mr-1" />
                      Pronto para Recompensa
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {customerDetails.loyaltyProgram.sealCount - customerDetails.currentSeals} selos restantes
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{customerDetails.totalRewardsEarned}</div>
                    <div className="text-xs text-muted-foreground">Recompensas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{transactions.length}</div>
                    <div className="text-xs text-muted-foreground">Transações</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-center">
            <Button onClick={onAddSeals} variant="default" className="w-full sm:w-auto min-h-[44px]">
              Gerir Selos
            </Button>

            {isReadyForReward && (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto min-h-[44px]">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Zerar Cartão
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Entrega de Recompensa</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja zerar o cartão de {customerDetails.customer.name}? 
                        Os selos serão zerados e o contador de recompensas será incrementado.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleZeroCard} disabled={loading}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50 w-full sm:w-auto min-h-[44px]">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir Cartão
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão do Cartão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o cartão de {customerDetails.customer.name}? 
                        O cartão será desativado mas o cliente será preservado no sistema.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteCard} disabled={loading}>
                        Excluir Cartão
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Ban className="w-4 h-4 mr-2" />
                  Banir Cliente
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Banimento</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>ATENÇÃO:</strong> Esta ação é irreversível! O cliente {customerDetails.customer.name} 
                    e seu cartão serão permanentemente removidos do sistema. Tem certeza absoluta?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBanCustomer} disabled={loading} className="bg-red-600">
                    Banir Permanentemente
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

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
      </DialogContent>
    </Dialog>
  );
};