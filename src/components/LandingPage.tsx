import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CreditCard, 
  Smartphone, 
  Users, 
  BarChart3, 
  Zap, 
  Heart,
  Star,
  Shield
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-poppins font-bold text-foreground leading-tight">
                  Cartões de Fidelidade{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Digitais
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground font-inter leading-relaxed max-w-lg">
                  Crie programas de fidelidade para seu negócio em minutos. 
                  Simples, rápido e sem complicações.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="text-lg">
                  Começar Agora - Grátis
                </Button>
                <Button variant="outline" size="lg" className="text-lg">
                  Ver Demonstração
                </Button>
              </div>

              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span>100% Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent-yellow" />
                  <span>Setup em 5 minutos</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src={heroImage} 
                alt="Fidelix - Cartões de Fidelidade Digitais" 
                className="w-full h-auto rounded-2xl shadow-glow animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-poppins font-bold text-foreground">
              Tudo que você precisa em uma plataforma
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simplifique a gestão de fidelidade do seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-soft transition-all duration-300 group">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-primary rounded-3xl p-12 text-center space-y-8 shadow-glow">
            <div className="space-y-4">
              <h2 className="text-4xl font-poppins font-bold text-primary-foreground">
                Pronto para começar?
              </h2>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Junte-se a centenas de negócios que já transformaram 
                sua relação com os clientes
              </p>
            </div>
            
            <Button variant="accent" size="lg" className="text-lg px-12">
              Criar Minha Primeira Cartela
            </Button>

            <div className="flex justify-center items-center gap-2 text-primary-foreground/60">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-2">Avaliado com 5 estrelas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-poppins font-bold">Fidelix</h3>
              <p className="text-background/70">
                Cartões de fidelidade digitais para seu negócio
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-background/70">
              <Heart className="w-4 h-4 text-accent-yellow" />
              <span>Feito com amor no Brasil</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: CreditCard,
    title: "Cartelas Personalizadas",
    description: "Crie cartelas com a identidade visual do seu negócio em poucos cliques"
  },
  {
    icon: Smartphone,
    title: "100% Digital",
    description: "Seus clientes acessam via link ou QR Code, sem precisar baixar apps"
  },
  {
    icon: Users,
    title: "Gestão Simplificada",
    description: "Painel intuitivo para acompanhar todos os seus clientes fidelizados"
  },
  {
    icon: BarChart3,
    title: "Relatórios Completos",
    description: "Veja métricas importantes do seu programa de fidelidade"
  },
  {
    icon: Zap,
    title: "Setup Rápido",
    description: "Configure seu programa de fidelidade em menos de 5 minutos"
  },
  {
    icon: Shield,
    title: "Seguro e Confiável",
    description: "Seus dados e dos seus clientes protegidos com tecnologia de ponta"
  }
];

export default LandingPage;