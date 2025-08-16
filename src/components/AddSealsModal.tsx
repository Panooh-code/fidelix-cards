import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Minus } from 'lucide-react';

interface AddSealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: {
    id: string;
    current_seals: number;
    profiles: {
      full_name: string;
    };
  };
  loyaltyCard: {
    id: string;
    seal_count: number;
  };
  onSuccess: () => void;
}

export const AddSealsModal = ({ isOpen, onClose, customer, loyaltyCard, onSuccess }: AddSealsModalProps) => {
  const { user } = useAuth();
  const [isAddingSeals, setIsAddingSeals] = useState(true);
  const [sealsAmount, setSealsAmount] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const maxSealsToAdd = loyaltyCard.seal_count - customer.current_seals;
  const maxSealsToRemove = customer.current_seals;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalSealsAmount = isAddingSeals ? sealsAmount : -sealsAmount;
    const maxAllowed = isAddingSeals ? maxSealsToAdd : maxSealsToRemove;
    
    if (!user || sealsAmount <= 0 || sealsAmount > maxAllowed) {
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('process-seal-transaction', {
        body: {
          customer_card_id: customer.id,
          businessOwnerId: user.id,
          sealsToGive: finalSealsAmount,
          notes: notes || `Selos ${isAddingSeals ? 'adicionados' : 'removidos'} manualmente pelo lojista`,
        }
      });

      if (error) {
        console.error('Erro ao processar selos:', error);
        toast.error('Erro ao processar selos');
        return;
      }

      if (data?.success) {
        toast.success(`${sealsAmount} selo(s) ${isAddingSeals ? 'adicionado(s)' : 'removido(s)'} com sucesso!`);
        onSuccess();
        onClose();
      } else {
        toast.error('Erro ao processar transação');
      }
    } catch (error) {
      console.error('Erro ao processar selos:', error);
      toast.error('Erro ao processar selos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>
            Gerir Selos - {customer.profiles.full_name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Add/Remove Toggle */}
          <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-green-600" />
              <span className={isAddingSeals ? 'font-medium' : 'text-muted-foreground'}>Adicionar</span>
            </div>
            <Switch 
              checked={!isAddingSeals} 
              onCheckedChange={(checked) => {
                setIsAddingSeals(!checked);
                setSealsAmount(1);
              }}
            />
            <div className="flex items-center gap-2">
              <Minus className="w-4 h-4 text-red-600" />
              <span className={!isAddingSeals ? 'font-medium' : 'text-muted-foreground'}>Remover</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seals">
              Número de selos a {isAddingSeals ? 'adicionar' : 'remover'}
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSealsAmount(Math.max(1, sealsAmount - 1))}
                disabled={sealsAmount <= 1}
              >
                -
              </Button>
              <Input
                id="seals"
                type="number"
                min={1}
                max={isAddingSeals ? maxSealsToAdd : maxSealsToRemove}
                value={sealsAmount}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  const max = isAddingSeals ? maxSealsToAdd : maxSealsToRemove;
                  setSealsAmount(Math.min(max, Math.max(1, value)));
                }}
                className="text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const max = isAddingSeals ? maxSealsToAdd : maxSealsToRemove;
                  setSealsAmount(Math.min(max, sealsAmount + 1));
                }}
                disabled={sealsAmount >= (isAddingSeals ? maxSealsToAdd : maxSealsToRemove)}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {isAddingSeals 
                ? `Máximo: ${maxSealsToAdd} selo(s) | Atual: ${customer.current_seals}/${loyaltyCard.seal_count}`
                : `Máximo: ${maxSealsToRemove} selo(s) | Atual: ${customer.current_seals}/${loyaltyCard.seal_count}`
              }
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Comentário/Motivo (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Ex: Compra de R$ 150,00 em produtos"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 min-h-[44px]"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 min-h-[44px]"
              disabled={loading || sealsAmount <= 0 || sealsAmount > (isAddingSeals ? maxSealsToAdd : maxSealsToRemove)}
            >
              {loading 
                ? (isAddingSeals ? 'Adicionando...' : 'Removendo...') 
                : `${isAddingSeals ? 'Adicionar' : 'Remover'} ${sealsAmount} selo(s)`
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};