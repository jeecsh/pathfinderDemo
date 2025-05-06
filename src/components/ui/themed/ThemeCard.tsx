import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useOrgTheme } from '@/hooks/useOrgTheme';

interface ThemeCardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
  useGradient?: boolean;
  themed?: boolean;
}

export const ThemeCard: FC<ThemeCardProps> = ({
  title,
  description,
  children,
  icon,
  className,
  useGradient = false,
  themed = false,
}) => {
  const { colorTheme, classes, getGradient } = useOrgTheme();

  return (
    <div 
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow",
        "dark:bg-gray-800/40 dark:border-gray-700",
        "transition-all duration-200",
        useGradient && "bg-gradient-to-br from-primary/5 to-primary/10",
        themed && classes.border,
        className
      )}
      style={themed ? { borderColor: colorTheme } : undefined}
    >
      {(title || description || icon) && (
        <div className="p-6 flex flex-col gap-2">
          {(title || icon) && (
            <div className="flex justify-between items-center">
              {title && (
                <h3 className={cn(
                  "font-semibold",
                  themed && classes.text
                )}>
                  {title}
                </h3>
              )}
              {icon && (
                <div className={cn(
                  themed && "text-primary"
                )}>
                  {icon}
                </div>
              )}
            </div>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children && (
        <div className={cn(
          "p-6",
          (title || description || icon) && "pt-0"
        )}>
          {children}
        </div>
      )}
    </div>
  );
};
