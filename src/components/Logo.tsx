import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-9 w-auto" }) => {
  const { theme } = useTheme();
  
  const logoSrc = theme === 'dark' 
    ? 'https://i.imgur.com/ZaW7mB9.png' 
    : 'https://i.imgur.com/ieOEeBc.png';
  
  const altText = theme === 'dark' 
    ? 'Logo do Fidelix em fundo escuro' 
    : 'Logo do Fidelix em fundo branco';

  return (
    <img
      className={className}
      src={logoSrc}
      alt={altText}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = 'https://placehold.co/150x40/FFFFFF/1E1B4B?text=Fidelix';
      }}
    />
  );
};

export default Logo;