import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getFidelixImageUrls } from '@/utils/uploadImages';
import { toast } from 'sonner';

interface LoyaltyCard {
  id: string;
  business_name: string;
  is_active: boolean;
}

const CustomerSignupPage = () => {
  const { publicCode } = useParams<{ publicCode: string }>();
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [card, setCard] = useState<LoyaltyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const imageUrls = getFidelixImageUrls();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/my-cards');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (publicCode) {
      fetchCard();
    }
  }, [publicCode]);

  const fetchCard = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_cards')
        .select('id, business_name, is_active')
        .eq('public_code', publicCode)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching card:', error);
        setError('Cartão não encontrado ou inativo');
        return;
      }

      setCard(data);
    } catch (error) {
      console.error('Error fetching card:', error);
      setError('Erro ao carregar cartão');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Validations
    if (!fullName.trim()) {
      toast.error('Por favor, digite seu nome completo');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setSubmitting(true);

    try {
      // Create user account
      const { error: signUpError } = await signUp(email, password, fullName);
      
      if (signUpError) {
        console.error('Signup error:', signUpError);
        if (signUpError.message.includes('already registered')) {
          toast.error('Este email já está cadastrado. Faça login em vez de criar uma nova conta.');
        } else {
          toast.error('Erro ao criar conta: ' + signUpError.message);
        }
        return;
      }

      // Get current session to get user ID
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error('Erro ao obter dados do usuário');
        return;
      }

      // Process customer participation
      const { data: participationData, error: participationError } = await supabase.functions
        .invoke('process-customer-participation', {
          body: {
            publicCode,
            customerId: session.user.id,
            agreedToTerms: true
          }
        });

      if (participationError || !participationData.success) {
        console.error('Participation error:', participationError || participationData.error);
        toast.error('Conta criada, mas erro ao processar participação. Tente novamente.');
        return;
      }

      toast.success('Conta criada e participação registrada com sucesso!');
      
      // Redirect to customer card page
      navigate(`/my-card/${participationData.customerCard.cardCode}`);
      
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      toast.error('Erro inesperado: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">
              Cartão não encontrado
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {error || 'Este cartão não existe ou não está mais ativo.'}
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/card/${publicCode}`)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <img 
                src={imageUrls.logoIcon} 
                alt="Fidelix mascote" 
                className="w-8 h-8"
              />
              <img 
                src={imageUrls.logoText} 
                alt="Fidelix" 
                className="h-6"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Criar Conta
            </h1>
            <p className="text-muted-foreground">
              Finalize seu cadastro para participar do cartão de fidelidade da <strong>{card.business_name}</strong>
            </p>
          </div>

          {/* Signup Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    Nome Completo *
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Telefone/WhatsApp
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Senha *
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Digite a senha novamente"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={submitting}
                  variant="hero"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    'Criar Conta e Participar'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CustomerSignupPage;