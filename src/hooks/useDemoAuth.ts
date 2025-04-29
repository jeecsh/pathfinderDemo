import { useCallback, useState } from 'react';
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

      return { user: demoUser };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDemoUser = useCallback(() => {
    const userStr = localStorage.getItem('demoUser');
    return userStr ? JSON.parse(userStr) : null;
  }, []);

  const isDemoMode = useCallback(() => {
    return localStorage.getItem('isDemoMode') === 'true';
  }, []);

  const clearDemoData = useCallback(() => {
    localStorage.removeItem('demoUser');
    localStorage.removeItem('isDemoMode');
    localStorage.removeItem('demoOrgData');
    localStorage.removeItem('demoBillingData');
    localStorage.removeItem('demoUsersList');
    localStorage.removeItem('demoVehiclesList');
    router.push('/auth/register');
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
