

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PrivateRoute from "@/components/PrivateRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WizardPage from "./pages/WizardPage";
import AuthPage from "./pages/AuthPage";
import MyCardsPage from "./pages/MyCardsPage";
import PublicCardPage from "./pages/PublicCardPage";
import PublicCardViewPage from "./pages/PublicCardViewPage";
import CustomerSignupPage from "./pages/CustomerSignupPage";
import MyCustomerCardPage from "./pages/MyCustomerCardPage";
import MyCustomerCardsPage from "./pages/MyCustomerCardsPage";
import CustomerManagementPage from "./pages/CustomerManagementPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/wizard" element={<WizardPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/my-cards" element={<PrivateRoute><MyCardsPage /></PrivateRoute>} />
              <Route path="/my-cards/:cardId/customers" element={<PrivateRoute><CustomerManagementPage /></PrivateRoute>} />
              <Route path="/my-customer-cards" element={<PrivateRoute><MyCustomerCardsPage /></PrivateRoute>} />
              
              {/* Public Card Routes */}
              <Route path="/card/:publicCode" element={<PublicCardPage />} />
              <Route path="/card/:publicCode/view" element={<PublicCardViewPage />} />
              <Route path="/card/:publicCode/signup" element={<CustomerSignupPage />} />
              
              {/* Private Customer Card Route */}
              <Route path="/my-card/:cardCode" element={
                <PrivateRoute>
                  <MyCustomerCardPage />
                </PrivateRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
