'use client';

import { useOrgTheme } from '@/hooks/useOrgTheme';
import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

interface ThemeCardProps extends PropsWithChildren {
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'outline';
}

interface CardVariant {
  container: string;
  title: { color: string };
  style?: { [key: string]: string };
}

export function ThemeCard({
  className,
  title,
  description,
  icon,
  action,
  variant = 'default',
  children
}: ThemeCardProps) {
  const { colorTheme, getGradient, textColor, adjustColor } = useOrgTheme();

  const variants: Record<ThemeCardProps['variant'] & string, CardVariant> = {
    default: {
      container: 'bg-card border-border hover:border-border/80',
      title: { color: colorTheme },
      style: {}
    },
    gradient: {
      container: 'border-transparent text-white',
      style: { background: getGradient() },
      title: { color: textColor },
    },
    outline: {
      container: 'bg-card hover:bg-accent/50',
      style: { borderColor: colorTheme },
      title: { color: colorTheme },
    },
  };

  return (
    <div
      className={cn(
        // Base styles
        "relative rounded-xl border transition-all duration-200",
        "hover:shadow-lg",
        // Variant specific styles
        variants[variant].container,
        className
      )}
      style={variants[variant].style}
    >
      {/* Card Header */}
      {(title || icon || action) && (
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: variant === 'gradient' 
                    ? 'rgba(255,255,255,0.1)' 
                    : adjustColor(colorTheme, 0, 0.1),
                  color: variant === 'gradient' ? 'white' : colorTheme
                }}
              >
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 
                  className="text-lg font-semibold"
                  style={variants[variant].title}
                >
                  {title}
                </h3>
              )}
              {description && (
                <p className={cn(
                  "text-sm mt-1",
                  variant === 'gradient' ? 'text-white/80' : 'text-muted-foreground'
                )}>
                  {description}
                </p>
              )}
            </div>
          </div>
          {action && (
            <div className="ml-auto">
              {action}
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="p-6">
        {children}
      </div>

      {/* Hover Effect for Gradient Variant */}
      {variant === 'gradient' && (
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-xl"
          style={{
            background: `linear-gradient(to right, ${adjustColor(colorTheme, -20)}, ${adjustColor(colorTheme, 0)})`
          }}
        />
      )}
    </div>
  );
}
