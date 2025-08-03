import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
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
            <Logo className="h-8 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('benefits')}
              className="text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-purple-light dark:hover:text-fidelix-purple transition-colors font-medium"
            >
              Vantagens
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-purple-light dark:hover:text-fidelix-purple transition-colors font-medium"
            >
              Como Funciona
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-purple-light dark:hover:text-fidelix-purple transition-colors font-medium"
            >
              FAQs
            </button>
            <a 
              href="#"
              className="text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-purple-light dark:hover:text-fidelix-purple transition-colors font-medium"
            >
              Fidelix Academy
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
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
              <div className="flex items-center gap-3">
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

          {/* Mobile Menu Button and CTA */}
          <div className="flex lg:hidden items-center gap-2">
            <Button 
              variant="hero" 
              size="sm"
              onClick={() => navigate('/wizard')}
              className="text-xs px-3 py-2"
            >
              Criar Cartão
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-purple-light dark:hover:text-fidelix-purple transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full bg-background border-b border-border shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {/* Theme Toggle */}
              <div className="flex justify-center pb-4 border-b border-border">
                <ThemeToggle />
              </div>
              
              {/* Navigation */}
              <div className="space-y-3">
                <button 
                  onClick={() => scrollToSection('benefits')}
                  className="block w-full text-left py-3 px-4 text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-purple-light dark:hover:text-fidelix-purple transition-colors font-medium hover:bg-muted rounded-lg"
                >
                  Vantagens
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="block w-full text-left py-3 px-4 text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-purple-light dark:hover:text-fidelix-purple transition-colors font-medium hover:bg-muted rounded-lg"
                >
                  Como Funciona
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="block w-full text-left py-3 px-4 text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-purple-light dark:hover:text-fidelix-purple transition-colors font-medium hover:bg-muted rounded-lg"
                >
                  FAQs
                </button>
                <a 
                  href="#"
                  className="block w-full text-left py-3 px-4 text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-purple-light dark:hover:text-fidelix-purple transition-colors font-medium hover:bg-muted rounded-lg"
                >
                  Fidelix Academy
                </a>
              </div>
              
              {/* Auth Actions */}
              <div className="pt-4 border-t border-border space-y-3">
                {user ? (
                  <>
                    <button
                      onClick={() => handleNavigate('/my-cards')}
                      className="flex items-center w-full py-3 px-4 text-left hover:bg-muted rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Meus Cartões
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full py-3 px-4 text-left hover:bg-muted rounded-lg transition-colors text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sair
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavigate('/auth')}
                    className="flex items-center w-full py-3 px-4 text-left hover:bg-muted rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Entrar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;