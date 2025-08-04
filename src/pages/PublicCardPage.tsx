import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { PhoneInput, getPlainPhoneNumber } from '@/components/ui/phone-input';
import { OtpInput } from '@/components/ui/otp-input';
import { SocialLoginButton } from '@/components/ui/social-login-button';
import { ArrowLeft, Loader2, Smartphone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CardPreview, CardData } from '@/components/wizard/CardPreview';
import { toast } from 'sonner';

interface LoyaltyCard {
  id: string;
  business_name: string;
  reward_description: string;
  logo_url: string;
  primary_color: string;
  background_color: string;
  background_pattern: string;
  seal_shape: string;
  seal_count: number;
  instructions: string;
  business_phone: string;
  business_email: string;
}

type FlowState = 'form' | 'otp-verification' | 'processing';
type AuthMethod = 'phone' | 'google';

const PublicCardPage = () => {
  const { publicCode } = useParams<{ publicCode: string }>();
  const navigate = useNavigate();
  const {
    user,
    session,
    loading: authLoading,
    otpSent,
    otpLoading,
    signInWithGoogle,
    signInWithPhone,
    verifyPhoneOtp,
    signUpWithPhone,
    checkUserByPhone,
  } = useAuth();

  // Card and participation state
  const [card, setCard] = useState<LoyaltyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isParticipant, setIsParticipant] = useState(false);
  const [checkingParticipation, setCheckingParticipation] = useState(false);

  // Form state
  const [flowState, setFlowState] = useState<FlowState>('form');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('phone');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [otp, setOtp] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch card data and check participation
  useEffect(() => {
    const fetchCardData = async () => {
      if (!publicCode) {
        setError('Código do cartão inválido.');
        setLoading(false);
        return;
      }

      try {
        const { data: cardData, error: cardError } = await supabase
          .from('loyalty_cards')
          .select('*')
          .eq('public_code', publicCode)
          .eq('is_active', true)
          .eq('is_published', true)
          .maybeSingle();

        if (cardError) throw new Error(`Erro na base de dados: ${cardError.message}`);
        if (!cardData) throw new Error('Este cartão não foi encontrado ou já não se encontra ativo.');

        setCard(cardData as LoyaltyCard);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, [publicCode]);

  // Check if user is already a participant
  useEffect(() => {
    const checkParticipation = async () => {
      if (!user || !card) return;

      setCheckingParticipation(true);
      try {
        const { data: participationData } = await supabase
          .from('customer_cards')
          .select('id')
          .eq('customer_id', user.id)
          .eq('loyalty_card_id', card.id)
          .maybeSingle();

        if (participationData) {
          setIsParticipant(true);
          toast.info("Já participa neste programa! A redirecionar...");
          setTimeout(() => navigate('/my-customer-cards'), 1500);
        }
      } catch (err) {
        console.error('Error checking participation:', err);
      } finally {
        setCheckingParticipation(false);
      }
    };

    checkParticipation();
  }, [user, card, navigate]);

  const handlePhoneSubmit = async () => {
    if (!formData.name.trim() || formData.name.length < 2) {
      toast.error('O nome deve ter pelo menos 2 caracteres');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Por favor, insira seu telefone');
      return;
    }

    const plainPhone = `+55${getPlainPhoneNumber(formData.phone)}`;

    try {
      setIsSubmitting(true);

      // Check if user already exists
      const { exists } = await checkUserByPhone(plainPhone);

      if (exists) {
        // Existing user - sign in
        const { error } = await signInWithPhone(plainPhone);
        if (error) throw error;
      } else {
        // New user - sign up
        const { error } = await signUpWithPhone(plainPhone, formData.name, formData.email);
        if (error) throw error;
      }

      setFlowState('otp-verification');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar código');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerification = async () => {
    if (otp.length !== 6) {
      toast.error('Por favor, insira o código de 6 dígitos');
      return;
    }

    const plainPhone = `+55${getPlainPhoneNumber(formData.phone)}`;

    try {
      setIsSubmitting(true);
      const { error } = await verifyPhoneOtp(plainPhone, otp);
      if (error) throw error;

      // After successful verification, proceed to participation
      await handleParticipation();
    } catch (error: any) {
      toast.error('Código inválido ou expirado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // Google auth will redirect, so participation will be handled after redirect
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login com Google');
      setIsSubmitting(false);
    }
  };

  const handleParticipation = async () => {
    if (!user || !card) return;

    try {
      setIsSubmitting(true);
      setFlowState('processing');

      const { error } = await supabase.functions.invoke('process-customer-participation', {
        body: {
          publicCode: publicCode,
          customerId: user.id,
          agreedToTerms: true,
          phoneNumber: formData.phone ? `+55${getPlainPhoneNumber(formData.phone)}` : undefined,
        },
      });

      if (error) throw new Error(error.message);

      toast.success(`Parabéns! Já faz parte do cartão fidelidade ${card.business_name}!`);
      navigate('/my-customer-cards');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao processar adesão');
      setFlowState('form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOneClickJoin = async () => {
    if (!agreedToTerms) {
      toast.error('Deve concordar com os termos para participar');
      return;
    }
    await handleParticipation();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Ocorreu um Erro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cardData: CardData = {
    logo_url: card.logo_url,
    business_name: card.business_name,
    reward_description: card.reward_description,
    primary_color: card.primary_color,
    backgroundColor: card.background_color,
    pattern: card.background_pattern as any,
    clientCode: '',
    phone: card.business_phone,
    email: card.business_email,
    sealCount: card.seal_count,
    sealShape: card.seal_shape as any,
    instructions: card.instructions,
  };

  // Scenario 3: Authenticated user already participating
  if (user && (isParticipant || checkingParticipation)) {
    return (
      <div className="min-h-screen bg-gradient-hero-new py-12">
        <main className="container mx-auto px-4">
          <div className="max-w-md mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                Cartão de Fidelidade {card.business_name}
              </h1>
            </div>
            <CardPreview cardData={cardData} size="lg" className="shadow-elegant" />
            <Card className="bg-white/95 backdrop-blur-lg">
              <CardContent className="py-8 text-center space-y-4">
                <div className="animate-pulse">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium">Já participa neste programa!</p>
                  <p className="text-sm text-muted-foreground">Redirecionando para os seus cartões...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero-new py-12">
      <main className="container mx-auto px-4">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              Cartão de Fidelidade {card.business_name}
            </h1>
          </div>

          <CardPreview cardData={cardData} size="lg" className="shadow-elegant" />

          <Card className="bg-white/95 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-center">
                {user ? `Olá, ${user.user_metadata?.full_name || user.email}!` : 'Adira Agora!'}
              </CardTitle>
              <p className="text-center text-sm text-muted-foreground pt-2">
                {user
                  ? 'Adira com um clique e comece a acumular selos.'
                  : 'Crie uma conta rápida para começar a acumular selos.'}
              </p>
            </CardHeader>

            <CardContent>
              {/* Scenario 2: Authenticated user - One Click Join */}
              {user && !isParticipant ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">Benefícios do Programa</h3>
                    <p className="text-sm text-muted-foreground">{card.reward_description}</p>
                    <p className="text-xs text-muted-foreground">{card.instructions}</p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    />
                    <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                      Concordo em participar na promoção e fazer parte do cartão de fidelidade{' '}
                      <strong>{card.business_name}</strong>, e em receber comunicações sobre o programa.
                    </Label>
                  </div>

                  <Button
                    onClick={handleOneClickJoin}
                    disabled={!agreedToTerms || isSubmitting}
                    variant="hero"
                    size="lg"
                    className="w-full"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                    Quero Aderir com 1 Clique!
                  </Button>
                </div>
              ) : (
                /* Scenario 1: New user - Registration flow */
                <div className="space-y-6">
                  {/* Google Login Button */}
                  <SocialLoginButton
                    provider="google"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting && authMethod === 'google' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    Continuar com Google
                  </SocialLoginButton>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">ou</span>
                    </div>
                  </div>

                  {/* Phone Registration Flow */}
                  {flowState === 'form' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Primeiro Nome</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Digite seu primeiro nome"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email (opcional)</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="seu@email.com"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Para recuperação da conta
                        </p>
                      </div>

                      <PhoneInput
                        label="Número de WhatsApp"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        required
                      />

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="terms"
                          checked={agreedToTerms}
                          onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                        />
                        <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                          Concordo em participar na promoção e fazer parte do cartão de fidelidade{' '}
                          <strong>{card.business_name}</strong>, e em receber comunicações sobre o programa.
                        </Label>
                      </div>

                      <Button
                        onClick={handlePhoneSubmit}
                        disabled={!agreedToTerms || isSubmitting || otpLoading}
                        variant="hero"
                        size="lg"
                        className="w-full"
                      >
                        {isSubmitting || otpLoading ? <Loader2 className="animate-spin mr-2" /> : <Smartphone className="w-4 h-4 mr-2" />}
                        Continuar com WhatsApp
                      </Button>
                    </div>
                  )}

                  {/* OTP Verification */}
                  {flowState === 'otp-verification' && (
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <Smartphone className="w-8 h-8 text-primary mx-auto" />
                        <h3 className="font-semibold">Código de Verificação</h3>
                        <p className="text-sm text-muted-foreground">
                          Enviamos um código de 6 dígitos para<br />
                          <strong>{formData.phone}</strong>
                        </p>
                      </div>

                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        length={6}
                        disabled={isSubmitting}
                      />

                      <Button
                        onClick={handleOtpVerification}
                        disabled={otp.length !== 6 || isSubmitting}
                        variant="hero"
                        size="lg"
                        className="w-full"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                        Verificar e Aderir
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() => {
                          setFlowState('form');
                          setOtp('');
                        }}
                        className="w-full"
                      >
                        Voltar
                      </Button>
                    </div>
                  )}

                  {/* Processing State */}
                  {flowState === 'processing' && (
                    <div className="text-center space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                      <p className="text-lg font-medium">Processando adesão...</p>
                      <p className="text-sm text-muted-foreground">
                        Estamos criando seu cartão de fidelidade
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PublicCardPage;
