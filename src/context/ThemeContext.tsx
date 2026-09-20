import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/storage';
import { AppSettings } from '../types';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() =>
    getFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS, {
      theme: 'light',
      notifications: {
        maintenance: true,
        leaves: true,
        announcements: true,
        mess: true,
      },
    })
  );

  const theme = settings.theme || 'light';

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  });

  useEffect(() => {
    const root = document.documentElement;
    let effectiveTheme: 'light' | 'dark' = 'light';

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      effectiveTheme = mediaQuery.matches ? 'dark' : 'light';

      const handleChange = (e: MediaQueryListEvent) => {
        const newEffective = e.matches ? 'dark' : 'light';
        setResolvedTheme(newEffective);
        if (newEffective === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      setResolvedTheme(effectiveTheme);
      if (effectiveTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      effectiveTheme = theme;
      setResolvedTheme(theme);
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    const updated: AppSettings = { ...settings, theme: newTheme };
    setSettings(updated);
    saveToStorage(STORAGE_KEYS.SETTINGS, updated);
  };

  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
