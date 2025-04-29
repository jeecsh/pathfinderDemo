'use client';

import { useState } from 'react';
import { ThemeHeader } from '@/components/ui/themed/ThemeHeader';
import { ThemeCard } from '@/components/ui/themed/ThemeCard';
import { ThemeButton } from '@/components/ui/themed/ThemeButton';
import { Train, Plus, MapPin, Clock, Users, Route as RouteIcon, Activity } from 'lucide-react';

interface Station {
  id: string;
  name: string;
  type: 'main' | 'secondary' | 'terminal';
  status: 'active' | 'maintenance' | 'inactive';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  capacity: number;
  activeRoutes: number;
  lastActivity: string;
  facilities: string[];
}

// Demo data
const demoStations: Station[] = [
  {
    id: '1',
    name: 'Central Terminal',
    type: 'main',
    status: 'active',
    location: {
      lat: 35.1856,
      lng: 33.3823,
      address: '123 Main Street, Downtown',
    },
    capacity: 500,
    activeRoutes: 8,
    lastActivity: '2025-04-29T08:45:00',
    facilities: ['parking', 'waiting_area', 'ticket_office', 'restrooms', 'cafe'],
  },
  {
    id: '2',
    name: 'Business District Stop',
    type: 'secondary',
    status: 'active',
    location: {
      lat: 35.1757,
      lng: 33.3642,
      address: '45 Commerce Ave, Business District',
    },
    capacity: 150,
    activeRoutes: 4,
    lastActivity: '2025-04-29T08:30:00',
    facilities: ['waiting_area', 'ticket_machine', 'restrooms'],
  },
  {
    id: '3',
    name: 'Tech Park Station',
    type: 'terminal',
    status: 'maintenance',
    location: {
      lat: 35.1654,
      lng: 33.3567,
      address: '78 Innovation Road, Tech Park',
    },
    capacity: 300,
    activeRoutes: 0,
    lastActivity: '2025-04-28T17:15:00',
    facilities: ['parking', 'waiting_area', 'ticket_office', 'restrooms'],
  },
];

export default function StationsPage() {
  const [stations] = useState(demoStations);
  const [showAddStation, setShowAddStation] = useState(false);

  const getStatusColor = (status: Station['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'inactive':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getFacilityLabel = (facility: string) => {
    return facility.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6 p-6">
      <ThemeHeader
        description="Manage stations and transportation hubs"
        action={
          <ThemeButton
            onClick={() => setShowAddStation(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Station
          </ThemeButton>
        }
      >
        Station Management
      </ThemeHeader>

      {/* Station Statistics */}
      <div className="grid gap-6 md:grid-cols-4">
        <ThemeCard>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">Total Stations</h3>
            <p className="text-3xl font-bold mt-2">{stations.length}</p>
          </div>
        </ThemeCard>
        <ThemeCard>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">Active Routes</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">
              {stations.reduce((acc, station) => acc + station.activeRoutes, 0)}
            </p>
          </div>
        </ThemeCard>
        <ThemeCard>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">Total Capacity</h3>
            <p className="text-3xl font-bold mt-2">
              {stations.reduce((acc, station) => acc + station.capacity, 0)}
            </p>
          </div>
        </ThemeCard>
        <ThemeCard>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">Active Stations</h3>
            <p className="text-3xl font-bold mt-2">
              {stations.filter(s => s.status === 'active').length}
            </p>
          </div>
        </ThemeCard>
      </div>

      {/* Stations List */}
      <div className="grid gap-6 md:grid-cols-2">
        {stations.map(station => (
          <ThemeCard
            key={station.id}
            title={station.name}
            description={`Type: ${station.type.charAt(0).toUpperCase() + station.type.slice(1)}`}
            icon={<Train className="h-5 w-5" />}
            action={
              <ThemeButton size="sm" variant="outline">
                View Details
              </ThemeButton>
            }
          >
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(station.status)}`}>
                  {station.status.toUpperCase()}
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  Capacity: {station.capacity}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {station.location.address}
              </div>

              {/* Routes */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RouteIcon className="h-4 w-4" />
                {station.activeRoutes} Active Routes
              </div>

              {/* Last Activity */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                Last Activity: {new Date(station.lastActivity).toLocaleString()}
              </div>

              {/* Facilities */}
              <div className="flex flex-wrap gap-2">
                {station.facilities.map(facility => (
                  <span
                    key={facility}
                    className="px-2 py-0.5 bg-accent/50 rounded text-xs"
                  >
                    {getFacilityLabel(facility)}
                  </span>
                ))}
              </div>
            </div>
          </ThemeCard>
        ))}
      </div>

      {/* Add Station Dialog */}
      {showAddStation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <ThemeCard title="Add New Station">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Station creation functionality is disabled in demo mode.
                </p>
                <ThemeButton
                  className="mt-4"
                  onClick={() => setShowAddStation(false)}
                >
                  Close
                </ThemeButton>
              </div>
            </ThemeCard>
          </div>
        </div>
      )}
    </div>
  );
}
