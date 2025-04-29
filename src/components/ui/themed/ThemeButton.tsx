'use client';

import { useOrgTheme } from '@/hooks/useOrgTheme';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ThemeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const ThemeButton = forwardRef<HTMLButtonElement, ThemeButtonProps>(({
  className,
  variant = 'default',
  size = 'md',
  isLoading = false,
  icon,
  children,
  disabled,
  ...props
}, ref) => {
  const { colorTheme, getGradient, getHoverGradient, textColor, adjustColor } = useOrgTheme();

  const styles = {
    default: {
      background: getGradient(),
      color: textColor,
      hover: {
        background: getHoverGradient(),
      },
    },
    outline: {
      border: `2px solid ${colorTheme}`,
      color: colorTheme,
      hover: {
        background: adjustColor(colorTheme, 0, 0.1),
      },
    },
    ghost: {
      color: colorTheme,
      hover: {
        background: adjustColor(colorTheme, 0, 0.1),
      },
    },
    link: {
      color: colorTheme,
      hover: {
        textDecoration: 'underline',
      },
    },
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      ref={ref}
      className={cn(
        // Base styles
        "relative inline-flex items-center justify-center font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        // Border radius based on size
        size === 'sm' ? 'rounded' : 'rounded-md',
        // Size styles
        sizes[size],
        // Custom className
        className
      )}
      style={{
        ...styles[variant],
        ...(disabled && { opacity: 0.5, cursor: 'not-allowed' }),
      }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
      
      {/* Hover effect overlay */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-md"
        style={styles[variant].hover}
      />
    </button>
  );
});

ThemeButton.displayName = 'ThemeButton';
