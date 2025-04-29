'use client';

import { useState } from 'react';
import { ThemeHeader } from '@/components/ui/themed/ThemeHeader';
import { ThemeCard } from '@/components/ui/themed/ThemeCard';
import { ThemeButton } from '@/components/ui/themed/ThemeButton';
import { Car, Plus, MapPin, Fuel, Wrench as Tool, Route as RouteIcon, Battery, User } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  type: 'car' | 'van' | 'bus' | 'truck';
  status: 'active' | 'maintenance' | 'inactive';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  driver?: {
    id: string;
    name: string;
    status: 'on_duty' | 'off_duty';
  };
  details: {
    make: string;
    model: string;
    year: string;
    licensePlate: string;
    vin: string;
  };
  metrics: {
    fuelLevel: number;
    mileage: number;
    lastService: string;
    nextService: string;
    engineHealth: number;
  };
  route?: {
    id: string;
    name: string;
    status: 'in_progress' | 'scheduled' | 'completed';
  };
}

const demoVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Transport Van 101',
    type: 'van',
    status: 'active',
    location: {
      lat: 35.1856,
      lng: 33.3823,
      address: 'Central Station, Downtown'
    },
    driver: {
      id: 'd1',
      name: 'John Smith',
      status: 'on_duty'
    },
    details: {
      make: 'Mercedes',
      model: 'Sprinter',
      year: '2024',
      licensePlate: 'XYZ-123',
      vin: '1HGCM82633A123456'
    },
    metrics: {
      fuelLevel: 75,
      mileage: 15000,
      lastService: '2025-03-15',
      nextService: '2025-06-15',
      engineHealth: 92
    },
    route: {
      id: 'r1',
      name: 'Morning Route A',
      status: 'in_progress'
    }
  },
  {
    id: '2',
    name: 'City Bus 202',
    type: 'bus',
    status: 'maintenance',
    location: {
      lat: 35.1757,
      lng: 33.3642,
      address: 'Central Garage'
    },
    details: {
      make: 'Volvo',
      model: 'B8R',
      year: '2023',
      licensePlate: 'ABC-456',
      vin: '2KLMN82633B789012'
    },
    metrics: {
      fuelLevel: 30,
      mileage: 45000,
      lastService: '2025-04-20',
      nextService: '2025-05-20',
      engineHealth: 78
    }
  },
  {
    id: '3',
    name: 'Delivery Truck 303',
    type: 'truck',
    status: 'active',
    location: {
      lat: 35.1654,
      lng: 33.3567,
      address: 'Industrial Zone'
    },
    driver: {
      id: 'd3',
      name: 'Mike Johnson',
      status: 'on_duty'
    },
    details: {
      make: 'MAN',
      model: 'TGX',
      year: '2024',
      licensePlate: 'DEF-789',
      vin: '3PQRS82633C345678'
    },
    metrics: {
      fuelLevel: 85,
      mileage: 25000,
      lastService: '2025-04-01',
      nextService: '2025-07-01',
      engineHealth: 95
    },
    route: {
      id: 'r3',
      name: 'Delivery Route C',
      status: 'scheduled'
    }
  }
];

export default function VehiclesPage() {
  const [vehicles] = useState(demoVehicles);
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'inactive':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-500';
    if (health >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 p-6">
      <ThemeHeader
        description="Manage and monitor your vehicle fleet"
        action={
          <ThemeButton
            onClick={() => setShowAddVehicle(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Vehicle
          </ThemeButton>
        }
      >
        Vehicle Management
      </ThemeHeader>

      {/* Fleet Statistics */}
      <div className="grid gap-6 md:grid-cols-4">
        <ThemeCard>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">Total Vehicles</h3>
            <p className="text-3xl font-bold mt-2">{vehicles.length}</p>
          </div>
        </ThemeCard>
        <ThemeCard>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">Active</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">
              {vehicles.filter(v => v.status === 'active').length}
            </p>
          </div>
        </ThemeCard>
        <ThemeCard>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">In Maintenance</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">
              {vehicles.filter(v => v.status === 'maintenance').length}
            </p>
          </div>
        </ThemeCard>
        <ThemeCard>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold">Average Health</h3>
            <p className="text-3xl font-bold mt-2">
              {Math.round(vehicles.reduce((acc, v) => acc + v.metrics.engineHealth, 0) / vehicles.length)}%
            </p>
          </div>
        </ThemeCard>
      </div>

      {/* Vehicles List */}
      <div className="grid gap-6 md:grid-cols-2">
        {vehicles.map(vehicle => (
          <ThemeCard
            key={vehicle.id}
            title={vehicle.name}
            description={`${vehicle.details.make} ${vehicle.details.model} (${vehicle.details.year})`}
            icon={<Car className="h-5 w-5" />}
            action={
              <ThemeButton size="sm" variant="outline">
                View Details
              </ThemeButton>
            }
          >
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status.toUpperCase()}
                </span>
                <span className="text-xs text-muted-foreground">
                  {vehicle.details.licensePlate}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {vehicle.location.address}
              </div>

              {/* Driver Info */}
              {vehicle.driver && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {vehicle.driver.name} ({vehicle.driver.status === 'on_duty' ? 'On Duty' : 'Off Duty'})
                </div>
              )}

              {/* Route Info */}
              {vehicle.route && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RouteIcon className="h-4 w-4" />
                  {vehicle.route.name} - {vehicle.route.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Fuel:</span>
                    <span className="font-medium">{vehicle.metrics.fuelLevel}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Tool className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Next Service:</span>
                    <span className="font-medium">
                      {new Date(vehicle.metrics.nextService).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Battery className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Health:</span>
                    <span className={`font-medium ${getHealthColor(vehicle.metrics.engineHealth)}`}>
                      {vehicle.metrics.engineHealth}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <RouteIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Mileage:</span>
                    <span className="font-medium">{vehicle.metrics.mileage.toLocaleString()} km</span>
                  </div>
                </div>
              </div>
            </div>
          </ThemeCard>
        ))}
      </div>

      {/* Add Vehicle Dialog */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <ThemeCard title="Add New Vehicle">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Vehicle creation functionality is disabled in demo mode.
                </p>
                <ThemeButton
                  className="mt-4"
                  onClick={() => setShowAddVehicle(false)}
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
