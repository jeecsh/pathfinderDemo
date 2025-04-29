'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-gray-100 animate-pulse" />
});

interface Station {
  id: string;
  location: [number, number];
  name: string;
  organization_id: string;
}

interface MapProps {
  onPointSelect?: (lat: number, lng: number) => void;
  points?: [number, number][];
  isSelectionMode?: boolean;
  stations?: Station[];
}

export default function Map({ onPointSelect, points = [], isSelectionMode = false, stations = [] }: MapProps) {
  useEffect(() => {
    // This is needed to fix Leaflet icons in Next.js
    const fixLeafletIcons = async () => {
      const L = (await import('leaflet')).default;
      delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
      });
    };
    fixLeafletIcons();
  }, []);

  return (
    <div className="w-full h-[600px] relative">
      <MapComponent 
        onPointSelect={onPointSelect}
        points={points}
        isSelectionMode={isSelectionMode}
        stations={stations}
      />
    </div>
  );
}
