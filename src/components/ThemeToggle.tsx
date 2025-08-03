import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Sun className={`w-5 h-5 transition-colors ${theme === 'light' ? 'text-fidelix-yellow-dark' : 'text-gray-400 dark:text-gray-500'}`} />
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-fidelix-purple focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
          theme === 'dark' 
            ? 'bg-fidelix-purple border-fidelix-purple-light shadow-lg shadow-fidelix-purple/30' 
            : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
        }`}
        role="switch"
        aria-checked={theme === 'dark'}
      >
        <span className="sr-only">Toggle theme</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full transition duration-200 ease-in-out ${
            theme === 'dark' 
              ? 'translate-x-5 bg-white shadow-lg' 
              : 'translate-x-0 bg-white shadow-md'
          }`}
        />
      </button>
      <Moon className={`w-5 h-5 transition-colors ${theme === 'dark' ? 'text-fidelix-purple-light' : 'text-gray-400'}`} />
    </div>
  );
};

export default ThemeToggle;