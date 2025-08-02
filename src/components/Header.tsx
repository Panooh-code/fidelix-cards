import { Button } from "@/components/ui/button";
import { getFidelixImageUrls } from "@/utils/uploadImages";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const imageUrls = getFidelixImageUrls();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="https://www.fidelix.app" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src={imageUrls.logoIcon} 
              alt="Fidelix mascote" 
              className="w-10 h-10"
            />
            <img 
              src={imageUrls.logoText} 
              alt="Fidelix" 
              className="h-8"
            />
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('vantagens')}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Vantagens
            </button>
            <button 
              onClick={() => scrollToSection('como-funciona')}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Como Funciona
            </button>
          </nav>

          {/* CTA */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default">
                  <User className="w-4 h-4 mr-2" />
                  Minha Conta
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/my-cards')}>
                  <User className="w-4 h-4 mr-2" />
                  Meus Cartões
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="default"
                onClick={() => navigate('/auth')}
              >
                Entrar
              </Button>
              <Button 
                variant="hero" 
                size="default"
                onClick={() => navigate('/wizard')}
              >
                Criar Cartão Grátis
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;