import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const ModernCardGallery = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
      {/* Elementos decorativos de fidelização */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Estrelas de 5 pontas */}
        <div className="absolute top-8 left-8 lg:top-12 lg:left-12 text-accent-yellow text-2xl lg:text-3xl animate-twinkle opacity-70">
          ⭐
        </div>
        <div className="absolute top-16 right-12 lg:top-20 lg:right-16 text-accent-yellow text-xl lg:text-2xl animate-twinkle opacity-60" style={{ animationDelay: '1s' }}>
          ⭐
        </div>
        <div className="absolute bottom-12 left-16 lg:bottom-16 lg:left-20 text-accent-yellow text-lg lg:text-xl animate-twinkle opacity-50" style={{ animationDelay: '2s' }}>
          ⭐
        </div>
        
        {/* Presentes */}
        <div className="absolute top-20 left-1/4 text-primary text-2xl lg:text-3xl animate-float opacity-60">
          🎁
        </div>
        <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 text-primary text-xl lg:text-2xl animate-float opacity-70" style={{ animationDelay: '1.5s' }}>
          🎁
        </div>
        
        {/* Troféu */}
        <div className="absolute top-1/3 right-1/4 text-accent-yellow text-2xl lg:text-3xl animate-float opacity-80" style={{ animationDelay: '0.5s' }}>
          🏆
        </div>
        
        {/* Coração de fidelidade */}
        <div className="absolute bottom-16 left-1/3 text-red-400 text-xl lg:text-2xl animate-pulse opacity-60">
          💝
        </div>
      </div>

      {/* Cartela principal */}
      <div className="relative z-10">
        <Card
          className={`w-64 h-40 lg:w-80 lg:h-48 cursor-pointer transition-all duration-700 hover:scale-105 shadow-premium hover:shadow-glow ${
            isFlipped ? 'scale-110' : ''
          }`}
          style={{
            transform: `${isFlipped ? 'rotateY(180deg)' : ''} perspective(1000px)`,
            transformStyle: 'preserve-3d'
          }}
          onClick={handleCardClick}
        >
          {/* Frente do cartão */}
          <CardContent 
            className="p-6 lg:p-8 h-full relative overflow-hidden rounded-lg"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-glow to-accent-yellow opacity-95 rounded-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 rounded-lg"></div>
            
            <div className="relative z-10 text-white h-full flex flex-col justify-between">
              <div>
                <h3 className="font-poppins font-bold text-lg lg:text-xl leading-tight">Café Fidelix</h3>
                <p className="text-sm lg:text-base opacity-90 mt-2">10 cafés = 1 grátis</p>
              </div>
              
              <div className="flex justify-between items-end">
                <div className="flex gap-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full ${
                        i < 7 ? 'bg-accent-yellow shadow-glow animate-pulse' : 'bg-white/30'
                      }`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <div className="text-sm lg:text-base opacity-75 font-bold">Fidelix</div>
              </div>
            </div>
          </CardContent>
          
          {/* Verso do cartão */}
          <CardContent 
            className="absolute inset-0 p-6 lg:p-8 h-full bg-gradient-to-br from-primary to-accent-yellow rounded-lg text-white flex items-center justify-center shadow-glow"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-center">
              <div className="text-5xl lg:text-7xl mb-3 lg:mb-4 animate-bounce">📱</div>
              <p className="text-sm lg:text-base font-semibold leading-tight">
                Escaneie o QR Code na loja para ganhar selos!
              </p>
              <div className="mt-4 p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <p className="text-xs lg:text-sm font-medium">Toque para girar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Indicador de interação */}
        <p className="text-muted-foreground text-xs lg:text-sm font-medium text-center mt-4 animate-pulse">
          Clique para girar a cartela
        </p>
      </div>
    </div>
  );
};

export default ModernCardGallery;