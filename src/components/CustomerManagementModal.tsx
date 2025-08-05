import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Circle, Square, Award, Calendar, Mail, User, CreditCard } from 'lucide-react';

interface CustomerCardDetails {
  id: string;
  cardCode: string;
  currentSeals: number;
  totalRewardsEarned: number;
  createdAt: string;
  customer: {
    name: string;
    email: string;
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

interface CustomerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerDetails: CustomerCardDetails | null;
  transactions: Transaction[];
  onAddSeals: () => void;
  onFinalizeReward: () => void;
}

export const CustomerManagementModal = ({
  isOpen,
  onClose,
  customerDetails,
  transactions,
  onAddSeals,
  onFinalizeReward
}: CustomerManagementModalProps) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Gestão do Cliente - {customerDetails.customer.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Overview */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Cliente desde {new Date(customerDetails.createdAt).toLocaleDateString('pt-PT')}
                  </span>
                </div>
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

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            {isReadyForReward ? (
              <Button
                onClick={onFinalizeReward}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Award className="w-4 h-4 mr-2" />
                Finalizar e Entregar Recompensa
              </Button>
            ) : (
              <Button onClick={onAddSeals}>
                <span className="mr-2">+</span>
                Adicionar Selos
              </Button>
            )}
          </div>

          {/* Recent Transactions */}
          {transactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Histórico Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">
                            +{transaction.seals_given}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.seals_given} selo{transaction.seals_given !== 1 ? 's' : ''} adicionado{transaction.seals_given !== 1 ? 's' : ''}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.transaction_date).toLocaleString('pt-PT')}
                          </p>
                        </div>
                      </div>
                      {transaction.notes && (
                        <p className="text-sm text-muted-foreground italic">
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