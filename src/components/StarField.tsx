import React from 'react';

const StarField = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0">
        {/* Animated stars */}
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div 
              className="w-1 h-1 bg-primary/20 rounded-full"
              style={{
                transform: `scale(${0.5 + Math.random() * 0.5})`,
                boxShadow: '0 0 6px hsl(var(--primary) / 0.3)',
              }}
            />
          </div>
        ))}
        
        {/* Floating sparkles */}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          >
            <div className="text-primary/10 text-xs">✨</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StarField;