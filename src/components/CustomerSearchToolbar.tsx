import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, QrCode, Loader2 } from 'lucide-react';

interface CustomerSearchToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchByCode: (code: string) => void;
  onOpenQRScanner: () => void;
  isSearching?: boolean;
}

export const CustomerSearchToolbar = ({
  searchTerm,
  onSearchChange,
  onSearchByCode,
  onOpenQRScanner,
  isSearching = false
}: CustomerSearchToolbarProps) => {
  const [codeSearchInput, setCodeSearchInput] = useState('');

  const handleSearchByCode = () => {
    if (codeSearchInput.trim()) {
      onSearchByCode(codeSearchInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchByCode();
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Search by Code */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Digitar código do cliente..."
            value={codeSearchInput}
            onChange={(e) => setCodeSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-sm"
            disabled={isSearching}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleSearchByCode}
          disabled={!codeSearchInput.trim() || isSearching}
          className="min-w-[100px]"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Procurar
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onOpenQRScanner}
          disabled={isSearching}
          className="flex items-center gap-2 px-3"
        >
          <QrCode className="w-4 h-4" />
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