import { FC, ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface ThemeButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ThemeButton: FC<ThemeButtonProps> = ({
  children,
  icon,
  onClick,
  disabled,
  className,
  style,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground",
        "hover:bg-primary/90 transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {icon && icon}
      {children}
    </button>
  );
};
