import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Copy, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string;
  businessName: string;
}

const QRCodeModal = ({ isOpen, onClose, qrCodeUrl, businessName }: QRCodeModalProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Meu cartão de fidelidade - ${businessName}`,
          text: `Confira meu cartão de fidelidade do ${businessName}!`,
          url: qrCodeUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeUrl);
      toast({
        title: "Link copiado!",
        description: "O link do seu cartão foi copiado para a área de transferência.",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppShare = () => {
    const message = `Confira meu cartão de fidelidade do *${businessName}*! 🎉`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code - {businessName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-center p-4 bg-white rounded-lg">
            <img
              src={qrCodeUrl}
              alt={`QR Code do cartão ${businessName}`}
              className="w-48 h-48 object-contain"
            />
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Mostre este QR code para o estabelecimento para ganhar selos
          </p>
          
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={handleShare} size="sm" variant="outline">
              <Share2 className="h-4 w-4 mr-1" />
              Compartilhar
            </Button>
            <Button onClick={handleCopyLink} size="sm" variant="outline">
              <Copy className="h-4 w-4 mr-1" />
              Copiar
            </Button>
            <Button onClick={handleWhatsAppShare} size="sm" variant="outline">
              <MessageCircle className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;