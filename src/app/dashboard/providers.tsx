'use client';

import { ReactNode } from 'react';
import { LoadingProvider } from '@/app/contexts/LoadingContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LoadingProvider>
      {children}
    </LoadingProvider>
  );
}
