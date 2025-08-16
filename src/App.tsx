

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PrivateRoute from "@/components/PrivateRoute";
import ConditionalLayout from "@/components/ConditionalLayout";

// Apenas importamos as páginas que sabemos que existem
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WizardPage from "./pages/WizardPage";
import AuthPage from "./pages/AuthPage";
import MyCardsPage from "./pages/MyCardsPage";
import MyCustomerCardsPage from "./pages/MyCustomerCardsPage";
import MyCustomerCardPage from "./pages/MyCustomerCardPage";
import CustomerManagementPage from "./pages/CustomerManagementPage";
import PublicCardPage from "./pages/PublicCardPage";
import CustomerScanPage from "./pages/CustomerScanPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <ConditionalLayout>
              <Routes>
                {/* Rotas Principais */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                {/* Wizard agora é público - usuário só precisa logar na hora de publicar */}
                <Route path="/wizard" element={<WizardPage />} />

                {/* Rotas Privadas */}
                <Route path="/my-cards" element={<PrivateRoute><MyCardsPage /></PrivateRoute>} />
                <Route path="/my-cards/:cardId/customers" element={<PrivateRoute><CustomerManagementPage /></PrivateRoute>} />
                <Route path="/my-customer-cards" element={<PrivateRoute><MyCustomerCardsPage /></PrivateRoute>} />
                <Route path="/my-card/:cardCode" element={<PrivateRoute><MyCustomerCardPage /></PrivateRoute>} />
                
                {/* Rota Pública ÚNICA para o cartão */}
                <Route path="/card/:publicCode" element={<PublicCardPage />} />
                
                {/* Rota para escaneamento de QR codes por lojistas */}
                <Route path="/customer-scan/:cardCode" element={<CustomerScanPage />} />
                
                {/* Rota "Catch-all" */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ConditionalLayout>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
