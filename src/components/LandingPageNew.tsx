import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "./Header";
import CardGallery from "./CardGallery";
import { getFidelixImageUrls } from "@/utils/uploadImages";

const LandingPageNew = () => {
  const imageUrls = getFidelixImageUrls();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero-new pt-24">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-poppins font-bold text-foreground leading-tight">
                  O pulo do gato é{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    fidelizar
                  </span>{" "}
                  seus clientes!
                </h1>
                <p className="text-xl text-muted-foreground font-inter leading-relaxed max-w-lg">
                  Chegou Fidelix. Crie uma cartela de selos digitais para o seu negócio 
                  e começe já a conquistar clientes!
                </p>
              </div>

              <Button variant="hero" size="lg" className="text-lg px-8">
                Crie a sua cartela em 1 minuto
              </Button>
            </div>

            <div className="relative">
              <CardGallery />
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens Section */}
      <section id="vantagens" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-poppins font-bold text-foreground">
              Vantagens do Fidelix
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra como é fácil fidelizar seus clientes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <Card className="border-0 shadow-card hover:shadow-soft transition-all duration-300 group text-center">
              <CardContent className="p-8 space-y-6">
                <div className="w-32 h-32 mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={imageUrls.advantage1} 
                    alt="Fidelize e aumente suas vendas" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-2xl font-poppins font-semibold text-foreground leading-tight">
                  Fidelize e aumente suas vendas já
                </h3>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card hover:shadow-soft transition-all duration-300 group text-center">
              <CardContent className="p-8 space-y-6">
                <div className="w-32 h-32 mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={imageUrls.advantage2} 
                    alt="Fique tranquilo, Fidelix é realmente descomplicado" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-2xl font-poppins font-semibold text-foreground leading-tight">
                  Fique tranquilo, Fidelix é realmente descomplicado
                </h3>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card hover:shadow-soft transition-all duration-300 group text-center">
              <CardContent className="p-8 space-y-6">
                <div className="w-32 h-32 mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={imageUrls.advantage3} 
                    alt="Sem papel. Sem downloads. Controle tudo pela web" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-2xl font-poppins font-semibold text-foreground leading-tight">
                  Sem papel. Sem downloads. Controle tudo pela web
                </h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="como-funciona" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-poppins font-bold text-foreground">
              Como Funciona
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Em 3 passos simples, você está pronto
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="text-xl font-poppins font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
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
                Pronto para dar o pulo do gato?
              </h2>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Junte-se a centenas de negócios que já transformaram 
                sua relação com os clientes usando Fidelix
              </p>
            </div>
            
            <Button variant="accent" size="lg" className="text-lg px-12">
              Criar Minha Primeira Cartela
            </Button>

            <div className="flex justify-center items-center gap-2 text-primary-foreground/60">
              <span>✨ Grátis para sempre ✨</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12" style={{ backgroundColor: '#1F2937' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <img 
                src={imageUrls.logoIcon} 
                alt="Fidelix mascote" 
                className="w-8 h-8 brightness-0 invert"
              />
              <h3 className="text-2xl font-poppins font-bold text-white">Fidelix</h3>
            </div>
            
            <div className="flex items-center gap-2 text-background/70">
              <span>🇧🇷 Feito com amor no Brasil</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageNew;