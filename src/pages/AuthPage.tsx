import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Loader2 } from 'lucide-react';
import { formatPhoneNumber } from '@/utils/phoneMask';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingAdhesion, setIsProcessingAdhesion] = useState(false);

  const { user, signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user) {
      const autoAdhesion = searchParams.get('autoAdhesion');
      const publicCode = searchParams.get('publicCode');
      const businessName = searchParams.get('businessName');
      
      // If auto adhesion is requested, process it
      if (autoAdhesion === 'true' && publicCode && businessName) {
        processAutoAdhesion(publicCode, decodeURIComponent(businessName), user.id);
      } else {
        // Normal redirect flow
        const redirectPath = searchParams.get('redirect');
        console.log('User logged in, redirecting to:', redirectPath);
        
        if (redirectPath) {
          const decodedPath = decodeURIComponent(redirectPath);
          console.log('Decoded redirect path:', decodedPath);
          navigate(decodedPath, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    }
  }, [user, navigate, searchParams]);

  const processAutoAdhesion = async (publicCode: string, businessName: string, userId: string) => {
    setIsProcessingAdhesion(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-customer-participation', {
        body: { 
          publicCode: publicCode, 
          customerId: userId, 
          agreedToTerms: true 
        },
      });

      if (error) {
        throw new Error("A função de adesão falhou: " + error.message);
      }

      toast.success(`Parabéns! Já faz parte do cartão fidelidade ${businessName}! Você ganhou seu primeiro selo!`);
      
      // Redirect to customer cards page
      if (data?.customerCard?.cardCode) {
        navigate(`/my-card/${data.customerCard.cardCode}`, { replace: true });
      } else {
        navigate('/my-customer-cards', { replace: true });
      }
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro na adesão automática.");
      // Fallback to normal redirect
      const redirectPath = searchParams.get('redirect');
      if (redirectPath) {
        const decodedPath = decodeURIComponent(redirectPath);
        navigate(decodedPath, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } finally {
      setIsProcessingAdhesion(false);
    }
  };

  const validateForm = () => {
    if (isResetPassword) {
      if (!email.trim()) {
        toast.error('Digite seu email');
        return false;
      }
      return true;
    }

    if (!email.trim()) {
      toast.error('Digite seu email');
      return false;
    }

    if (!isLogin && !fullName.trim()) {
      toast.error('Digite seu nome completo');
      return false;
    }

    if (!password.trim()) {
      toast.error('Digite sua senha');
      return false;
    }

    if (!isLogin && password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isResetPassword) {
        const { error } = await resetPassword(email);
        if (!error) {
          setIsResetPassword(false);
          setEmail('');
        }
      } else if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName, whatsapp || undefined);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsappChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setWhatsapp(formatted);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setWhatsapp('');
    setShowPassword(false);
    setIsResetPassword(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleBackToHome = () => {
    const redirectPath = searchParams.get('redirect') || '/';
    navigate(redirectPath);
  };

  // Show loading state during auto adhesion
  if (isProcessingAdhesion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero p-4">
        <div className="mb-6">
          <img
            className="h-10 w-auto"
            src="https://i.imgur.com/ZaW7mB9.png"
            alt="Logo do Fidelix"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://placehold.co/150x40/FFFFFF/1E1B4B?text=Fidelix';
            }}
          />
        </div>
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Processando Adesão</h3>
              <p className="text-sm text-muted-foreground">
                Aguarde enquanto processamos sua participação no programa de fidelidade...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isResetPassword) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero p-4">
        {/* Logo branco centralizado */}
        <div className="mb-6">
          <img
            className="h-10 w-auto"
            src="https://i.imgur.com/ZaW7mB9.png"
            alt="Logo do Fidelix"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://placehold.co/150x40/FFFFFF/1E1B4B?text=Fidelix';
            }}
          />
        </div>
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-2 text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
              <CardDescription>
                Digite seu email para receber o link de recuperação
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </Button>
            </form>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsResetPassword(false)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero p-4">
      {/* Logo branco centralizado */}
      <div className="mb-6">
        <img
          className="h-10 w-auto"
          src="https://i.imgur.com/ZaW7mB9.png"
          alt="Logo do Fidelix"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://placehold.co/150x40/FFFFFF/1E1B4B?text=Fidelix';
          }}
        />
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center pb-4">
          <div>
            <CardTitle className="text-xl">
              {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
            </CardTitle>
            <CardDescription className="text-sm">
              {isLogin 
                ? 'Entre na sua conta para continuar' 
                : 'Crie sua conta para começar'
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Login Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-10 text-sm font-medium"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="+55 (11) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => handleWhatsappChange(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Informe seu WhatsApp para receber avisos de ofertas especiais e promoções com mais facilidade.
                </p>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => setIsResetPassword(true)}
                >
                  Esqueci a senha
                </button>
              </div>
            )}

            <Button type="submit" className="w-full h-10 text-sm font-medium" disabled={isLoading}>
              {isLoading 
                ? 'Carregando...' 
                : isLogin 
                  ? 'Entrar' 
                  : 'Criar conta'
              }
            </Button>
          </form>

          {/* Switch between login/signup */}
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            </span>{' '}
            <button
              type="button"
              className="text-sm text-primary hover:underline font-medium"
              onClick={switchMode}
            >
              {isLogin ? 'Criar conta' : 'Entrar'}
            </button>
          </div>

          {/* Back button */}
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleBackToHome}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
