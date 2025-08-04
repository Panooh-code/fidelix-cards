// CAMINHO DO FICHEIRO: src/pages/PublicCardPage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CardPreview, CardData } from '@/components/wizard/CardPreview';
import { toast } from 'sonner';

// Interfaces para os tipos de dados
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

const PublicCardPage = () => {
  const { publicCode } = useParams<{ publicCode: string }>();
  const navigate = useNavigate();
  const { signUp, session, user } = useAuth();

  // Estados do componente
  const [card, setCard] = useState<LoyaltyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estados do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efeito para buscar os dados do cartão
  useEffect(() => {
    if (!publicCode) {
      setError('Código do cartão inválido.');
      setLoading(false);
      return;
    }

    const fetchCard = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('loyalty_cards')
          .select('*')
          .eq('public_code', publicCode)
          .eq('is_active', true)
          .single();

        if (dbError || !data) {
          throw new Error('Este cartão não foi encontrado ou já não se encontra ativo.');
        }
        setCard(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [publicCode]);

  // Efeito para verificar se o utilizador já está logado e participa
  useEffect(() => {
    if (user && card) {
      const checkParticipation = async () => {
        const { data } = await supabase
          .from('customer_cards')
          .select('card_code')
          .eq('customer_id', user.id)
          .eq('loyalty_card_id', card.id)
          .single();
        
        if (data) {
          // Se já participa, redireciona para a sua área de cartões
          toast.info("Já participa neste programa! A redirecionar...");
          navigate('/my-customer-cards');
        }
      };
      checkParticipation();
    }
  }, [user, card, navigate]);


  // Função para lidar com o registo do cliente
  const handleParticipation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast.error('Deve concordar com os termos para poder participar.');
      return;
    }
    setIsSubmitting(true);

    try {
      // 1. Registar o utilizador
      const { user: newUser, error: signUpError } = await signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (!newUser) {
        throw new Error('Registo falhou. Por favor, tente novamente.');
      }

      // 2. Chamar a Edge Function para associar o cartão ao cliente
      const { error: participationError } = await supabase.functions.invoke('process-customer-participation', {
        body: { loyaltyCardId: card!.id },
      });

      if (participationError) {
        throw new Error(`Erro ao aderir ao cartão: ${participationError.message}`);
      }

      // 3. Sucesso
      toast.success(`Parabéns, ${name}! É o mais novo membro do nosso cartão fidelidade ${card!.business_name}!`);
      navigate('/my-customer-cards');

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderização de ecrã de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Renderização de ecrã de erro
  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle className="text-center text-destructive">Ocorreu um Erro</CardTitle></CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Página Inicial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se o utilizador estiver logado, mas ainda não participa, não mostra o formulário completo.
  if (session) {
    // Esta parte pode ser melhorada para um fluxo de "um clique" se o utilizador já estiver logado.
    // Por agora, mantemos o fluxo de redirecionamento.
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

  // Renderização principal da página
  return (
    <div className="min-h-screen bg-gradient-hero-new py-12">
      <main className="container mx-auto px-4">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Cartão de Fidelidade {card.business_name}</h1>
          </div>

          <CardPreview cardData={cardData} size="lg" className="shadow-elegant" />

          <Card className="bg-white/95 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-center">Adira Agora!</CardTitle>
              <p className="text-center text-sm text-muted-foreground pt-2">
                Quer participar para colecionar selos e ganhar prémios? Crie uma conta gratuita.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleParticipation} className="space-y-4">
                <div>
                  <Label htmlFor="name">O seu nome</Label>
                  <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="relative">
                  <Label htmlFor="password">Palavra-passe</Label>
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked === true)} />
                  <Label htmlFor="terms" className="text-xs text-muted-foreground">
                    Concordo em participar na promoção e fazer parte do cartão de fidelidade {card.business_name}, e em receber comunicações sobre o programa.
                  </Label>
                </div>
                <Button type="submit" disabled={isSubmitting || !agreedToTerms} variant="hero" size="lg" className="w-full">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Criar Conta e Aderir'}
                </Button>
                <Button type="button" variant="link" onClick={() => navigate('/')} className="w-full">
                  Não, obrigado
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PublicCardPage;
