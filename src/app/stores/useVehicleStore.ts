import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type VehicleStatus = 'active' | 'maintenance' | 'inactive';
export type VehicleType = 'truck' | 'van' | 'car' | 'bus';

export interface VehicleMaintenance {
  id: string;
  vehicleId: string;
  type: 'scheduled' | 'repair' | 'inspection';
  description: string;
  cost: number;
  startDate: string;
  endDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  notes?: string;
}

export interface VehicleRoute {
  id: string;
  vehicleId: string;
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
  stops: { lat: number; lng: number; order: number }[];
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'in_progress' | 'completed';
}

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  status: VehicleStatus;
  licensePlate: string;
  model: string;
  year: string; // Changed to string to match form inputs
  capacity: number;
  fuelType: string;
  currentLocation?: { lat: number; lng: number };
  assignedDriver?: string;
  lastService?: string;
  nextService?: string;
  mileage: number;
  fuelLevel: number;
  vin: string; // Added to match demo requirements
  trackingDevice: {
    type: 'GPS' | 'IoT';
    serialNumber: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  documents: {
    type: string;
    url: string;
    expiryDate?: string;
  }[];
}

interface VehicleState {
  vehicles: Vehicle[];
  maintenance: VehicleMaintenance[];
  routes: VehicleRoute[];
  selectedVehicle: string | null;

  // Vehicle actions
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, data: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  removeVehicle: (id: string) => void; // Alias for deleteVehicle
  setSelectedVehicle: (id: string | null) => void;

  // Maintenance actions
  addMaintenance: (maintenance: Omit<VehicleMaintenance, 'id'>) => void;
  updateMaintenance: (id: string, data: Partial<VehicleMaintenance>) => void;
  deleteMaintenance: (id: string) => void;

  // Route actions
  addRoute: (route: Omit<VehicleRoute, 'id'>) => void;
  updateRoute: (id: string, data: Partial<VehicleRoute>) => void;
  deleteRoute: (id: string) => void;

  // Queries
  getVehiclesByStatus: (status: VehicleStatus) => Vehicle[];
  getVehiclesByType: (type: VehicleType) => Vehicle[];
  getVehicleMaintenance: (vehicleId: string) => VehicleMaintenance[];
  getVehicleRoutes: (vehicleId: string) => VehicleRoute[];
  getActiveRoutes: () => VehicleRoute[];
  getVehicleStats: () => {
    total: number;
    active: number;
    maintenance: number;
    inactive: number;
    byType: Record<VehicleType, number>;
    totalMileage: number;
    averageFuelLevel: number;
  };

  reset: () => void;
}

const initialState = {
  vehicles: [],
  maintenance: [],
  routes: [],
  selectedVehicle: null,
};

export const useVehicleStore = create<VehicleState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        addVehicle: (vehicleData) => set((state) => ({
          vehicles: [...state.vehicles, {
            ...vehicleData,
            id: Math.random().toString(36).substr(2, 9),
          }],
        })),

        updateVehicle: (id, data) => set((state) => ({
          vehicles: state.vehicles.map(vehicle =>
            vehicle.id === id ? { ...vehicle, ...data } : vehicle
          ),
        })),

        deleteVehicle: (id) => set((state) => ({
          vehicles: state.vehicles.filter(vehicle => vehicle.id !== id),
          maintenance: state.maintenance.filter(m => m.vehicleId !== id),
          routes: state.routes.filter(r => r.vehicleId !== id),
        })),

        removeVehicle: (id) => get().deleteVehicle(id), // Alias for deleteVehicle

        setSelectedVehicle: (id) => set({ selectedVehicle: id }),

        addMaintenance: (maintenanceData) => set((state) => ({
          maintenance: [...state.maintenance, {
            ...maintenanceData,
            id: Math.random().toString(36).substr(2, 9),
          }],
        })),

        updateMaintenance: (id, data) => set((state) => ({
          maintenance: state.maintenance.map(m =>
            m.id === id ? { ...m, ...data } : m
          ),
        })),

        deleteMaintenance: (id) => set((state) => ({
          maintenance: state.maintenance.filter(m => m.id !== id),
        })),

        addRoute: (routeData) => set((state) => ({
          routes: [...state.routes, {
            ...routeData,
            id: Math.random().toString(36).substr(2, 9),
          }],
        })),

        updateRoute: (id, data) => set((state) => ({
          routes: state.routes.map(route =>
            route.id === id ? { ...route, ...data } : route
          ),
        })),

        deleteRoute: (id) => set((state) => ({
          routes: state.routes.filter(route => route.id !== id),
        })),

        getVehiclesByStatus: (status) => {
          return get().vehicles.filter(vehicle => vehicle.status === status);
        },

        getVehiclesByType: (type) => {
          return get().vehicles.filter(vehicle => vehicle.type === type);
        },

        getVehicleMaintenance: (vehicleId) => {
          return get().maintenance.filter(m => m.vehicleId === vehicleId);
        },

        getVehicleRoutes: (vehicleId) => {
          return get().routes.filter(r => r.vehicleId === vehicleId);
        },

        getActiveRoutes: () => {
          return get().routes.filter(r => r.status === 'in_progress');
        },

        getVehicleStats: () => {
          const vehicles = get().vehicles;
          const stats = {
            total: vehicles.length,
            active: 0,
            maintenance: 0,
            inactive: 0,
            byType: {
              truck: 0,
              van: 0,
              car: 0,
              bus: 0,
            },
            totalMileage: 0,
            averageFuelLevel: 0,
          };

          vehicles.forEach(vehicle => {
            // Count by status
            switch (vehicle.status) {
              case 'active': stats.active++; break;
              case 'maintenance': stats.maintenance++; break;
              case 'inactive': stats.inactive++; break;
            }

            // Count by type
            stats.byType[vehicle.type]++;

            // Sum mileage and fuel
            stats.totalMileage += vehicle.mileage;
            stats.averageFuelLevel += vehicle.fuelLevel;
          });

          if (vehicles.length > 0) {
            stats.averageFuelLevel /= vehicles.length;
          }

          return stats;
        },

        reset: () => set(initialState),
      }),
      {
        name: 'vehicle-storage',
      }
    )
  )
);
