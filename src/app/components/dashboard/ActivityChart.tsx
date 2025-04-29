'use client';

import { useOrgTheme } from '@/hooks/useOrgTheme';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area
} from 'recharts';

interface ActivityChartProps {
  title: string;
  data: {
    time: string;
    value: number;
    trend?: 'up' | 'down';
  }[];
  valueFormatter?: (value: number) => string;
}

export function ActivityChart({ 
  title, 
  data, 
  valueFormatter = (value) => value.toString() 
}: ActivityChartProps) {
  const { colorTheme, getChartColors, isDark } = useOrgTheme();
  const colors = getChartColors();

  return (
    <div>
      <h3 className="text-sm font-medium" style={{ color: colorTheme }}>{title}</h3>
      <div className="h-[200px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                {colors.gradient.map((color, index) => (
                  <stop
                    key={index}
                    offset={`${index * 50}%`}
                    stopColor={color}
                    stopOpacity={1}
                  />
                ))}
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              padding={{ left: 10, right: 10 }}
              className="text-muted-foreground"
              stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}
              padding={{ top: 10, bottom: 10 }}
              className="text-muted-foreground"
              stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-card p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Time
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {label}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Value
                          </span>
                          <span className="font-bold" style={{ color: colorTheme }}>
                            {valueFormatter(payload[0].value as number)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors.primary}
              strokeWidth={2}
              fill="url(#colorValue)"
              fillOpacity={0.2}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors.primary}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                style: { fill: colors.primary }
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
