'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../stores/useThemeStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
