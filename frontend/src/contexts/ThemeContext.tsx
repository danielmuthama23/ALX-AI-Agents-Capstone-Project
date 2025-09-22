import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Resolve theme based on preference
  const resolveTheme = React.useCallback((): 'light' | 'dark' => {
    if (theme === 'system') {
      return getSystemTheme();
    }
    return theme;
  }, [theme]);

  // Apply theme to document
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    root.style.colorScheme = newTheme;
    
    setResolvedTheme(newTheme);
  };

  // Initialize theme
  useEffect(() => {
    const initialTheme = resolveTheme();
    applyTheme(initialTheme);
  }, [resolveTheme]);

  // Update theme when preference changes
  useEffect(() => {
    const newTheme = resolveTheme();
    applyTheme(newTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, resolveTheme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'system';
      return 'light';
    });
  };

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme: handleSetTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};