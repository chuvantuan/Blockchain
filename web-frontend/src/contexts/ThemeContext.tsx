import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme, isManual?: boolean) => void;
  resetToSystemTheme: () => void;
  isManualOverride: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Always use system preference by default
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [isManualOverride, setIsManualOverride] = useState(false);

  const setTheme = (newTheme: Theme, isManual = true) => {
    setThemeState(newTheme);
    if (isManual) {
      localStorage.setItem('theme', newTheme);
      setIsManualOverride(true);
    } else {
      // If not manual, don't save to localStorage but still apply theme
      setIsManualOverride(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme, true);
  };

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
    }
  }, [theme]);

  // Listen for system theme changes - always follow system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const systemTheme = e.matches ? 'dark' : 'light';
      setThemeState(systemTheme);
    };

    // Set initial theme based on system preference
    const systemTheme = mediaQuery.matches ? 'dark' : 'light';
    setThemeState(systemTheme);

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  // Reset to system theme function
  const resetToSystemTheme = () => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    localStorage.removeItem('theme');
    setIsManualOverride(false);
    setTheme(systemTheme, false);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      setTheme, 
      resetToSystemTheme,
      isManualOverride 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
