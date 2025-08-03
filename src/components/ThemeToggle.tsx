import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <Sun className={`w-4 h-4 transition-colors ${theme === 'light' ? 'text-fidelix-yellow-dark' : 'text-gray-500 dark:text-gray-600'}`} />
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-fidelix-purple focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
          theme === 'dark' 
            ? 'bg-fidelix-purple-dark shadow-md' 
            : 'bg-gray-300 hover:bg-gray-400'
        }`}
        role="switch"
        aria-checked={theme === 'dark'}
      >
        <span className="sr-only">Toggle theme</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm ${
            theme === 'dark' 
              ? 'translate-x-4' 
              : 'translate-x-0'
          }`}
        />
      </button>
      <Moon className={`w-4 h-4 transition-colors ${theme === 'dark' ? 'text-fidelix-lilac-light' : 'text-gray-500'}`} />
    </div>
  );
};

export default ThemeToggle;