'use client';

import { useOrgTheme } from '@/hooks/useOrgTheme';
import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

interface ThemeHeaderProps extends PropsWithChildren {
  className?: string;
  description?: string;
  action?: React.ReactNode;
}

export function ThemeHeader({ children, className, description, action }: ThemeHeaderProps) {
  const { colorTheme, getGradient } = useOrgTheme();

  return (
    <div className={cn("relative py-6", className)}>
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10" style={{ background: getGradient() }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
      </div>

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 
            className="text-2xl font-semibold"
            style={{ color: colorTheme }}
          >
            {children}
          </h1>
          {description && (
            <p className="mt-1 text-muted-foreground text-sm">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="mt-4 md:mt-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
