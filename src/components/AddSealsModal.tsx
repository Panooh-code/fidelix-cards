import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

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
  const [sealsToAdd, setSealsToAdd] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const maxSealsToAdd = loyaltyCard.seal_count - customer.current_seals;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || sealsToAdd <= 0 || sealsToAdd > maxSealsToAdd) {
      return;
    }

    setLoading(true);

    try {
      // Chamar edge function para processar a adição de selos
      const { data, error } = await supabase.functions.invoke('process-seal-transaction', {
        body: {
          customer_card_id: customer.id,
          seals_given: sealsToAdd,
          notes: notes || `Selos adicionados manualmente pelo lojista`,
        }
      });

      if (error) {
        console.error('Erro ao adicionar selos:', error);
        toast.error('Erro ao adicionar selos');
        return;
      }

      if (data?.success) {
        toast.success(`${sealsToAdd} selo(s) adicionado(s) com sucesso!`);
        onSuccess();
      } else {
        toast.error('Erro ao processar transação');
      }
    } catch (error) {
      console.error('Erro ao adicionar selos:', error);
      toast.error('Erro ao adicionar selos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Adicionar Selos - {customer.profiles.full_name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seals">Número de selos</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSealsToAdd(Math.max(1, sealsToAdd - 1))}
                disabled={sealsToAdd <= 1}
              >
                -
              </Button>
              <Input
                id="seals"
                type="number"
                min={1}
                max={maxSealsToAdd}
                value={sealsToAdd}
                onChange={(e) => setSealsToAdd(Math.min(maxSealsToAdd, Math.max(1, parseInt(e.target.value) || 1)))}
                className="text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSealsToAdd(Math.min(maxSealsToAdd, sealsToAdd + 1))}
                disabled={sealsToAdd >= maxSealsToAdd}
              >
                +
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Máximo: {maxSealsToAdd} selo(s) | Atual: {customer.current_seals}/{loyaltyCard.seal_count}
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

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || sealsToAdd <= 0 || sealsToAdd > maxSealsToAdd}
            >
              {loading ? 'Adicionando...' : `Adicionar ${sealsToAdd} selo(s)`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};