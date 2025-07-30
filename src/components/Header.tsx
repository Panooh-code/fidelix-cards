import { Button } from "@/components/ui/button";
import logoIcon from "@/assets/logo-icon.png";
import logoText from "@/assets/logo-text.png";

const Header = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
              src={logoIcon} 
              alt="Fidelix mascote" 
              className="w-10 h-10"
            />
            <img 
              src={logoText} 
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
          <Button variant="hero" size="default">
            Criar Cartão Grátis
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;