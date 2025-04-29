'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();

  const handleDemo = () => {
    router.push('/onboarding/subscription');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative bg-white dark:bg-black">
      {/* Back arrow */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/"
          className="flex items-center text-muted-foreground hover:text-accent-foreground transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.2),rgba(0,0,0,0))]" />
        <div className="animate-pulse absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-4xl" />
        <div className="animate-pulse absolute -bottom-20 right-1/4 w-96 h-96 bg-cyan-300/10 dark:bg-cyan-300/20 rounded-full blur-4xl" />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md space-y-8 relative backdrop-blur-2xl bg-white/80 dark:bg-black/50 p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl">
        <div className="relative">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-300 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>

          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in Unavailable
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Please try the demo instead.
          </p>
        </div>

        {/* Blurred form */}
        <div className="relative mt-8 space-y-6 pointer-events-none opacity-50 blur-sm select-none">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-gray-900 dark:text-white sm:text-sm"
                  placeholder="you@example.com"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-gray-900 dark:text-white sm:text-sm"
                  placeholder="••••••••"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Disabled Sign In button */}
          <button
            type="button"
            disabled
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-400 py-2 px-4 text-sm font-medium text-white cursor-not-allowed"
          >
            Sign in
          </button>
        </div>

        {/* Try Demo Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleDemo}
            className="w-full flex justify-center rounded-md border border-blue-600 py-2 px-4 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Demo
          </button>
        </div>
      </div>
    </div>
  );
}
