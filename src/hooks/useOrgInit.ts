import { useEffect, useState } from 'react';
import { useOrgStore } from '@/app/stores/useOrgStore';
import { useAuth } from '@/hooks/useAuth';

interface OrgApiResponse {
  error: string;
  name: string;
  logo: string | null;
  theme: string;
}

export function useOrgInit() {
  const { isLoaded, setOrgData } = useOrgStore();
  const { getToken, getUser } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

useEffect(() => {
  async function loadOrgData(retryCount = 0) {
    try {
      const token = getToken();
      const user = getUser();
      
      // Debug token state
      console.log('Token state:', {
        tokenExists: !!token,
        userExists: !!user,
        isLoaded,
        attempt: retryCount + 1
      });

      // If not authenticated, set defaults and return
      if (!user || !token) {
        console.log('No authenticated user, using defaults');
        setOrgData({
          orgName: 'My Organization',
          orgLogo: null,
          colorTheme: '#0891b2'
        });
        setIsInitializing(false);
        return;
      }

      // Only fetch if authenticated and not already loaded
      if (token && !isLoaded) {
        console.log('Loading organization data for authenticated user');

        // Check token format
        if (!token.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)) {
          throw new Error('Invalid token format');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ORG_SERVICE_URL}/organization/details`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Log HTTP status for debugging
        console.log('API Response status:', response.status);
        
        const data = await response.json() as OrgApiResponse;
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch organization data');
        }

        // Validate and transform the response data
        if (!data.name && !data.theme) {
          throw new Error('Invalid organization data format');
        }

        // Parse and set organization data
        setOrgData({
          orgName: data.name || 'My Organization',
          orgLogo: data.logo || null,
          colorTheme: data.theme || '#0891b2'
        });
      }
    } catch (error) {
      console.error('Failed to load organization data:', error);
      
      // Retry logic for specific errors
      if (retryCount < MAX_RETRIES && (
        error instanceof Error && (
          error.message.includes('Invalid token') ||
          error.message.includes('Failed to fetch')
        )
      )) {
        console.log(`Retrying in ${RETRY_DELAY}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return loadOrgData(retryCount + 1);
      }
      
      // If max retries reached or non-retryable error, set defaults
      setOrgData({
        orgName: 'My Organization',
        orgLogo: null,
        colorTheme: '#0891b2'
      });
    } finally {
      setIsInitializing(false);
    }
  }

  loadOrgData(0);
}, [getToken, getUser, isLoaded, setOrgData]);
  return { isLoaded, isInitializing };
}
