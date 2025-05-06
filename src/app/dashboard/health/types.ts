export interface Metrics {
  cpu: number;
  temperature: number;
  battery: number;
  memory: number;
  diskUsage: number;
  signalStrength: number;
}

export interface Device {
  id: string;
  name: string;
  model: string;
  deviceType: 'rpi' | 'esp32';
  status: 'online' | 'warning' | 'offline';
  metrics: Metrics;
  vehicleId?: string;
  vehicleInfo?: {
    licensePlate: string;
  };
}
