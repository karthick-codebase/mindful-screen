import React, { createContext, useContext, useState } from 'react';

type ThemeName = 'light' | 'dark';

type Theme = {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  divider: string;
  muted: string;
  disabled: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  // Cyberpunk theme additions
  neon?: string;
  glow?: string;
  cyber?: string;
  shadow?: string;
};

const themes: Record<ThemeName, Theme> = {
  light: {
    background: '#f5f7fa',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#1a202c',
    textSecondary: '#718096',
    primary: '#3182ce',
    secondary: '#718096',
    accent: '#38b2ac',
    border: '#e2e8f0',
    divider: '#edf2f7',
    muted: '#a0aec0',
    disabled: '#edf2f7',
    success: '#38a169',
    warning: '#d69e2e',
    error: '#e53e3e',
    info: '#3182ce',
    neon: '#3182ce',
    glow: '#3182ce',
  },
  dark: {
    background: '#0f1419',
    surface: '#1a202c',
    card: '#2d3748',
    text: '#f7fafc',
    textSecondary: '#a0aec0',
    primary: '#00d9ff',
    secondary: '#805ad5',
    accent: '#ff0080',
    success: '#00ff88',
    warning: '#ffd700',
    error: '#ff4757',
    info: '#00d9ff',
    border: '#4a5568',
    divider: '#2d3748',
    muted: '#718096',
    disabled: '#2d3748',
    neon: '#00ffff',
    glow: '#ff00ff',
    cyber: '#00ff88',
    shadow: 'rgba(0, 212, 255, 0.2)',
  },
};

type ThemeContextValue = {
  themeName: ThemeName;
  tokens: Theme;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>('light');

  const setTheme = (theme: ThemeName) => {
    setThemeName(theme);
  };

  const toggleTheme = () => {
    setThemeName(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextValue = {
    themeName,
    tokens: themes[themeName],
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
