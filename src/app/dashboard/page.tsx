'use client';

import { useOrgStore } from '@/app/stores/useOrgStore';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { useDemoDashboard } from '@/hooks/useDemoDashboard';
import { StatsCard } from '@/app/components/dashboard/StatsCard';
import { LiveMap } from '@/app/components/dashboard/LiveMap';
import { ActivityChart } from '@/app/components/dashboard/ActivityChart';
import { 
  Bus, 
  Users, 
  Route, 
  Clock, 
  TrendingUp, 
  Fuel, 
  AlertTriangle,
  MapPin
} from 'lucide-react';
import { useDemoStore } from '@/app/stores/useDemoStore';
import { useState } from 'react';

// Types
interface ActivityDataPoint {
  time: string;
  value: number;
  trend?: 'up' | 'down';
}

interface PopularStationData {
  name: string;
  passengers: number;
  color: string;
}

interface BusStatusData {
  status: string;
  count: number;
  color: string;
}

interface FuelEfficiencyData {
  busId: string;
  efficiency: number;
}

// Generate mock activity data
const generateActivityData = (hours: number): ActivityDataPoint[] => {
  const data: ActivityDataPoint[] = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.getHours().toString().padStart(2, '0') + ':00',
      value: Math.floor(Math.random() * 50) + 20,
      trend: (Math.random() > 0.5 ? 'up' : 'down') as 'up' | 'down'
    });
  }
  return data;
};

// Generate station popularity data
const generateStationData = (): PopularStationData[] => {
  const stationNames = [
    "Central Terminal", 
    "Downtown Station", 
    "University Hub", 
    "Westside Plaza", 
    "Eastend Transfer",
    "North Point",
    "South Terminal"
  ];
  
  return stationNames.map(name => ({
    name,
    passengers: Math.floor(Math.random() * 2000) + 500,
    color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
  })).sort((a, b) => b.passengers - a.passengers);
};

// Generate bus status data
const generateBusStatusData = (): BusStatusData[] => {
  return [
    { status: "On Schedule", count: 42, color: "#4ade80" },
    { status: "Slight Delay", count: 15, color: "#facc15" },
    { status: "Delayed", count: 7, color: "#f87171" },
    { status: "Out of Service", count: 3, color: "#a1a1aa" }
  ];
};

// Generate fuel efficiency data
const generateFuelEfficiencyData = (): FuelEfficiencyData[] => {
  const busIds = ["B-101", "B-102", "B-103", "B-104", "B-105", "B-106", "B-107", "B-108"];
  return busIds.map(busId => ({
    busId,
    efficiency: Math.random() * 10 + 5 // Random efficiency between 5-15 km/L
  }));
};

// Type guard for stats with specific properties
function hasSpecificStats(stats: any, prop: string): boolean {
  return prop in stats;
}

export default function DashboardPage() {
  const { orgName } = useOrgStore();
  const { isDemoMode } = useDemoAuth();
  const { getMockStats } = useDemoDashboard();
  const demoStore = useDemoStore();
  const [timeRange, setTimeRange] = useState('today');

  const stats = getMockStats();
  const deliveryData = generateActivityData(12);
  const vehicleActivityData = generateActivityData(12);
  const stationData = generateStationData();
  const busStatusData = generateBusStatusData();
  const fuelEfficiencyData = generateFuelEfficiencyData();

  // Calculate totals
  const totalBuses = busStatusData.reduce((sum, item) => sum + item.count, 0);
  const totalPassengers = stationData.reduce((sum, item) => sum + item.passengers, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome to {orgName || 'Fleet Management Dashboard'}
        </h1>
        <div className="flex gap-4 items-center">
          <select 
            className="px-3 py-1 rounded-md border bg-background" 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          {isDemoMode() && (
            <div className="px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
              Demo Mode Active
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Buses"
          value={stats.activeVehicles}
          change={{
            value: 15,
            timeframe: "from yesterday",
            type: "increase"
          }}
          icon={<Bus className="h-4 w-4" />}
        />
        <StatsCard
          title="Completed Routes"
          value={stats.completedRoutes}
          change={{
            value: 8,
            timeframe: "from yesterday",
            type: "increase"
          }}
          icon={<Route className="h-4 w-4" />}
        />
        <StatsCard
          title="On-Time Rate"
          value={`${stats.onTimeDelivery}`}
          change={{
            value: 2,
            timeframe: "from yesterday",
            type: "increase"
          }}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Passengers"
          value={totalPassengers.toLocaleString()}
          change={{
            value: 12,
            timeframe: "from yesterday",
            type: "increase"
          }}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* Map and Bus Status */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="bg-card rounded-lg border shadow-sm h-96">
            <div className="p-4 border-b">
              <h3 className="font-medium">Live Bus Tracking</h3>
            </div>
            <LiveMap />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <h3 className="font-medium mb-4 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Bus Status Overview
            </h3>
            <div className="space-y-4">
              {busStatusData.map((status, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <span>{status.status}</span>
                  </div>
                  <div className="font-medium">
                    {status.count} ({Math.round(status.count / totalBuses * 100)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <h3 className="font-medium mb-4 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Key Metrics
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Distance</span>
                <span className="font-medium">{stats.totalDistance}km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Speed</span>
                <span className="font-medium">32 km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fuel Consumption</span>
                <span className="font-medium">3,450 L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Maintenance Alerts</span>
                <span className="font-medium text-amber-500">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-lg border shadow-sm p-4">
          <h3 className="font-medium mb-4 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Most Popular Stations
          </h3>
          <div className="space-y-3">
            {stationData.slice(0, 5).map((station, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span>{station.name}</span>
                  <span className="font-medium">{station.passengers.toLocaleString()} passengers</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${(station.passengers / stationData[0].passengers) * 100}%`,
                      backgroundColor: station.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-lg border shadow-sm p-4">
          <h3 className="font-medium mb-4 flex items-center">
            <Fuel className="h-4 w-4 mr-2" />
            Fuel Efficiency by Bus
          </h3>
          <div className="space-y-3">
            {fuelEfficiencyData.map((bus, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span>Bus {bus.busId}</span>
                  <span className="font-medium">{bus.efficiency.toFixed(1)} km/L</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-green-500" 
                    style={{ 
                      width: `${(bus.efficiency / 15) * 100}%`,
                      opacity: 0.5 + (bus.efficiency / 30)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ActivityChart
          title="Passenger Flow"
          data={deliveryData}
          valueFormatter={(value) => `${value} passengers`}
        />
        <ActivityChart
          title="Bus Activity"
          data={vehicleActivityData}
          valueFormatter={(value) => `${value} active`}
        />
      </div>
      
      {/* Alert History */}
      <div className="bg-card rounded-lg border shadow-sm p-4">
        <h3 className="font-medium mb-4">Recent Alerts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Bus ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Alert Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm">09:45 AM</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">B-103</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">Maintenance Required</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm"><span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Pending</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm">08:32 AM</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">B-107</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">Significant Delay</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm"><span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Critical</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm">08:15 AM</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">B-105</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">Route Deviation</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Resolved</span></td>
              </tr>
              <tr>
                <td className="px-4 py-3 whitespace-nowrap text-sm">07:50 AM</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">B-102</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">Low Fuel Warning</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Resolved</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}