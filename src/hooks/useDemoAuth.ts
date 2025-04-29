'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface DemoUser {
  id: string;
  email: string;
  organizationName: string;
  isDemo: boolean;
}

export const useDemoAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  // Initialize state from localStorage on mount
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('demoUser');
      const isDemoModeStr = localStorage.getItem('isDemoMode');
      setDemoUser(userStr ? JSON.parse(userStr) : null);
      setDemoMode(isDemoModeStr === 'true');
    } catch (err) {
      console.error('Error reading from localStorage:', err);
    }
  }, []);

  const registerDemo = useCallback(async (
    organizationName: string,
    email: string,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const demoUser: DemoUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        organizationName,
        isDemo: true
      };

      // Store demo user data
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
      localStorage.setItem('isDemoMode', 'true');
      
      // Update state
      setDemoUser(demoUser);
      setDemoMode(true);

      return { user: demoUser };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDemoUser = useCallback(() => {
    return demoUser;
  }, [demoUser]);

  const isDemoMode = useCallback(() => {
    return demoMode;
  }, [demoMode]);

  const clearDemoData = useCallback(() => {
    try {
      localStorage.removeItem('demoUser');
      localStorage.removeItem('isDemoMode');
      localStorage.removeItem('demoOrgData');
      localStorage.removeItem('demoBillingData');
      localStorage.removeItem('demoUsersList');
      localStorage.removeItem('demoVehiclesList');
      
      // Update state
      setDemoUser(null);
      setDemoMode(false);
      
      router.push('/auth/register');
    } catch (err) {
      console.error('Error clearing demo data:', err);
      setError('Failed to clear demo data');
    }
  }, [router]);

  return {
    registerDemo,
    getDemoUser,
    isDemoMode,
    clearDemoData,
    isLoading,
    error,
  };
};
