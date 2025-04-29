'use client';

import { useState } from 'react';
import { ThemeHeader } from '@/components/ui/themed/ThemeHeader';
import { ThemeCard } from '@/components/ui/themed/ThemeCard';
import { ThemeButton } from '@/components/ui/themed/ThemeButton';
import { Route, Plus, MapPin, Clock, Users, Car, ArrowRight } from 'lucide-react';

interface RouteStop {
  id: string;
  name: string;
  time: string;
  location: { lat: number; lng: number };
}

interface TransportRoute {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'completed';
  vehicle: string;
  driver: string;
  startTime: string;
  endTime: string;
  stops: RouteStop[];
  passengers: number;
}

// Demo data
const demoRoutes: TransportRoute[] = [
  {
    id: '1',
    name: 'Morning Shuttle A',
    status: 'active',
    vehicle: 'Bus 101',
    driver: 'John Doe',
    startTime: '2025-04-29T07:00:00',
    endTime: '2025-04-29T09:00:00',
    stops: [
      { id: '1', name: 'Central Station', time: '07:00', location: { lat: 35.1856, lng: 33.3823 } },
      { id: '2', name: 'Business District', time: '07:30', location: { lat: 35.1757, lng: 33.3642 } },
      { id: '3', name: 'Tech Park', time: '08:00', location: { lat: 35.1654, lng: 33.3567 } },
    ],
    passengers: 24,
  },
  {
    id: '2',
    name: 'Evening Express',
    status: 'inactive',
    vehicle: 'Van 205',
    driver: 'Sarah Wilson',
    startTime: '2025-04-29T17:00:00',
    endTime: '2025-04-29T19:00:00',
    stops: [
      { id: '4', name: 'Tech Park', time: '17:00', location: { lat: 35.1654, lng: 33.3567 } },
      { id: '5', name: 'Shopping Mall', time: '17:45', location: { lat: 35.1834, lng: 33.3821 } },
      { id: '6', name: 'Residential Area', time: '18:30', location: { lat: 35.1923, lng: 33.3867 } },
    ],
    passengers: 12,
  },
];

export default function RoutesPage() {
  const [routes] = useState(demoRoutes);
  const [showAddRoute, setShowAddRoute] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <ThemeHeader
        description="Manage and monitor transportation routes"
        action={
          <ThemeButton
            onClick={() => setShowAddRoute(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Route
          </ThemeButton>
        }
      >
        Route Management
      </ThemeHeader>

      {/* Route Statistics */}
      <div className="grid gap-6 md:grid-cols-4">
        <ThemeCard>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">Active Routes</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">
              {routes.filter(r => r.status === 'active').length}
            </p>
          </div>
        </ThemeCard>
        <ThemeCard>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">Total Stops</h3>
            <p className="text-3xl font-bold mt-2">
              {routes.reduce((acc, route) => acc + route.stops.length, 0)}
            </p>
          </div>
        </ThemeCard>
        <ThemeCard>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">Total Passengers</h3>
            <p className="text-3xl font-bold mt-2">
              {routes.reduce((acc, route) => acc + route.passengers, 0)}
            </p>
          </div>
        </ThemeCard>
        <ThemeCard>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">Vehicles in Use</h3>
            <p className="text-3xl font-bold mt-2">
              {new Set(routes.map(r => r.vehicle)).size}
            </p>
          </div>
        </ThemeCard>
      </div>

      {/* Routes List */}
      <div className="grid gap-6 md:grid-cols-2">
        {routes.map(route => (
          <ThemeCard
            key={route.id}
            title={route.name}
            description={`Driver: ${route.driver}`}
            icon={<Route className="h-5 w-5" />}
            action={
              <ThemeButton size="sm" variant="outline">
                View Details
              </ThemeButton>
            }
          >
            <div className="space-y-4">
              {/* Route Status */}
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  route.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : route.status === 'completed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {route.status.toUpperCase()}
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  {route.passengers} passengers
                </span>
              </div>

              {/* Vehicle Info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Car className="h-4 w-4" />
                {route.vehicle}
              </div>

              {/* Time Info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {new Date(route.startTime).toLocaleTimeString()} - {new Date(route.endTime).toLocaleTimeString()}
              </div>

              {/* Stops */}
              <div className="space-y-2">
                {route.stops.map((stop, index) => (
                  <div key={stop.id} className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm flex-1">{stop.name}</span>
                    <span className="text-sm text-muted-foreground">{stop.time}</span>
                    {index < route.stops.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ThemeCard>
        ))}
      </div>

      {/* Add Route Dialog */}
      {showAddRoute && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <ThemeCard title="Add New Route">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Route creation functionality is disabled in demo mode.
                </p>
                <ThemeButton
                  className="mt-4"
                  onClick={() => setShowAddRoute(false)}
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
