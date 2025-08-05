import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Menu, X, Store, Gift, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useAuth();
  const { canAccessMerchantArea, canAccessCustomerArea, firstName } = useUserRoles();
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
              className="text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-lilac-light dark:hover:text-fidelix-purple-light transition-colors font-medium"
            >
              Vantagens
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-lilac-light dark:hover:text-fidelix-purple-light transition-colors font-medium"
            >
              Como Funciona
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-lilac-light dark:hover:text-fidelix-purple-light transition-colors font-medium"
            >
              FAQs
            </button>
            <a 
              href="#"
              className="text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-lilac-light dark:hover:text-fidelix-purple-light transition-colors font-medium"
            >
              Fidelix Academy
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                {/* CTA Button - Always visible for authenticated users */}
                <Button 
                  variant="hero" 
                  size="default"
                  onClick={() => navigate('/wizard')}
                  className="bg-gradient-to-r from-fidelix-purple to-fidelix-purple-dark hover:from-fidelix-purple-dark hover:to-fidelix-purple text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Cartão
                </Button>

                {/* User Menu Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="default" className="gap-2">
                      <User className="w-4 h-4" />
                      Olá, {firstName}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {canAccessMerchantArea && (
                      <DropdownMenuItem onClick={() => navigate('/my-cards')}>
                        <Store className="w-4 h-4 mr-2" />
                        Meus Negócios
                      </DropdownMenuItem>
                    )}
                    {canAccessCustomerArea && (
                      <DropdownMenuItem onClick={() => navigate('/my-customer-cards')}>
                        <Gift className="w-4 h-4 mr-2" />
                        Minhas Recompensas
                      </DropdownMenuItem>
                    )}
                    {(canAccessMerchantArea || canAccessCustomerArea) && (
                      <DropdownMenuSeparator />
                    )}
                    <div className="px-2 py-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Tema</span>
                        <ThemeToggle />
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Button 
                  variant="ghost" 
                  size="default"
                  onClick={() => navigate('/auth')}
                >
                  Entrar
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button and CTA */}
          <div className="flex lg:hidden items-center gap-2">
            {user && (
              <Button 
                variant="hero" 
                size="sm"
                onClick={() => navigate('/wizard')}
                className="text-xs px-3 py-2 bg-gradient-to-r from-fidelix-purple to-fidelix-purple-dark hover:from-fidelix-purple-dark hover:to-fidelix-purple text-white font-semibold shadow-lg"
              >
                <Plus className="w-3 h-3 mr-1" />
                Criar
              </Button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-lilac-light dark:hover:text-fidelix-purple-light transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full bg-background border-b border-border shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {/* User Greeting for Mobile */}
              {user && (
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-fidelix-purple" />
                    <span className="font-medium">Olá, {firstName}</span>
                  </div>
                  <ThemeToggle />
                </div>
              )}

              {/* Theme Toggle for guests */}
              {!user && (
                <div className="flex justify-center pb-4 border-b border-border">
                  <ThemeToggle />
                </div>
              )}
              
              {/* Navigation */}
              <div className="space-y-3">
                <button 
                  onClick={() => scrollToSection('benefits')}
                  className="block w-full text-left py-3 px-4 text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-lilac-light dark:hover:text-fidelix-purple-light transition-colors font-medium hover:bg-muted rounded-lg"
                >
                  Vantagens
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="block w-full text-left py-3 px-4 text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-lilac-light dark:hover:text-fidelix-purple-light transition-colors font-medium hover:bg-muted rounded-lg"
                >
                  Como Funciona
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="block w-full text-left py-3 px-4 text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-lilac-light dark:hover:text-fidelix-purple-light transition-colors font-medium hover:bg-muted rounded-lg"
                >
                  FAQs
                </button>
                <a 
                  href="#"
                  className="block w-full text-left py-3 px-4 text-fidelix-purple hover:text-fidelix-purple-light dark:text-fidelix-lilac-light dark:hover:text-fidelix-purple-light transition-colors font-medium hover:bg-muted rounded-lg"
                >
                  Fidelix Academy
                </a>
              </div>
              
              {/* Auth Actions */}
              <div className="pt-4 border-t border-border space-y-3">
                {user ? (
                  <>
                    {/* CTA for mobile authenticated users */}
                    <button
                      onClick={() => handleNavigate('/wizard')}
                      className="flex items-center w-full py-3 px-4 text-left hover:bg-muted rounded-lg transition-colors bg-gradient-to-r from-fidelix-purple to-fidelix-purple-dark text-white font-medium"
                    >
                      <Plus className="w-4 h-4 mr-3" />
                      Criar Cartão de Fidelidade
                    </button>

                    {/* Contextual menu items */}
                    {canAccessMerchantArea && (
                      <button
                        onClick={() => handleNavigate('/my-cards')}
                        className="flex items-center w-full py-3 px-4 text-left hover:bg-muted rounded-lg transition-colors"
                      >
                        <Store className="w-4 h-4 mr-3" />
                        Meus Negócios
                      </button>
                    )}
                    
                    {canAccessCustomerArea && (
                      <button
                        onClick={() => handleNavigate('/my-customer-cards')}
                        className="flex items-center w-full py-3 px-4 text-left hover:bg-muted rounded-lg transition-colors"
                      >
                        <Gift className="w-4 h-4 mr-3" />
                        Minhas Recompensas
                      </button>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full py-3 px-4 text-left hover:bg-muted rounded-lg transition-colors text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavigate('/auth')}
                      className="flex items-center w-full py-3 px-4 text-left hover:bg-muted rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Entrar
                    </button>
                    <button
                      onClick={() => handleNavigate('/wizard')}
                      className="flex items-center w-full py-3 px-4 text-left hover:bg-muted rounded-lg transition-colors bg-gradient-to-r from-fidelix-purple to-fidelix-purple-dark text-white font-medium"
                    >
                      <Plus className="w-4 h-4 mr-3" />
                      Criar Cartão Grátis
                    </button>
                  </>
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