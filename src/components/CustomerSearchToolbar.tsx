import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, QrCode } from 'lucide-react';

interface CustomerSearchToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenQRScanner: () => void;
  isSearching?: boolean;
}

export const CustomerSearchToolbar = ({
  searchTerm,
  onSearchChange,
  onOpenQRScanner,
  isSearching = false
}: CustomerSearchToolbarProps) => {
  return (
    <div className="space-y-4">
      {/* Scan Button - Prominent */}
      <div className="flex justify-center">
        <Button
          variant="default"
          onClick={onOpenQRScanner}
          disabled={isSearching}
          className="flex items-center gap-3 px-6 py-3 text-base font-medium h-12 bg-primary hover:bg-primary/90"
        >
          <QrCode className="w-6 h-6" />
          <span className="hidden sm:inline">Escanear Cartão do Cliente</span>
          <span className="sm:hidden">Escanear</span>
        </Button>
      </div>

      {/* General Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Filtrar por nome, email ou código..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};