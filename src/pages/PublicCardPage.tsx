import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CardPreview, CardData } from '@/components/wizard/CardPreview';
import { getFidelixImageUrls } from '@/utils/uploadImages';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

interface LoyaltyCard {
  id: string;
  business_name: string;
  business_segment: string;
  business_phone: string;
  business_email: string;
  business_address?: string;
  social_network?: string;
  is_whatsapp: boolean;
  logo_url: string;
  client_code: string;
  public_code?: string;
  qr_code_url?: string;
  primary_color: string;
  background_color: string;
  background_pattern: string;
  seal_shape: string;
  seal_count: number;
  reward_description: string;
  instructions: string;
  is_active: boolean;
}

type UserStatus = 'loading' | 'guest' | 'authenticated-visitor' | 'authenticated-participant' | 'error';

const PublicCardPage = () => {
  const { publicCode } = useParams<{ publicCode: string }>();
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const { t } = useTranslation();
  
  // Card data
  const [card, setCard] = useState<LoyaltyCard | null>(null);
  const [cardLoading, setCardLoading] = useState(true);
  const [cardError, setCardError] = useState('');
  
  // User status
  const [userStatus, setUserStatus] = useState<UserStatus>('loading');
  const [customerCard, setCustomerCard] = useState<string | null>(null);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const imageUrls = getFidelixImageUrls();

  useEffect(() => {
    if (publicCode) {
      fetchCard();
    }
  }, [publicCode]);

  useEffect(() => {
    if (card && publicCode) {
      checkUserStatus();
    }
  }, [card, user, publicCode]);

  const fetchCard = async () => {
    try {
      const { data, error } = await supabase
        .from('loyalty_cards')
        .select('*')
        .eq('public_code', publicCode)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching card:', error);
        setCardError(t('cardNotFound'));
        return;
      }

      setCard(data);
    } catch (error) {
      console.error('Error fetching card:', error);
      setCardError(t('cardNotFound'));
    } finally {
      setCardLoading(false);
    }
  };

  const checkUserStatus = async () => {
    if (!user) {
      setUserStatus('guest');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('get-customer-status', {
        body: {
          publicCode,
          customerId: user.id
        }
      });

      if (error) {
        console.error('Error checking user status:', error);
        setUserStatus('error');
        return;
      }

      if (data.status === 'participant') {
        setCustomerCard(data.cardCode);
        setUserStatus('authenticated-participant');
        // Redirect to customer cards after a short delay to show the message
        setTimeout(() => {
          navigate('/my-customer-cards');
        }, 2000);
      } else {
        setUserStatus('authenticated-visitor');
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      setUserStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!agreedToTerms) {
      toast.error(t('errorMustAgreeTerms'));
      return;
    }

    // Validation for guests (need full signup)
    if (userStatus === 'guest') {
      if (!fullName.trim() || fullName.trim().length < 2) {
        toast.error(t('errorInvalidName'));
        return;
      }
      if (password !== confirmPassword) {
        toast.error(t('errorPasswordMismatch'));
        return;
      }
      if (password.length < 6) {
        toast.error(t('errorPasswordLength'));
        return;
      }
    }

    setSubmitting(true);

    try {
      let userId = user?.id;

      // Create account if user is a guest
      if (userStatus === 'guest') {
        const { error: signUpError } = await signUp(email, password, fullName);
        
        if (signUpError) {
          console.error('Signup error:', signUpError);
          if (signUpError.message.includes('already registered')) {
            toast.error(t('errorEmailExists'));
          } else {
            toast.error(t('errorGeneral'));
          }
          return;
        }

        // Get the new user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          toast.error(t('errorGeneral'));
          return;
        }
        
        userId = session.user.id;
      }

      // Process customer participation
      const { data: participationData, error: participationError } = await supabase.functions
        .invoke('process-customer-participation', {
          body: {
            publicCode,
            customerId: userId,
            agreedToTerms: true,
            phoneNumber: phone || undefined
          }
        });

      if (participationError || !participationData?.success) {
        console.error('Participation error:', participationError || participationData?.error);
        toast.error(t('errorGeneral'));
        return;
      }

      toast.success(t('successNotification', { businessName: card?.business_name }));
      
      // Redirect to customer cards list page
      navigate('/my-customer-cards');
      
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      toast.error(t('errorGeneral'));
    } finally {
      setSubmitting(false);
    }
  };

  if (cardLoading || userStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (cardError || !card) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">
              {t('cardNotFound')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {cardError || t('cardNotFoundMessage')}
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backButton')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Already participating - show message and redirect
  if (userStatus === 'authenticated-participant') {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-green-600">
              {t('alreadyParticipating')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {t('alreadyParticipatingMessage')}
            </p>
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
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
    clientCode: card.client_code,
    phone: card.business_phone,
    email: card.business_email,
    address: card.business_address,
    socialNetwork: card.social_network,
    sealCount: card.seal_count,
    sealShape: card.seal_shape as any,
    instructions: card.instructions,
  };

  return (
    <div className="min-h-screen bg-gradient-hero-new">
      {/* Header Redesigned */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-border/20 shadow-elegant">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backButton')}
            </Button>
            
            <div 
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => navigate('/')}
            >
              <img 
                src={imageUrls.logoText} 
                alt="Fidelix" 
                className="h-10"
              />
            </div>
            
            <div className="w-16" /> {/* Spacer for balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Title Section */}
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
              {t('pageTitle', { businessName: card.business_name })}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              {userStatus === 'guest' 
                ? t('formLabelName') 
                : t('ctaButtonJoin')
              }
            </p>
          </div>

          {/* Card Display */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="hover:scale-105 transition-transform duration-300">
              <CardPreview 
                cardData={cardData} 
                size="lg"
                className="shadow-elegant"
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              {userStatus === 'guest' ? t('ctaButton') : t('ctaButtonJoin')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-fidelix-yellow to-accent mx-auto rounded-full shadow-glow"></div>
          </div>

          {/* Signup/Join Form */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Card className="w-full max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-0 shadow-elegant rounded-3xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Form Fields - Show based on user status */}
                  {userStatus === 'guest' && (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                          {t('formLabelName')} *
                        </label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder={t('formPlaceholderName')}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                          {t('formLabelEmail')} *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('formPlaceholderEmail')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-foreground">
                          {t('formLabelPassword')} *
                        </label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('formPlaceholderPassword')}
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
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                          {t('formLabelConfirmPassword')} *
                        </label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder={t('formPlaceholderConfirmPassword')}
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
                    </>
                  )}

                  {/* WhatsApp field for all users */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      {t('formLabelWhatsapp')}
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('formPlaceholderWhatsapp')}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start space-x-4">
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                      className="mt-1 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label 
                      htmlFor="terms" 
                      className="text-sm text-foreground leading-relaxed cursor-pointer font-medium"
                    >
                      {t('consentCheckbox', { businessName: card.business_name })}
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <Button 
                      type="submit"
                      disabled={!agreedToTerms || submitting}
                      variant="hero"
                      size="lg"
                      className="w-full h-14 text-lg font-bold shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('ctaButtonProcessing')}
                        </>
                      ) : (
                        userStatus === 'guest' ? t('ctaButton') : t('ctaButtonJoin')
                      )}
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => navigate('/')}
                      className="w-full h-12 border-2 hover:bg-muted/50"
                      size="lg"
                    >
                      {t('declineLink')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicCardPage;