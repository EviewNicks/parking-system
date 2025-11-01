"use client";

import { Moon, Sun } from 'lucide-react';
import { useThemeContext } from '@/components/ThemeProvider';

export default function ThemeToggle() {
  const { effectiveTheme, toggleTheme, mounted } = useThemeContext();

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-slate-700/50 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-300 flex items-center justify-center group"
      aria-label={`Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute inset-0 w-5 h-5 text-yellow-400 transition-all duration-300 ${
            effectiveTheme === 'dark'
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <Moon
          className={`absolute inset-0 w-5 h-5 text-blue-300 transition-all duration-300 ${
            effectiveTheme === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>

      <div className="absolute inset-0 rounded-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300" />
    </button>
  );
}
