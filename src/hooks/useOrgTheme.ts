'use client';

import { useOrgStore } from '@/app/stores/useOrgStore';
import { useTheme } from 'next-themes';

export function useOrgTheme() {
  const { colorTheme } = useOrgStore();
  const { theme } = useTheme();

  const getGradient = (opacity = 1) => {
    return `linear-gradient(to right, ${colorTheme}, ${adjustColor(colorTheme, 20, opacity)})`;
  };

  const getHoverGradient = () => {
    return `linear-gradient(to right, ${adjustColor(colorTheme, -10)}, ${adjustColor(colorTheme, 10)})`;
  };

  const adjustColor = (color: string, amount: number, opacity = 1) => {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getChartColors = () => {
    return {
      primary: colorTheme,
      secondary: adjustColor(colorTheme, 20),
      gradient: [
        adjustColor(colorTheme, 0, 0.2),
        adjustColor(colorTheme, 0, 0.1),
        adjustColor(colorTheme, 0, 0)
      ]
    };
  };

  const getContrastText = (bgColor: string) => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  return {
    colorTheme,
    isDark: theme === 'dark',
    getGradient,
    getHoverGradient,
    adjustColor,
    getChartColors,
    getContrastText,
    textColor: getContrastText(colorTheme),
    // Common CSS classes
    classes: {
      gradientText: `bg-clip-text text-transparent bg-gradient-to-r from-[${colorTheme}] to-[${adjustColor(colorTheme, 20)}]`,
      gradientBg: `bg-gradient-to-r from-[${colorTheme}] to-[${adjustColor(colorTheme, 20)}]`,
      border: `border-[${colorTheme}]`,
      text: `text-[${colorTheme}]`,
      ring: `ring-[${colorTheme}]`,
    }
  };
}
