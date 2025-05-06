import { Device } from './types';

export const MOCK_DEVICES: Device[] = [
  {
    id: '1',
    name: 'RPi-001',
    model: 'Raspberry Pi 4B',
    deviceType: 'rpi',
    status: 'online',
    metrics: {
      cpu: 45,
      memory: 60,
      temperature: 52,
      diskUsage: 65,
      battery: 0,
      signalStrength: 0
    },
    vehicleId: 'V001',
    vehicleInfo: {
      licensePlate: 'ABC-123'
    }
  },
  {
    id: '2',
    name: 'RPi-002',
    model: 'Raspberry Pi 4B',
    deviceType: 'rpi',
    status: 'warning',
    metrics: {
      cpu: 85,
      memory: 90,
      temperature: 72,
      diskUsage: 88,
      battery: 0,
      signalStrength: 0
    },
    vehicleId: 'V002',
    vehicleInfo: {
      licensePlate: 'XYZ-789'
    }
  },
  {
    id: '3',
    name: 'ESP-001',
    model: 'ESP32-WROOM',
    deviceType: 'esp32',
    status: 'online',
    metrics: {
      cpu: 0,
      memory: 0,
      temperature: 0,
      diskUsage: 0,
      battery: 85,
      signalStrength: 92
    },
    vehicleId: 'V003',
    vehicleInfo: {
      licensePlate: 'DEF-456'
    }
  },
  {
    id: '4',
    name: 'ESP-002',
    model: 'ESP32-WROOM',
    deviceType: 'esp32',
    status: 'warning',
    metrics: {
      cpu: 0,
      memory: 0,
      temperature: 0,
      diskUsage: 0,
      battery: 15,
      signalStrength: 35
    },
    vehicleId: 'V004',
    vehicleInfo: {
      licensePlate: 'GHI-101'
    }
  },
  {
    id: '5',
    name: 'RPi-003',
    model: 'Raspberry Pi 4B',
    deviceType: 'rpi',
    status: 'offline',
    metrics: {
      cpu: 0,
      memory: 0,
      temperature: 0,
      diskUsage: 0,
      battery: 0,
      signalStrength: 0
    },
    vehicleId: 'V005'
  }
];
