'use client';

import { useEffect, useState } from 'react';
import { useOrgTheme } from '@/hooks/useOrgTheme';
import { useDeviceType } from '@/hooks/useDeviceType';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapControls } from './MapControls';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const vehicles = [
  { id: 1, lat: 35.1856, lng: 33.3823, name: "Bus 101" },
  { id: 2, lat: 35.1754, lng: 33.3642, name: "Bus 102" },
  { id: 3, lat: 35.1682, lng: 33.3778, name: "Bus 103" },
];

// Center of Nicosia, Cyprus
const defaultCenter = { lat: 35.1856, lng: 33.3823 };

function MapController() {
  const map = useMap();
  const { isMobile } = useDeviceType();
  
  const handleZoomIn = () => {
    map.setZoom(map.getZoom() + 1);
  };

  const handleZoomOut = () => {
    map.setZoom(map.getZoom() - 1);
  };

  const handleCenter = () => {
    map.setView([defaultCenter.lat, defaultCenter.lng], isMobile ? 12 : 13);
  };

  return (
    <MapControls
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onCenter={handleCenter}
    />
  );
}

const fixLeafletIcons = () => {
  // @ts-ignore - Leaflet's types are not complete
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  });
};

export function LiveMap() {
  const { colorTheme } = useOrgTheme();
  const { isMobile } = useDeviceType();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    fixLeafletIcons();
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-accent/10 rounded-lg">
        <div 
          className="animate-spin rounded-full h-8 w-8 border-2" 
          style={{ borderColor: `${colorTheme} transparent ${colorTheme} transparent` }}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden">
      <MapContainer 
        center={[defaultCenter.lat, defaultCenter.lng]} 
        zoom={isMobile ? 12 : 13} 
        scrollWheelZoom={!isMobile}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        // Mobile-friendly options
        touchZoom={true}
        dragging={true}
        zoomControl={false}
        attributionControl={false}
        minZoom={10}
        maxZoom={18}
        doubleClickZoom={!isMobile}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.lat, vehicle.lng]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-medium" style={{ color: colorTheme }}>{vehicle.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Lat: {vehicle.lat.toFixed(4)}<br />
                  Lng: {vehicle.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapController />
      </MapContainer>
    </div>
  );
}
