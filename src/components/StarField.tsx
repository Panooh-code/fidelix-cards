import React from 'react';

const StarField = () => {
  // Create 5-point star SVG
  const StarSVG = ({ className }: { className?: string }) => (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0">
        {/* 5-point stars */}
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          >
            <StarSVG 
              className="w-2 h-2 text-primary/15 drop-shadow-sm"
            />
          </div>
        ))}
        
        {/* Floating gentle particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute animate-float-gentle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          >
            <div 
              className="w-1 h-1 bg-primary/8 rounded-full"
              style={{
                transform: `scale(${0.5 + Math.random() * 0.8})`,
                boxShadow: '0 0 4px hsl(var(--primary) / 0.1)',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StarField;