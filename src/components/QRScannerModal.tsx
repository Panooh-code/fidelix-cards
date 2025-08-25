import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (result: string) => void;
}

export const QRScannerModal = ({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    if (isOpen) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const startScanning = async () => {
    setError(null);
    setIsScanning(true);

    try {
      codeReader.current = new BrowserMultiFormatReader();
      
      const videoInputDevices = await codeReader.current.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        setError('Nenhuma câmara encontrada');
        setIsScanning(false);
        return;
      }

      // Tentar usar a câmara traseira primeiro
      const selectedDeviceId = videoInputDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('environment')
      )?.deviceId || videoInputDevices[0].deviceId;

      if (videoRef.current) {
        await codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              const scannedText = result.getText();
              console.log('QR Code scanned:', scannedText);
              
              // Extract card code from URL if it's a full URL
              let cardCode = scannedText;
              if (scannedText.includes('/customer-scan/')) {
                const urlParts = scannedText.split('/customer-scan/');
                cardCode = urlParts[1] || scannedText;
                console.log('Extracted card code from URL:', cardCode);
              }
              
              onScanSuccess(cardCode);
              onClose();
            }
          }
        );
      }
    } catch (err) {
      console.error('Erro ao iniciar scanner:', err);
      setError('Erro ao aceder à câmara. Verifique as permissões.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
      codeReader.current = null;
    }
    setIsScanning(false);
  };

  const handleClose = () => {
    stopScanning();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Escanear Código QR
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-destructive font-medium">Erro ao aceder à câmara</p>
                <p className="text-xs text-muted-foreground mt-1">{error}</p>
              </div>
              <Button onClick={startScanning} variant="outline">
                Tentar Novamente
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                {isScanning && (
                  <div className="absolute inset-0 border-2 border-primary rounded-lg">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-48 h-48 border-2 border-primary border-dashed rounded-lg"></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Posicione o código QR dentro da moldura
                </p>
                {isScanning && (
                  <p className="text-xs text-primary mt-1">A escanear...</p>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};