import { useEffect, useState } from 'react';
import type { Theme } from '@/lib/theme-utils';
import {
  getStoredTheme,
  setStoredTheme,
  getEffectiveTheme,
  applyTheme,
  getSystemTheme,
} from '@/lib/theme-utils';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredTheme();
    if (stored) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const effectiveTheme = getEffectiveTheme(theme);
    applyTheme(effectiveTheme);
  }, [theme, mounted]);

  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const systemTheme = getSystemTheme();
      applyTheme(systemTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
  };

  const toggleTheme = () => {
    const currentEffective = getEffectiveTheme(theme);
    const newTheme = currentEffective === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    effectiveTheme: mounted ? getEffectiveTheme(theme) : 'light',
    mounted,
  };
}
