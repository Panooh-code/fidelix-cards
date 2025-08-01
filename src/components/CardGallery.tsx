import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

// Mock data dos cartões baseados na seção 6
const cardData = [
  {
    id: 1,
    business: "Café Bem-Te-Vi",
    description: "10 cafés = 1 grátis",
    color: "from-purple-500 to-purple-600",
    stamps: 7,
    totalStamps: 10
  },
  {
    id: 2,
    business: "Pizzaria do João",
    description: "8 pizzas = 1 grátis",
    color: "from-red-500 to-red-600",
    stamps: 3,
    totalStamps: 8
  },
  {
    id: 3,
    business: "Salão Beleza Pura",
    description: "5 cortes = 1 grátis",
    color: "from-pink-500 to-pink-600",
    stamps: 5,
    totalStamps: 5
  },
  {
    id: 4,
    business: "Farmácia Saúde+",
    description: "R$ 200 = R$ 20 desconto",
    color: "from-green-500 to-green-600",
    stamps: 150,
    totalStamps: 200
  },
  {
    id: 5,
    business: "Academia Fitness",
    description: "6 aulas = 1 semana grátis",
    color: "from-blue-500 to-blue-600",
    stamps: 2,
    totalStamps: 6
  }
];

const CardGallery = () => {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const handleCardClick = (cardId: number) => {
    setFlippedCard(flippedCard === cardId ? null : cardId);
  };

  return (
    <div className="flex flex-col items-center gap-4 lg:gap-6">
      {/* Galeria de cartões em leque */}
      <div className="relative w-full max-w-xs sm:max-w-md h-48 sm:h-64 mx-auto overflow-hidden">
        {cardData.map((card, index) => (
          <Card
            key={card.id}
            className={`absolute w-36 h-24 sm:w-48 sm:h-32 cursor-pointer transition-all duration-500 hover:scale-105 shadow-elegant hover:shadow-premium ${
              flippedCard === card.id ? 'z-20 scale-110' : ''
            }`}
            style={{
              left: `${index * (window.innerWidth < 640 ? 12 : 15)}px`,
              top: `${index * (window.innerWidth < 640 ? 6 : 8)}px`,
              transform: `rotate(${(index - 2) * 5}deg) ${flippedCard === card.id ? 'rotateY(180deg)' : ''}`,
              transformStyle: 'preserve-3d',
              zIndex: flippedCard === card.id ? 20 : 5 - index
            }}
            onClick={() => handleCardClick(card.id)}
          >
            <CardContent className="p-3 sm:p-4 h-full relative overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
              {/* Frente do cartão */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} rounded-lg opacity-95`}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-lg"></div>
              <div className="relative z-10 text-white h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-poppins font-bold text-xs sm:text-sm leading-tight">{card.business}</h3>
                  <p className="text-[10px] sm:text-xs opacity-90 mt-1">{card.description}</p>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-[10px] sm:text-xs">
                    {typeof card.stamps === 'number' && card.stamps < 20 ? (
                      <div className="flex gap-0.5 sm:gap-1">
                        {Array.from({ length: card.totalStamps }, (_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                              i < card.stamps ? 'bg-accent-yellow shadow-sm' : 'bg-white/30'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="font-medium">{card.stamps}/{card.totalStamps}</span>
                    )}
                  </div>
                  <div className="text-[10px] sm:text-xs opacity-75 font-medium">Fidelix</div>
                </div>
              </div>
            </CardContent>
            
            {/* Verso do cartão */}
            <CardContent 
              className="absolute inset-0 p-3 sm:p-4 h-full bg-gradient-to-br from-primary to-primary-glow rounded-lg text-white flex items-center justify-center shadow-glow"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-1 sm:mb-2">🐱</div>
                <p className="text-[10px] sm:text-xs font-medium leading-tight">Escaneie o QR Code na loja para ganhar selos!</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Texto instrucional */}
      <p className="text-muted-foreground text-xs sm:text-sm font-medium animate-pulse text-center">
        Clique e gire a cartela
      </p>
    </div>
  );
};

export default CardGallery;