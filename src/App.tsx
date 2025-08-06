import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PrivateRoute from "@/components/PrivateRoute";

// Páginas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WizardPage from "./pages/WizardPage";
import AuthPage from "./pages/AuthPage";
import MyCardsPage from "./pages/MyCardsPage";
import MyCustomerCardsPage from "./pages/MyCustomerCardsPage";
import MyCustomerCardPage from "./pages/MyCustomerCardPage";
import CustomerManagementPage from "./pages/CustomerManagementPage";
import PublicCardPage from "./pages/PublicCardPage";

// ✅ Nova página de callback do OAuth
import CallbackPage from "./pages/callback";

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
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/callback" element={<CallbackPage />} /> {/* ✅ NOVA ROTA */}
              <Route path="/wizard" element={<PrivateRoute><WizardPage /></PrivateRoute>} />

              {/* Rotas Privadas */}
              <Route path="/my-cards" element={<PrivateRoute><MyCardsPage /></PrivateRoute>} />
              <Route path="/my-cards/:cardId/customers" element={<PrivateRoute><CustomerManagementPage /></PrivateRoute>} />
              <Route path="/my-customer-cards" element={<PrivateRoute><MyCustomerCardsPage /></PrivateRoute>} />
              <Route path="/my-card/:cardCode" element={<PrivateRoute><MyCustomerCardPage /></PrivateRoute>} />

              {/* Rota Pública para Cartão */}
              <Route path="/card/:publicCode" element={<PublicCardPage />} />

              {/* Rota "Catch-all" */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
