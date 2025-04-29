'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useDemoDashboard } from '@/hooks/useDemoDashboard';
import 'leaflet/dist/leaflet.css';
import type { DivIcon } from 'leaflet';

interface VehicleLocation {
  lat: number;
  lng: number;
}

interface Vehicle {
  id: string;
  name: string;
  type: 'car' | 'van' | 'truck';
  location: VehicleLocation;
  status: 'active' | 'idle' | 'offline';
  lastUpdated: string;
}

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export function LiveMap() {
  const { getMockVehicles } = useDemoDashboard();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const iconCache = useRef<{
    car?: DivIcon;
    truck?: DivIcon;
  }>({});

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize icons and load initial vehicles data
  useEffect(() => {
    if (!isClient) return;

    const initIcons = async () => {
      if (typeof window !== 'undefined') {
        const L = await import('leaflet');
        
        // Only create icons if they don't exist yet
        if (!iconCache.current.car) {
          iconCache.current.car = L.default.divIcon({
            html: `<div class="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.7a1 1 0 0 0-.8.4L2.2 11l-5.16.86a1 1 0 0 0-.84.99V16h3m16 0H2m12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>
                    </svg>
                  </div>`,
            className: '',
          });
        }
        
        if (!iconCache.current.truck) {
          iconCache.current.truck = L.default.divIcon({
            html: `<div class="w-8 h-8 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M10 17h4V5H2v12h3m5 0H5m5 0a2 2 0 1 0 4 0m0 0a2 2 0 1 0-4 0m13-5h-3V7h5v5h-2zm2 5h-6m6 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 0 4 0"></path>
                    </svg>
                  </div>`,
            className: '',
          });
        }
      }
      
      // Load initial vehicle data
      setVehicles(getMockVehicles());
      setMapLoaded(true);
    };

    initIcons().catch(console.error);
  }, [isClient, getMockVehicles]);

  // Update vehicle positions periodically
  useEffect(() => {
    if (!isClient || !mapLoaded) return;

    const interval = setInterval(() => {
      setVehicles(getMockVehicles());
    }, 5000);

    return () => clearInterval(interval);
  }, [getMockVehicles, isClient, mapLoaded]);

  if (!isClient) {
    return (
      <div className="h-[400px] rounded-xl overflow-hidden border bg-card flex items-center justify-center">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  // Wait for the map to be ready and icons to be loaded
  if (!mapLoaded || !iconCache.current.car || !iconCache.current.truck) {
    return (
      <div className="h-[400px] rounded-xl overflow-hidden border bg-card flex items-center justify-center">
        <div className="text-muted-foreground">Initializing map...</div>
      </div>
    );
  }

  return (
    <div className="h-[400px] rounded-xl overflow-hidden border bg-card">
      <MapContainer
        center={[35.1856, 33.3823]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        key="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {vehicles.map((vehicle) => (
          <Marker
            key={`marker-${vehicle.id}`}
            position={[vehicle.location.lat, vehicle.location.lng]}
            icon={vehicle.type === 'truck' ? iconCache.current.truck : iconCache.current.car}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-medium">{vehicle.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Status: <span className="capitalize">{vehicle.status}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(vehicle.lastUpdated).toLocaleTimeString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}