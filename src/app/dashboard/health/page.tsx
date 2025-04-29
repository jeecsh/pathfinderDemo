'use client';

import { useState } from 'react';
import { ThemeHeader } from '@/components/ui/themed/ThemeHeader';
import { ThemeCard } from '@/components/ui/themed/ThemeCard';
import { ActivityChart } from '@/app/components/dashboard/ActivityChart';
import {
  Server,
  Cpu,
  Database,
  Network,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react';

interface ServiceHealth {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  metrics: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    lastIncident?: string;
  };
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  storage: number;
  network: {
    bandwidth: number;
    latency: number;
  };
  requestsPerMinute: number;
}

const demoServices: ServiceHealth[] = [
  {
    id: '1',
    name: 'API Gateway',
    status: 'operational',
    metrics: {
      uptime: 99.99,
      responseTime: 45,
      errorRate: 0.01,
    }
  },
  {
    id: '2',
    name: 'Authentication Service',
    status: 'operational',
    metrics: {
      uptime: 99.95,
      responseTime: 120,
      errorRate: 0.05,
    }
  },
  {
    id: '3',
    name: 'Database Cluster',
    status: 'degraded',
    metrics: {
      uptime: 99.50,
      responseTime: 250,
      errorRate: 1.2,
      lastIncident: '2025-04-28T15:30:00'
    }
  },
  {
    id: '4',
    name: 'Storage Service',
    status: 'operational',
    metrics: {
      uptime: 99.98,
      responseTime: 85,
      errorRate: 0.03,
    }
  },
  {
    id: '5',
    name: 'Message Queue',
    status: 'outage',
    metrics: {
      uptime: 98.50,
      responseTime: 500,
      errorRate: 5.0,
      lastIncident: '2025-04-29T02:15:00'
    }
  }
];

const systemMetrics: SystemMetrics = {
  cpu: 45,
  memory: 68,
  storage: 72,
  network: {
    bandwidth: 850,
    latency: 15
  },
  requestsPerMinute: 1250
};

const generateTimeSeriesData = (hours: number, baseValue = 50, variance = 30) => {
  const data = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * variance))
    });
  }
  return data;
};

export default function HealthPage() {
  const [services] = useState<ServiceHealth[]>(demoServices);
  const [metrics] = useState<SystemMetrics>(systemMetrics);
  const [cpuData] = useState(() => generateTimeSeriesData(24, metrics.cpu, 20));
  const [requestData] = useState(() => generateTimeSeriesData(24, 60, 40));

  const getStatusColor = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'outage':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    }
  };

  const getMetricColor = (value: number, threshold: number) => {
    if (value <= threshold * 0.6) return 'text-green-500';
    if (value <= threshold * 0.8) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 p-6">
      <ThemeHeader description="Monitor system performance and service health">
        System Health
      </ThemeHeader>

      {/* System Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <ThemeCard>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Cpu className="h-6 w-6 text-blue-700 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">CPU Usage</h3>
              <p className={`text-2xl font-bold ${getMetricColor(metrics.cpu, 80)}`}>
                {metrics.cpu}%
              </p>
            </div>
          </div>
        </ThemeCard>
        <ThemeCard>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Server className="h-6 w-6 text-purple-700 dark:text-purple-300" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Memory Usage</h3>
              <p className={`text-2xl font-bold ${getMetricColor(metrics.memory, 90)}`}>
                {metrics.memory}%
              </p>
            </div>
          </div>
        </ThemeCard>
        <ThemeCard>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <Database className="h-6 w-6 text-orange-700 dark:text-orange-300" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Storage Usage</h3>
              <p className={`text-2xl font-bold ${getMetricColor(metrics.storage, 85)}`}>
                {metrics.storage}%
              </p>
            </div>
          </div>
        </ThemeCard>
        <ThemeCard>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Network className="h-6 w-6 text-green-700 dark:text-green-300" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Network</h3>
              <p className="text-2xl font-bold">
                {metrics.network.bandwidth} <span className="text-sm">Mbps</span>
              </p>
            </div>
          </div>
        </ThemeCard>
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ThemeCard>
          <ActivityChart
            title="CPU Load"
            data={cpuData}
            valueFormatter={(value) => `${Math.round(value)}%`}
          />
        </ThemeCard>
        <ThemeCard>
          <ActivityChart
            title="Requests per Minute"
            data={requestData}
            valueFormatter={(value) => Math.round(value * metrics.requestsPerMinute / 100).toString()}
          />
        </ThemeCard>
      </div>

      {/* Service Health */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ThemeCard
            key={service.id}
            title={service.name}
            icon={service.status === 'operational' ? 
              <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
              <AlertCircle className="h-5 w-5 text-red-500" />
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                  {service.status.toUpperCase()}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Uptime: {service.metrics.uptime}%
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className={`font-medium ${
                    service.metrics.responseTime > 200 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {service.metrics.responseTime} ms
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Error Rate</span>
                  <span className={`font-medium ${
                    service.metrics.errorRate > 1 ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {service.metrics.errorRate}%
                  </span>
                </div>
                {service.metrics.lastIncident && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
                    <Zap className="h-4 w-4" />
                    Last Incident: {new Date(service.metrics.lastIncident).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </ThemeCard>
        ))}
      </div>
    </div>
  );
}
