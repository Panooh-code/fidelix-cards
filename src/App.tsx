import { Toaster } from "@/components/ui/sonner"; // Corrigido para usar o Sonner como Toaster principal
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PrivateRoute from "@/components/PrivateRoute";

// Importação das páginas existentes
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WizardPage from "./pages/WizardPage";
import AuthPage from "./pages/AuthPage";
import MyCardsPage from "./pages/MyCardsPage";
import CustomerManagementPage from "./pages/CustomerManagementPage";
import MyCustomerCardsPage from "./pages/MyCustomerCardsPage";
import MyCustomerCardPage from "./pages/MyCustomerCardPage";

// As páginas que foram removidas/substituídas já não são importadas
import PublicCardPage from "./pages/PublicCardPage";
import CustomerSignupPage from "./pages/CustomerSignupPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Rotas Principais */}
              <Route path="/" element={<Index />} />
              <Route path="/wizard" element={<WizardPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Rotas Privadas para Lojistas */}
              <Route path="/my-cards" element={<PrivateRoute><MyCardsPage /></PrivateRoute>} />
              <Route path="/my-cards/:cardId/customers" element={<PrivateRoute><CustomerManagementPage /></PrivateRoute>} />
              
              {/* Rotas Privadas para Clientes */}
              <Route path="/my-customer-cards" element={<PrivateRoute><MyCustomerCardsPage /></PrivateRoute>} />
              <Route path="/my-card/:cardCode" element={<PrivateRoute><MyCustomerCardPage /></PrivateRoute>} />
              
              {/* Rotas Públicas dos Cartões (Simplificadas) */}
              <Route path="/card/:publicCode" element={<PublicCardPage />} />
              <Route path="/card/:publicCode/signup" element={<CustomerSignupPage />} />
              
              {/* Rota "Catch-all" para páginas não encontradas */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
