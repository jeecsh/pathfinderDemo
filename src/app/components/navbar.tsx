'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ThemeToggle } from './theme-toggle';

interface NavStep {
  title: string;
  path: string;
  isComplete?: boolean;
}

export const Navbar = () => {
  const pathname = usePathname();
  const gradientRef = useRef(null);

  useEffect(() => {
    if (!gradientRef.current) return;

    // Logo gradient animation
    gsap.to(gradientRef.current, {
      backgroundPosition: '200% 50%',
      duration: 12,
      repeat: -1,
      ease: "none"
    });
  }, []);

  const authSteps: NavStep[] = [
    { title: 'Register', path: '/auth/register' },
    { title: 'Subscription', path: '/onboarding/subscription' },
    { title: 'Customization', path: '/onboarding/settings' },
    { title: 'Users', path: '/onboarding/users' },
    { title: 'Vehicles', path: '/onboarding/vehicles' },
    { title: 'Finalize', path: '/onboarding/finalize' },
  ];

  const getStepStatus = (path: string) => {
    const currentIndex = authSteps.findIndex(step => step.path === pathname);
    const stepIndex = authSteps.findIndex(step => step.path === path);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <nav className="bg-background fixed w-full top-0 z-50 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div 
                  ref={gradientRef} 
                  className="text-xl sm:text-2xl font-bold"
                  style={{ 
                    backgroundImage: 'linear-gradient(to right, #00b5dd,#155dfc, #0891b2)', 
                    backgroundSize: '200% 100%', 
                    WebkitBackgroundClip: 'text', 
                    backgroundClip: 'text', 
                    color: 'transparent',
                    backgroundPosition: '0% 50%'
                  }}
                >
                  PathFinders
                </div>
              </Link>
            </div>
            <ThemeToggle />
          </div>
          
          {/* Progress Steps - Only visible on larger screens */}
          <div className="hidden sm:flex items-center space-x-4">
            {authSteps.map((step, index) => {
              const status = getStepStatus(step.path);
              
              return (
                <div key={step.path} className="flex items-center">
                  {index > 0 && (
                    <div className={`h-px w-8 mx-2 transition-all duration-300 ${
                      status === 'completed' ? 'bg-gradient-to-r from-blue-600 to-cyan-500' : 'bg-gray-200'
                    }`} />
                  )}
                  <Link
                    href={step.path}
                    className={`flex items-center transition-all duration-300 ${
                      status === 'completed' ? 'text-blue-600' :
                      status === 'current' ? 'text-blue-700 font-semibold' :
                      'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                      status === 'completed' ? 'border-none bg-gradient-to-r from-blue-600 to-cyan-500 text-white' :
                      status === 'current' ? 'border-blue-600 text-blue-600' :
                      'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      {step.title}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;