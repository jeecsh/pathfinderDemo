import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ThemeHeaderProps {
  children: ReactNode;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const ThemeHeader: FC<ThemeHeaderProps> = ({
  children,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn("space-y-0.5", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{children}</h2>
        {action && <div>{action}</div>}
      </div>
      {description && (
        <p className="text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
};
