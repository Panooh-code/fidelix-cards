import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, LogOut, Store, Gift, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MinimalHeader = () => {
  const { user, signOut } = useAuth();
  const { canAccessMerchantArea, canAccessCustomerArea, firstName } = useUserRoles();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50 h-14">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo - Link to home */}
          <a 
            href="/" 
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Logo className="h-7 w-auto" />
          </a>

          {/* Desktop: Back Button + User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {firstName}
                    <ChevronDown className="w-3 h-3" />
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
            ) : (
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  Entrar
                </Button>
              </div>
            )}
          </div>

          {/* Mobile: Back Button + User Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="text-muted-foreground hover:text-foreground p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 px-2">
                    <User className="w-4 h-4" />
                    <span className="hidden xs:inline">{firstName}</span>
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
            ) : (
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="px-2"
                >
                  <User className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MinimalHeader;