'use client';
import { useState, useEffect, useMemo, ReactNode } from 'react';
import { ThemeHeader, ThemeCard, ThemeButton } from '@/components/ui/themed';
import { useOrgTheme } from '@/hooks/useOrgTheme';
import { Cpu, Thermometer, Server, Disc, RefreshCw, AlertTriangle, WifiOff, HardDrive, Battery, Signal, Shield, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_DEVICES } from './mockDevices';
import { Device, Metrics } from './types';

interface StatusIndicatorProps {
  status: Device['status'];
  metrics?: Metrics;
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  alert?: boolean;
  suffix?: string;
  className?: string;
  subtext?: string;
}

interface ChartSectionProps {
  title: string;
  data: { time: string; value: number; }[];
  icon: ReactNode;
  small?: boolean;
}

const StatusIndicator = ({ status, metrics }: StatusIndicatorProps) => {
  const { color, pulse, text } = useMemo(() => {
    if (status === 'warning' && metrics) {
      return {
        color: 'bg-yellow-500',
        pulse: 'animate-pulse',
        text: metrics.cpu > 80 ? 'High CPU' : 
              metrics.temperature > 70 ? 'High Temp' : 
              metrics.battery < 30 ? 'Low Battery' : 'Warning'
      };
    }
    return status === 'offline' 
      ? { color: 'bg-red-500', pulse: '', text: 'Offline' } 
      : { color: 'bg-green-500', pulse: 'animate-pulse', text: 'Online' };
  }, [status, metrics]);

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color} ${pulse} dark:opacity-90`}></div>
      <span className="capitalize">{text}</span>
    </div>
  );
};

const MetricCard = ({ title, value, icon, alert = false, suffix = '', className = '', subtext = '' }: MetricCardProps) => {
  const { colorTheme } = useOrgTheme();
  
  return (
    <div className={cn(
      "rounded-lg border border-border p-4 flex items-center justify-between dark:bg-gray-800/50 transition-colors",
      alert 
        ? "bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-800/50" 
        : "hover:border-primary/20 hover:bg-primary/5",
      className
    )}>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={cn(
          "text-2xl font-semibold",
          alert ? "text-red-600 dark:text-red-400" : "text-foreground"
        )}>
          {value}{suffix}
        </p>
        {subtext && (
          <p className={cn(
            "text-xs mt-1", 
            alert ? "text-red-500 dark:text-red-400" : "text-muted-foreground"
          )}>
            {subtext}
          </p>
        )}
      </div>
      <div 
        className={cn(
          "p-2 rounded-full transition-colors",
          alert 
            ? "bg-red-100 dark:bg-red-500/10" 
            : "bg-accent dark:bg-gray-700"
        )}
      >
        {icon}
      </div>
    </div>
  );
};

const generateHistoryData = (hours = 24, baseValue = 30) => {
  return Array.from({ length: hours }, (_, i) => {
    const time = new Date();
    time.setHours(time.getHours() - (hours - i));
    const variation = Math.sin(i / 3) * 15 + Math.random() * 10;
    const value = Math.min(Math.max(baseValue + variation, 5), 95);
    
    return {
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: parseFloat(value.toFixed(1))
    };
  });
};

const ChartSection = ({ title, data, icon, small = false }: ChartSectionProps) => {
  const { getChartColors, isDark } = useOrgTheme();
  const chartColors = getChartColors();
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{title}</h3>
        {icon}
      </div>
      <div className={cn("w-full", small ? "h-48" : "h-64")}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke={chartColors.primary} strokeWidth={2} dot={false} />
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: small ? 10 : 12 }} tickCount={small ? 5 : 6} />
            <YAxis tick={{ fontSize: small ? 10 : 12 }} tickFormatter={v => `${v}${title.includes('Temp') ? '°C' : '%'}`} />
            <Tooltip 
              formatter={v => [`${v}${title.includes('Temp') ? '°C' : '%'}`, title.split(' ')[0]]}
              labelFormatter={label => `Time: ${label}`}
              contentStyle={{
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderRadius: '0.5rem',
                color: isDark ? '#fff' : '#000',
                padding: '0.5rem'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function SystemHealthPage() {
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const { colorTheme, classes, getGradient, getContrastText } = useOrgTheme();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [historyData, setHistoryData] = useState<{
    cpu: { time: string; value: number; }[];
    temp: { time: string; value: number; }[];
    memory: { time: string; value: number; }[];
  }>({
    cpu: [],
    temp: [],
    memory: []
  });

  const deviceCounts = useMemo(() => devices.reduce((acc: { byType?: Record<string, number>; warning?: number; offline?: number; [key: string]: any }, device) => {
    acc.byType = acc.byType || {};
    acc.byType[device.deviceType] = (acc.byType[device.deviceType] || 0) + 1;
    acc[device.status] = (acc[device.status] || 0) + 1;
    return acc;
  }, {}), [devices]);

  useEffect(() => {
    setHistoryData({
      cpu: generateHistoryData(24, 30),
      temp: generateHistoryData(24, 45),
      memory: generateHistoryData(24, 40)
    });
    setSelectedDevice(MOCK_DEVICES.find((d: Device) => d.status === 'online') || null);
    const intervalId = setInterval(refreshData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setDevices(prev => prev.map((device: Device) => ({
        ...device,
        metrics: device.status === 'offline' ? device.metrics : {
          ...device.metrics,
          cpu: Math.min(Math.max((device.metrics?.cpu || 0) + (Math.random() * 10 - 5), 5), 95),
          memory: Math.min(Math.max((device.metrics?.memory || 0) + (Math.random() * 8 - 4), 10), 95),
          temperature: parseFloat(((device.metrics?.temperature || 0) + (Math.random() * 2 - 1)).toFixed(1))
        }
      })));
      setIsRefreshing(false);
    }, 800);
  };

  const handleSelectDevice = (device: Device) => {
    setSelectedDevice(device);
    setHistoryData({
      cpu: generateHistoryData(24, 30),
      temp: generateHistoryData(24, 45),
      memory: generateHistoryData(24, 40)
    });
  };

  const getDeviceStyle = (device: Device) => {
    if (selectedDevice?.id === device.id) {
      return { borderColor: colorTheme };
    }
    return undefined;
  };

  return (
    <div className="space-y-6">
      <ThemeHeader 
        className={classes.gradientText}
        description="Monitor the health and status of your fleet hardware systems"
        action={
          <ThemeButton
            onClick={refreshData}
            icon={<RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />}
            disabled={isRefreshing}
            className={cn(
              "bg-gradient-to-r",
              isRefreshing ? "opacity-70" : "hover:opacity-90"
            )}
            style={{ 
              background: getGradient(),
              color: getContrastText(colorTheme)
            }}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </ThemeButton>
        }
      >
        System Health
      </ThemeHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "RPi Units", count: deviceCounts.byType?.rpi, icon: <Server className="h-5 w-5" /> },
          { title: "ESP32 Units", count: deviceCounts.byType?.esp32, icon: <Activity className="h-5 w-5" /> },
          { title: "Warning Status", count: deviceCounts.warning, icon: <AlertTriangle className="h-5 w-5" /> },
          { title: "Offline Units", count: deviceCounts.offline, icon: <WifiOff className="h-5 w-5" /> }
        ].map((card, i) => (
          <ThemeCard 
            key={i} 
            title={card.title} 
            description={`${card.count || 0} device${card.count !== 1 ? 's' : ''}`}
            icon={card.icon}
            useGradient
            themed
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ThemeCard 
            title="Hardware Systems" 
            description="Select a device to view detailed metrics" 
            icon={<Server className="h-5 w-5" />}
            themed
          >
            <div className="space-y-3 max-h-96 overflow-y-auto px-1">
              {devices.map(device => (
                <div
                  key={device.id}
                  onClick={() => handleSelectDevice(device)}
                  style={getDeviceStyle(device)}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all dark:hover:bg-gray-800/50",
                    selectedDevice?.id === device.id
                      ? "bg-primary/5 dark:bg-primary/10"
                      : "border-border hover:bg-accent",
                    device.status === 'warning' && "border-yellow-300 bg-yellow-50/50 dark:border-yellow-500/50 dark:bg-yellow-500/10",
                    device.status === 'offline' && "border-red-200 bg-red-50/50 opacity-75 dark:border-red-800/50 dark:bg-red-500/10"
                  )}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{device.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{device.model}</p>
                      <div className="flex items-center gap-4 text-sm mt-2">
                        <StatusIndicator status={device.status} metrics={device.metrics} />
                        {device.vehicleInfo && <span className="text-muted-foreground">{device.vehicleInfo.licensePlate}</span>}
                      </div>
                    </div>
                    {device.status !== 'offline' && (
                      <div className="flex items-start gap-3">
                        <div className="text-right">
                          <div className="text-xs font-medium">
                            {device.deviceType === 'rpi' ? `${device.metrics.cpu ?? 0}% CPU` : `${device.metrics.battery ?? 0}% Batt`}
                          </div>
                          <div className="text-xs font-medium">
                            {device.deviceType === 'rpi' ? `${device.metrics.temperature ?? 0}°C` : `${device.metrics.signalStrength ?? 0}% Sig`}
                          </div>
                        </div>
                        {device.deviceType === 'rpi' ? (
                          <Thermometer className={cn("h-5 w-5", device.metrics.temperature > 65 ? "text-red-500" : device.metrics.temperature > 55 ? "text-yellow-500" : "text-green-500")} />
                        ) : (
                          <Battery className={cn("h-5 w-5", device.metrics.battery < 20 ? "text-red-500" : device.metrics.battery < 40 ? "text-yellow-500" : "text-green-500")} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ThemeCard>
        </div>

        <div className="lg:col-span-2">
          {selectedDevice ? (
            <div className="space-y-4">
              <ThemeCard
                title={selectedDevice.name}
                description={`${selectedDevice.model} • ${selectedDevice.deviceType === 'rpi' ? 'Main Unit' : 'Sensor Unit'}`}
                icon={selectedDevice.deviceType === 'rpi' ? <Server className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
                className={cn(
                  selectedDevice.status === 'warning' && "border-yellow-200 bg-yellow-50/10",
                  selectedDevice.status === 'offline' && "border-red-200 bg-red-50/10"
                )}
                themed={selectedDevice.status === 'online'}
              >
                {selectedDevice.status === 'offline' ? (
                  <div className="py-8 text-center">
                    <WifiOff className="h-12 w-12 mx-auto text-red-400 mb-4" />
                    <h3 className="text-lg font-medium text-red-600">Connection Lost</h3>
                    <p className="text-muted-foreground mt-2">
                      This device is currently offline. Last seen on vehicle {selectedDevice.vehicleId}.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {selectedDevice.deviceType === 'rpi' ? (
                        <>
                          <MetricCard title="CPU Usage" value={selectedDevice.metrics.cpu ?? 0} suffix="%" 
                            icon={<Cpu className={cn("h-5 w-5", selectedDevice.metrics.cpu > 80 ? "text-red-500" : selectedDevice.metrics.cpu > 60 ? "text-yellow-500" : "text-blue-500")} />}
                            alert={selectedDevice.metrics.cpu > 80} subtext={selectedDevice.metrics.cpu > 80 ? "Critical: High load" : ""}
                          />
                          <MetricCard title="Memory Usage" value={selectedDevice.metrics.memory ?? 0} suffix="%" 
                            icon={<HardDrive className={cn("h-5 w-5", selectedDevice.metrics.memory > 80 ? "text-red-500" : selectedDevice.metrics.memory > 60 ? "text-yellow-500" : "text-purple-500")} />}
                            alert={selectedDevice.metrics.memory > 80} subtext={selectedDevice.metrics.memory > 80 ? "Warning: Memory pressure" : ""}
                          />
                          <MetricCard title="Temperature" value={selectedDevice.metrics.temperature ?? 0} suffix="°C" 
                            icon={<Thermometer className={cn("h-5 w-5", selectedDevice.metrics.temperature > 70 ? "text-red-500" : selectedDevice.metrics.temperature > 60 ? "text-yellow-500" : "text-emerald-500")} />}
                            alert={selectedDevice.metrics.temperature > 70} subtext={selectedDevice.metrics.temperature > 70 ? "Critical: Overheating" : ""}
                          />
                          <MetricCard title="Disk Usage" value={selectedDevice.metrics.diskUsage ?? 0} suffix="%" 
                            icon={<Disc className={cn("h-5 w-5", selectedDevice.metrics.diskUsage > 85 ? "text-red-500" : selectedDevice.metrics.diskUsage > 70 ? "text-yellow-500" : "text-amber-500")} />}
                            alert={selectedDevice.metrics.diskUsage > 85} subtext={selectedDevice.metrics.diskUsage > 85 ? "Warning: Low space" : ""}
                          />
                        </>
                      ) : (
                        <>
                          <MetricCard title="Battery Level" value={selectedDevice.metrics.battery ?? 0} suffix="%" 
                            icon={<Battery className={cn("h-5 w-5", selectedDevice.metrics.battery < 20 ? "text-red-500" : selectedDevice.metrics.battery < 40 ? "text-yellow-500" : "text-green-500")} />}
                            alert={selectedDevice.metrics.battery < 20} subtext={selectedDevice.metrics.battery < 20 ? "Critical: Low battery" : ""}
                          />
                          <MetricCard title="Signal Strength" value={selectedDevice.metrics.signalStrength ?? 0} suffix="%" 
                            icon={<Signal className={cn("h-5 w-5", selectedDevice.metrics.signalStrength < 40 ? "text-red-500" : selectedDevice.metrics.signalStrength < 60 ? "text-yellow-500" : "text-blue-500")} />}
                            alert={selectedDevice.metrics.signalStrength < 40} subtext={selectedDevice.metrics.signalStrength < 40 ? "Warning: Weak signal" : ""}
                          />
                        </>
                      )}
                    </div>

                    {selectedDevice.deviceType === 'rpi' && (
                      <div className="space-y-4">
                        <ChartSection title="CPU Usage History (24h)" data={historyData.cpu} icon={<Cpu className="h-4 w-4" />} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ChartSection title="Temperature History (24h)" data={historyData.temp} icon={<Thermometer className="h-4 w-4" />} small />
                          <ChartSection title="Memory Usage History (24h)" data={historyData.memory} icon={<HardDrive className="h-4 w-4" />} small />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </ThemeCard>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Server className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Device Selected</h3>
              <p className="text-muted-foreground text-center">
                Select a device from the list to view detailed metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
