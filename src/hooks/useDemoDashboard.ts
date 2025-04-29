import { useCallback, useState, useEffect } from 'react';
import { useOrgStore } from '@/app/stores/useOrgStore';
import { useVehicleStore } from '@/app/stores/useVehicleStore';
import { useBillingStore } from '@/app/stores/useBillingStore';

interface DemoVehicle {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'offline';
  location: {
    lat: number;
    lng: number;
  };
  lastUpdated: string;
}

interface DemoRoute {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  progress: number;
  startTime: string;
  endTime: string;
}

export const useDemoDashboard = () => {
  const { vehicles } = useVehicleStore();
  const { orgName } = useOrgStore();
  const { countingType } = useBillingStore();
  
  // Generate mock vehicle data based on user's vehicles
  const getMockVehicles = useCallback((): DemoVehicle[] => {
    if (!vehicles || vehicles.length === 0) {
      // Default mock vehicles if none added
      return [
        {
          id: '1',
          name: 'Demo Vehicle 1',
          status: 'active',
          location: { lat: 35.1856, lng: 33.3823 },
          lastUpdated: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Demo Vehicle 2',
          status: 'idle',
          location: { lat: 35.1854, lng: 33.3825 },
          lastUpdated: new Date().toISOString()
        }
      ];
    }

    return vehicles.map((v, index) => ({
      id: v.id || String(index + 1),
      name: v.name || `Vehicle ${index + 1}`,
      status: index % 3 === 0 ? 'active' : index % 3 === 1 ? 'idle' : 'offline',
      location: {
        lat: 35.1856 + (Math.random() - 0.5) * 0.01,
        lng: 33.3823 + (Math.random() - 0.5) * 0.01
      },
      lastUpdated: new Date().toISOString()
    }));
  }, [vehicles]);

  // Generate mock routes
  const getMockRoutes = useCallback((): DemoRoute[] => {
    return [
      {
        id: '1',
        name: 'Morning Delivery Route',
        status: 'completed',
        progress: 100,
        startTime: '08:00 AM',
        endTime: '10:30 AM'
      },
      {
        id: '2',
        name: 'Afternoon Service Route',
        status: 'in-progress',
        progress: 65,
        startTime: '02:00 PM',
        endTime: '05:00 PM'
      },
      {
        id: '3',
        name: 'Evening Delivery Route',
        status: 'scheduled',
        progress: 0,
        startTime: '06:00 PM',
        endTime: '08:30 PM'
      }
    ];
  }, []);

  // Generate stats based on selected options
  const getMockStats = useCallback(() => {
    const baseStats = {
      activeVehicles: vehicles?.length || 2,
      completedRoutes: Math.floor(Math.random() * 10) + 5,
      onTimeDelivery: '95%',
      totalDistance: Math.floor(Math.random() * 1000) + 500
    };

    if (countingType === 'qr_code') {
      return {
        ...baseStats,
        scannedPackages: Math.floor(Math.random() * 100) + 50,
        scanAccuracy: '99.8%'
      };
    }

    if (countingType === 'AI Camera') {
      return {
        ...baseStats,
        detectedObjects: Math.floor(Math.random() * 1000) + 200,
        recognitionAccuracy: '98.5%'
      };
    }

    return baseStats;
  }, [vehicles, countingType]);

  return {
    getMockVehicles,
    getMockRoutes,
    getMockStats
  };
};
