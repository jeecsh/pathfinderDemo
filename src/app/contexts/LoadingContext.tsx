'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useOrgTheme } from '@/hooks/useOrgTheme';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  LoadingSpinner: () => JSX.Element;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const { colorTheme } = useOrgTheme();

  const LoadingSpinner = () => (
    <div className="w-full h-full flex items-center justify-center min-h-[100px]">
      <div 
        className="animate-spin rounded-full h-8 w-8 border-2" 
        style={{ borderColor: `${colorTheme} transparent ${colorTheme} transparent` }}
      />
    </div>
  );

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, LoadingSpinner }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-3" 
            style={{ borderColor: `${colorTheme} transparent ${colorTheme} transparent` }}
          />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
