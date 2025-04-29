'use client';

import { PropsWithChildren } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    timeframe: string;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, change, icon, children }: PropsWithChildren<StatsCardProps>) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <div className="flex items-center gap-1 text-xs mt-1">
          <span className={change.type === 'increase' ? 'text-green-500' : 'text-red-500'}>
            {change.type === 'increase' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
          </span>
          <span className={change.type === 'increase' ? 'text-green-600' : 'text-red-600'}>
            {change.value}%
          </span>
          <span className="text-muted-foreground">from {change.timeframe}</span>
        </div>
      )}
      {children}
    </div>
  );
}
