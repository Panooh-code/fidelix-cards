import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "./Header";
import CardGallery from "./CardGallery";
import StarField from "./StarField";
import { getFidelixImageUrls } from "@/utils/uploadImages";

const LandingPageNew = () => {
  const imageUrls = getFidelixImageUrls();
  
  return (
    <div className="min-h-screen bg-background relative">
      <StarField />
      <div className="relative z-10">
        <Header />
      
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-hero-new pt-24">
          <div className="container mx-auto px-4 py-16 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 lg:space-y-8 animate-fade-in text-center lg:text-left">
                <div className="space-y-4 lg:space-y-6">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-poppins font-bold text-foreground leading-tight">
                    O pulo do gato é{" "}
                    <span className="bg-gradient-primary bg-clip-text text-transparent">
                      fidelizar
                    </span>{" "}
                    seus clientes!
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground font-inter leading-relaxed max-w-lg mx-auto lg:mx-0">
                    Chegou Fidelix. Crie uma cartela de selos digitais para o seu negócio 
                    e começe já a conquistar clientes!
                  </p>
                </div>

                <Button variant="hero" size="lg" className="text-base lg:text-lg px-6 lg:px-8 w-full sm:w-auto">
                  Crie a sua cartela em 1 minuto
                </Button>
              </div>

              <div className="relative mt-8 lg:mt-0">
                <CardGallery />
              </div>
            </div>
          </div>
        </section>

        {/* Vantagens Section */}
        <section id="vantagens" className="py-8 sm:py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-3 lg:space-y-4 mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-poppins font-bold text-foreground">
                Vantagens do Fidelix
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                Descubra como é fácil fidelizar seus clientes
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <Card className="group relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 border border-border/50 shadow-elegant hover:shadow-premium transition-all duration-500 hover:scale-[1.02] hover:border-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="relative p-6 lg:p-8 space-y-4 lg:space-y-6 text-center">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto group-hover:scale-105 transition-transform duration-500">
                    <img 
                      src={imageUrls.advantage1} 
                      alt="Fidelize e aumente suas vendas" 
                      className="w-full h-full object-contain drop-shadow-sm"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg lg:text-xl xl:text-2xl font-poppins font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                    Fidelize e aumente suas vendas já
                  </h3>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 border border-border/50 shadow-elegant hover:shadow-premium transition-all duration-500 hover:scale-[1.02] hover:border-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="relative p-6 lg:p-8 space-y-4 lg:space-y-6 text-center">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto group-hover:scale-105 transition-transform duration-500">
                    <img 
                      src={imageUrls.advantage2} 
                      alt="Fique tranquilo, Fidelix é realmente descomplicado" 
                      className="w-full h-full object-contain drop-shadow-sm"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg lg:text-xl xl:text-2xl font-poppins font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                    Fique tranquilo, Fidelix é realmente descomplicado
                  </h3>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 border border-border/50 shadow-elegant hover:shadow-premium transition-all duration-500 hover:scale-[1.02] hover:border-primary/20 sm:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="relative p-6 lg:p-8 space-y-4 lg:space-y-6 text-center">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto group-hover:scale-105 transition-transform duration-500">
                    <img 
                      src={imageUrls.advantage3} 
                      alt="Sem papel. Sem downloads. Controle tudo pela web" 
                      className="w-full h-full object-contain drop-shadow-sm"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-lg lg:text-xl xl:text-2xl font-poppins font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                    Sem papel. Sem downloads. Controle tudo pela web
                  </h3>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section id="como-funciona" className="py-8 sm:py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-3 lg:space-y-4 mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-poppins font-bold text-foreground">
                Como Funciona
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                Em 3 passos simples, você está pronto
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  step: "1",
                  title: "Crie sua cartela",
                  description: "Configure em 1 minuto com a identidade do seu negócio"
                },
                {
                  step: "2", 
                  title: "Compartilhe o link",
                  description: "Seus clientes acessam via QR Code ou link direto"
                },
                {
                  step: "3",
                  title: "Controle tudo",
                  description: "Gerencie selos e recompensas pelo seu painel"
                }
              ].map((item, index) => (
                <div key={index} className="text-center space-y-4 lg:space-y-6 group sm:col-span-1 lg:col-span-1">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-xl lg:text-2xl font-bold text-primary-foreground shadow-glow group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-lg lg:text-xl font-poppins font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground px-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-primary rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 text-center space-y-6 lg:space-y-8 shadow-glow">
              <div className="space-y-3 lg:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-poppins font-bold text-primary-foreground">
                  Pronto para dar o pulo do gato?
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                  Junte-se a centenas de negócios que já transformaram 
                  sua relação com os clientes usando Fidelix
                </p>
              </div>
              
              <Button variant="accent" size="lg" className="text-base lg:text-lg px-8 lg:px-12 w-full sm:w-auto">
                Criar Minha Primeira Cartela
              </Button>

              <div className="flex justify-center items-center gap-2 text-primary-foreground/60 text-sm lg:text-base">
                <span>✨ Grátis para sempre ✨</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-b from-muted/50 to-muted border-t border-border/50 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:gap-12">
              {/* Main Footer Content */}
              <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                {/* Company Info */}
                <div className="space-y-4">
                  <a 
                    href="https://www.fidelix.app" 
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity group w-fit"
                  >
                    <img 
                      src={imageUrls.logoIcon} 
                      alt="Fidelix mascote" 
                      className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                    />
                    <img 
                      src={imageUrls.logoText} 
                      alt="Fidelix" 
                      className="h-8"
                    />
                  </a>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    A plataforma definitiva para criar cartelas de fidelidade digitais e conquistar clientes.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>🇧🇷 Feito com amor no Brasil</span>
                  </div>
                </div>
                
                {/* Navigation Links */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Navegação</h4>
                  <nav className="flex flex-col gap-3">
                    <button 
                      onClick={() => {
                        const element = document.getElementById('vantagens');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-fit"
                    >
                      Vantagens
                    </button>
                    <button 
                      onClick={() => {
                        const element = document.getElementById('como-funciona');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-muted-foreground hover:text-primary transition-colors text-left w-fit"
                    >
                      Como Funciona
                    </button>
                    <a 
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Blog
                    </a>
                  </nav>
                </div>
                
                {/* Support & Contact */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Suporte</h4>
                  <div className="flex flex-col gap-3">
                    <a 
                      href="https://www.fidelix.app" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Central de Ajuda
                    </a>
                    <a 
                      href="https://www.fidelix.app" 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Contato
                    </a>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        ✨ Grátis para sempre
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Bar */}
              <div className="pt-8 border-t border-border/50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>© 2025 Fidelix. Todos os direitos reservados.</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
                    <a href="#" className="hover:text-primary transition-colors">Termos</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPageNew;