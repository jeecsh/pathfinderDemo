import { useCallback, useState, useEffect } from 'react';
import { authApi } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

interface AuthError extends Error {
  code?: string;
}

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (
    organizationName: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { tempToken, expiresIn } = await authApi.register({
        organizationName,
        adminEmail: email,
        adminPassword: password,
      });

      // Store temporary registration data
      localStorage.setItem('tempToken', tempToken);
      localStorage.setItem('tempTokenExpiry', (Date.now() + expiresIn * 1000).toString());
      localStorage.setItem('pendingEmail', email);

      return { tempToken, expiresIn };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(email, password, rememberMe);

      // Validate response contains required data
      if (!response.token || !response.user) {
        throw new Error('Invalid login response format');
      }

      // Validate token format
      if (!response.token.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)) {
        throw new Error('Invalid token format');
      }

      // Store auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Verify storage was successful
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!storedToken || !storedUser) {
        throw new Error('Failed to store authentication data');
      }

      // Debug log to verify storage (remove in production)
      console.log('Auth data stored successfully:', {
        token: !!storedToken,
        user: !!storedUser
      });
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      return response;
    } catch (err: unknown) {
      const error = err as AuthError;
      const errorMessage = error.message || 'Login failed';
      if (error.code) {
        switch (error.code) {
          case 'INVALID_EMAIL':
            setError('Please enter a valid email address');
            break;
          case 'INVALID_PASSWORD':
            setError('Invalid password');
            break;
          case 'USER_NOT_FOUND':
            setError('Account not found');
            break;
          case 'USER_INACTIVE':
            setError('Account is inactive');
            break;
          default:
            setError(errorMessage);
        }
      } else {
        setError(errorMessage);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
      router.push('/auth/login');
    }
  }, [router]);

  const getUser = useCallback(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem('token');
  }, []);

  const completeRegistration = useCallback(async (onboardingData: import('@/lib/api/auth').OnboardingData) => {
    setIsLoading(true);
    setError(null);

    try {
      const tempToken = localStorage.getItem('tempToken');
      if (!tempToken) {
        throw new Error('No temporary token found');
      }

      const response = await authApi.completeRegistration(tempToken, onboardingData);

      // Clear temporary registration data
      localStorage.removeItem('tempToken');
      localStorage.removeItem('tempTokenExpiry');
      localStorage.removeItem('pendingEmail');

      // Store final auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete registration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isPendingRegistration = useCallback(() => {
    const tempToken = localStorage.getItem('tempToken');
    const expiry = localStorage.getItem('tempTokenExpiry');

    if (tempToken && expiry) {
      // Check if token is still valid
      return Date.now() < parseInt(expiry);
    }
    return false;
  }, []);

  // Check for expired temporary registration
  useEffect(() => {
    if (isPendingRegistration()) {
      const expiry = parseInt(localStorage.getItem('tempTokenExpiry') || '0');
      if (Date.now() >= expiry) {
        // Clean up expired registration data
        localStorage.removeItem('tempToken');
        localStorage.removeItem('tempTokenExpiry');
        localStorage.removeItem('pendingEmail');
      }
    }
  }, [isPendingRegistration]);

  return {
    register,
    completeRegistration,
    login,
    logout,
    getUser,
    getToken,
    isPendingRegistration,
    isLoading,
    error,
  };
};
