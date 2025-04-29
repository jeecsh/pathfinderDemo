'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { InfoIcon } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const { register, isLoading, error: authError } = useAuth();
  const { registerDemo, isLoading: isDemoLoading } = useDemoAuth();

  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { expiresIn } = await register(
        formData.organizationName,
        formData.email,
        formData.password
      );

      const expirationTime = new Date(Date.now() + expiresIn * 1000);
      console.log('Registration expires at:', expirationTime.toLocaleTimeString());

      router.push('/onboarding/subscription');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative bg-white dark:bg-black">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.15),rgba(0,0,0,0))]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-cyan-300/5 dark:bg-cyan-300/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-blue-600/10 dark:via-blue-600/20 to-transparent top-1/3" />
      </div>

      <div className="w-full max-w-md space-y-6 relative p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl bg-white/70 dark:bg-black/30 overflow-hidden">

        {/* Demo Mode Card */}
        <div className="relative p-4 bg-blue-100/10 dark:bg-blue-900/10 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-start">
            <InfoIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Try Demo Mode</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Experience our fleet tracking solution instantly with demo data.
              </p>
              <button
                onClick={async () => {
                  try {
                    await registerDemo("Demo Organization", "demo@example.com");
                    router.push('/onboarding/subscription');
                  } catch (err) {
                    console.error('Demo registration error:', err);
                  }
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                disabled={isDemoLoading}
              >
                {isDemoLoading ? 'Loading...' : 'Launch Demo'}
              </button>
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-4">
          <div className="flex-grow border-t border-border"></div>
          <span className="text-sm text-muted-foreground">or create an account</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Form Wrapper */}
        <div className="relative">
          {/* The Coming Soon blur overlay for ONLY the form */}
          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-20 rounded-lg flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Coming Soon</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Registration will open soon!</p>
          </div>

          {/* The Form */}
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-300 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Join PathFinders to start tracking your fleet</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="organization-name" className="block text-sm font-medium text-gray-900 dark:text-white">
                  Organization Name
                </label>
                <input
                  id="organization-name"
                  name="organizationName"
                  type="text"
                  required
                  disabled
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-gray-900 dark:text-white sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-gray-900 dark:text-white sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-gray-900 dark:text-white sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled
              className="w-full py-2 bg-blue-400 text-white rounded-md cursor-not-allowed"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
