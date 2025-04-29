'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';

interface Station {
  id: string;
  location: [number, number];
  name: string;
  organization_id: string;
}

interface MapComponentProps {
  onPointSelect?: (lat: number, lng: number) => void;
  points?: [number, number][];
  isSelectionMode?: boolean;
  stations?: Station[];
}

function ClickHandler({ onPointSelect }: { onPointSelect?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onPointSelect) {
        onPointSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function MapComponent({ onPointSelect, points = [], isSelectionMode = false, stations = [] }: MapComponentProps) {
  const defaultCenter: [number, number] = [35.1416950, 33.9070580]; // Default to first point in sample or fallback
  
  return (
    <MapContainer
      center={points.length > 0 ? points[0] : defaultCenter}
      zoom={15}
    
  scrollWheelZoom={false}
  doubleClickZoom={false}
  touchZoom={false}
  zoomControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {isSelectionMode && <ClickHandler onPointSelect={onPointSelect} />}
      
      {/* Show existing stations */}
      {stations.map((station) => (
        <Marker 
          key={station.id} 
          position={station.location}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-medium">{station.name}</h3>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Show current selection point */}
      {points.map((point, index) => (
        <Marker key={`selection-${point[0]}-${point[1]}-${index}`} position={point} />
      ))}
      
      {points.length >= 2 && (
        <Polyline 
          positions={points}
          color="blue"
          weight={3}
        />
      )}
    </MapContainer>
  );
}
