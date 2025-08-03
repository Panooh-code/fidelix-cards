import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Card {
  name: string;
  front: string;
  back: string;
}

interface InteractiveCardProps {
  card: Card;
  isIdle: boolean;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({ card, isIdle }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const wasDragged = useRef(false);

  useEffect(() => {
    let flipTimeout: NodeJS.Timeout, resetTimeout: NodeJS.Timeout;
    if (isIdle && cardRef.current) {
      const randomDelay = Math.random() * 1000;
      flipTimeout = setTimeout(() => {
        if (!cardRef.current) return;
        setIsFlipped(true);
        resetTimeout = setTimeout(() => setIsFlipped(false), 2000);
      }, randomDelay);
    }
    return () => {
      clearTimeout(flipTimeout);
      clearTimeout(resetTimeout);
    };
  }, [isIdle]);

  const handleInteractionMove = (clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    wasDragged.current = true;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) / 8;
    const y = (clientY - top - height / 2) / 8;
    const flipRotation = isFlipped ? 180 : 0;
    cardRef.current.style.transform = `rotateY(${x + flipRotation}deg) rotateX(${-y}deg)`;
  };

  const handleMouseMove = (e: React.MouseEvent) => handleInteractionMove(e.clientX, e.clientY);
  const handleTouchMove = (e: React.TouchEvent) => 
    e.touches.length > 0 && handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY);

  const handleInteractionEnd = () => {
    if (!cardRef.current) return;
    const flipRotation = isFlipped ? 180 : 0;
    cardRef.current.style.transform = `rotateY(${flipRotation}deg) rotateX(0deg)`;
    setTimeout(() => (wasDragged.current = false), 50);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (wasDragged.current) {
      e.preventDefault();
      return;
    }
    setIsFlipped(prev => !prev);
  };

  useEffect(() => {
    if (cardRef.current && !wasDragged.current) {
      const flipRotation = isFlipped ? 180 : 0;
      cardRef.current.style.transform = `rotateY(${flipRotation}deg) rotateX(0deg)`;
    }
  }, [isFlipped]);

  return (
    <li
      className="perspective-1000 w-[280px] h-[280px] cursor-grab transition-transform duration-300 hover:scale-105 active:cursor-grabbing"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleInteractionEnd}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleInteractionEnd}
      onClick={handleCardClick}
      onMouseDown={() => wasDragged.current = false}
    >
      <div className="card-inner relative w-full h-full transition-transform duration-[600ms] transform-style-preserve-3d rounded-3xl" ref={cardRef}>
        <img
          src={card.front}
          alt={`Frente do cartão de fidelidade ${card.name}`}
          className="absolute w-full h-full backface-hidden rounded-3xl object-cover overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-white/10"
        />
        <img
          src={card.back}
          alt={`Verso do cartão de fidelidade ${card.name}`}
          className="absolute w-full h-full backface-hidden rounded-3xl object-cover overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-white/10 rotate-y-180"
        />
      </div>
    </li>
  );
};

const InteractiveCardGallery: React.FC = () => {
  const navigate = useNavigate();
  const cards: Card[] = [
    { name: 'Pink Kat', front: 'https://i.imgur.com/rUEfVC6.png', back: 'https://i.imgur.com/WxtJWMd.png' },
    { name: 'Kappa Sushi', front: 'https://i.imgur.com/f9XSaMX.png', back: 'https://i.imgur.com/9iVsVuV.png' },
    { name: 'Barber Surf', front: 'https://i.imgur.com/d0p1J2a.png', back: 'https://i.imgur.com/rVtONjA.png' },
    { name: 'Café da Cida', front: 'https://i.imgur.com/nXqLLg2.png', back: 'https://i.imgur.com/5Sqza5E.png' },
    { name: 'Dr. Green', front: 'https://i.imgur.com/oTHMFJ6.png', back: 'https://i.imgur.com/DpbiXJH.png' },
    { name: 'Recicla Brasil', front: 'https://i.imgur.com/1edmvrH.png', back: 'https://i.imgur.com/WM9RRHV.png' },
    { name: 'Summer Peace', front: 'https://i.imgur.com/7ueUwNf.png', back: 'https://i.imgur.com/G7xnXhT.png' },
  ];

  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const resetIdleTimer = () => {
    setIsIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), 3000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollerRef.current) return;
    isDown.current = true;
    scrollerRef.current.dataset.dragging = 'true';
    startX.current = e.pageX - scrollerRef.current.offsetLeft;
    scrollLeft.current = scrollerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (scrollerRef.current) scrollerRef.current.dataset.dragging = 'false';
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (scrollerRef.current) scrollerRef.current.dataset.dragging = 'false';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-fidelix-gray-light dark:bg-fidelix-purple-darkest">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-fidelix-purple/10 to-white dark:from-fidelix-purple-darkest dark:via-fidelix-purple/20 dark:to-fidelix-purple-darkest"></div>
        <div className="absolute inset-0 blur-3xl opacity-50 dark:opacity-70" style={{
          background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.6) 0%, rgba(124, 58, 237, 0) 60%)'
        }}></div>
      </div>
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-poppins font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Cada card, uma história
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Construa comunidades de clientes fiéis!
            </p>
          </div>
        </div>
        <div
          ref={scrollerRef}
          className="mt-16 w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] hover:[&_.animate-infinite-scroll]:animate-none [&[data-dragging=true]_.animate-infinite-scroll]:animate-none"
          onMouseEnter={resetIdleTimer}
          onTouchStart={resetIdleTimer}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-infinite-scroll">
            {cards.map((card, index) => (
              <InteractiveCard card={card} key={index} isIdle={isIdle && Math.random() > 0.5} />
            ))}
          </ul>
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-infinite-scroll" aria-hidden="true">
            {cards.map((card, index) => (
              <InteractiveCard card={card} key={index + cards.length} isIdle={isIdle && Math.random() > 0.5} />
            ))}
          </ul>
        </div>
        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('/wizard')}
            className="rounded-xl px-6 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-fidelix-purple to-fidelix-purple-dark hover:from-fidelix-purple-dark hover:to-fidelix-purple hover:scale-105"
          >
            Faça o seu card agora
          </button>
          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            Gratuito 💚 para sempre!
          </p>
        </div>
      </div>
    </section>
  );
};

export default InteractiveCardGallery;