'use client';

import { useOrgTheme } from '@/hooks/useOrgTheme';
import { ZoomIn, ZoomOut, Crosshair } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onCenter: () => void;
  className?: string;
}

export function MapControls({ onZoomIn, onZoomOut, onCenter, className = '' }: MapControlsProps) {
  const { colorTheme, adjustColor } = useOrgTheme();

  return (
    <div 
      className={`absolute bottom-4 right-4 flex flex-col gap-2 ${className}`}
    >
      <button
        onClick={onZoomIn}
        className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
        style={{ borderColor: adjustColor(colorTheme, 0, 0.1) }}
        aria-label="Zoom in"
      >
        <ZoomIn size={20} style={{ color: colorTheme }} />
      </button>
      <button
        onClick={onZoomOut}
        className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
        style={{ borderColor: adjustColor(colorTheme, 0, 0.1) }}
        aria-label="Zoom out"
      >
        <ZoomOut size={20} style={{ color: colorTheme }} />
      </button>
      <button
        onClick={onCenter}
        className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
        style={{ borderColor: adjustColor(colorTheme, 0, 0.1) }}
        aria-label="Center map"
      >
        <Crosshair size={20} style={{ color: colorTheme }} />
      </button>
    </div>
  );
}
