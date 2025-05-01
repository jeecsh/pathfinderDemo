"use client";

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ThemeToggle } from './theme-toggle';

interface LandingPageNavbarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export const LandingPageNavbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }: LandingPageNavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  const handleSignIn = () => {
    router.push('/auth/signin');
  }
  
  const handleTrackNow = () => {
    router.push('/auth/register');
  };

  const handleLogoClick = () => {
    router.push('/');
  };
  
  // Add scroll to section function
  const scrollToSection = (sectionId: string) => {
    // Remove the # if it's included
    const id = sectionId.startsWith('#') ? sectionId.substring(1) : sectionId;
    
    const element = document.getElementById(id);
    if (element) {
      // Close mobile menu if open
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      
      // Scroll to the element
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  
  const menuItems = [
    { title: 'Home', path: '#hero' },
    { title: 'Features', path: '#features' },
    { title: 'Solutions', path: '#solutions' },
    { title: 'Pricing', path: '#pricing' }
  ];
  
  const gradientRef = useRef(null);
  const dotRef = useRef(null);
  const trail1Ref = useRef(null);
  const trail2Ref = useRef(null);
  const trail3Ref = useRef(null);

  useEffect(() => {
    if (!gradientRef.current || !dotRef.current) return;
    if (!trail1Ref.current || !trail2Ref.current || !trail3Ref.current) return;

    // Logo gradient animation
    gsap.to(gradientRef.current, {
      backgroundPosition: '200% 50%',
      duration: 12,
      repeat: -1,
      ease: "none"
    });

    // Main dot animation
    const mainDotTimeline = gsap.timeline({ repeat: -1 });
    mainDotTimeline
      .to(dotRef.current, { x: 10, y: -10, duration: 1, ease: "sine.inOut" })
      .to(dotRef.current, { x: 20, y: 0, duration: 1, ease: "sine.inOut" })
      .to(dotRef.current, { x: 10, y: 10, duration: 1, ease: "sine.inOut" })
      .to(dotRef.current, { x: 0, y: 0, duration: 1, ease: "sine.inOut" })
      .to(dotRef.current, { x: -10, y: -10, duration: 1, ease: "sine.inOut" })
      .to(dotRef.current, { x: -20, y: 0, duration: 1, ease: "sine.inOut" })
      .to(dotRef.current, { x: -10, y: 10, duration: 1, ease: "sine.inOut" })
      .to(dotRef.current, { x: 0, y: 0, duration: 1, ease: "sine.inOut" });
    
    // Trail 1 animation (slightly delayed)
    const trail1Timeline = gsap.timeline({ repeat: -1, delay: 0.15 });
    trail1Timeline
      .to(trail1Ref.current, { x: 10, y: -10, duration: 1, ease: "sine.inOut" })
      .to(trail1Ref.current, { x: 20, y: 0, duration: 1, ease: "sine.inOut" })
      .to(trail1Ref.current, { x: 10, y: 10, duration: 1, ease: "sine.inOut" })
      .to(trail1Ref.current, { x: 0, y: 0, duration: 1, ease: "sine.inOut" })
      .to(trail1Ref.current, { x: -10, y: -10, duration: 1, ease: "sine.inOut" })
      .to(trail1Ref.current, { x: -20, y: 0, duration: 1, ease: "sine.inOut" })
      .to(trail1Ref.current, { x: -10, y: 10, duration: 1, ease: "sine.inOut" })
      .to(trail1Ref.current, { x: 0, y: 0, duration: 1, ease: "sine.inOut" });
    
    // Trail 2 animation (more delayed)
    const trail2Timeline = gsap.timeline({ repeat: -1, delay: 0.3 });
    trail2Timeline
      .to(trail2Ref.current, { x: 10, y: -10, duration: 1, ease: "sine.inOut" })
      .to(trail2Ref.current, { x: 20, y: 0, duration: 1, ease: "sine.inOut" })
      .to(trail2Ref.current, { x: 10, y: 10, duration: 1, ease: "sine.inOut" })
      .to(trail2Ref.current, { x: 0, y: 0, duration: 1, ease: "sine.inOut" })
      .to(trail2Ref.current, { x: -10, y: -10, duration: 1, ease: "sine.inOut" })
      .to(trail2Ref.current, { x: -20, y: 0, duration: 1, ease: "sine.inOut" })
      .to(trail2Ref.current, { x: -10, y: 10, duration: 1, ease: "sine.inOut" })
      .to(trail2Ref.current, { x: 0, y: 0, duration: 1, ease: "sine.inOut" });
    
    // Trail 3 animation (most delayed)
    const trail3Timeline = gsap.timeline({ repeat: -1, delay: 0.45 });
    trail3Timeline
      .to(trail3Ref.current, { x: 10, y: -10, duration: 1, ease: "sine.inOut" })
      .to(trail3Ref.current, { x: 20, y: 0, duration: 1, ease: "sine.inOut" })
      .to(trail3Ref.current, { x: 10, y: 10, duration: 1, ease: "sine.inOut" })
      .to(trail3Ref.current, { x: 0, y: 0, duration: 1, ease: "sine.inOut" })
      .to(trail3Ref.current, { x: -10, y: -10, duration: 1, ease: "sine.inOut" })
      .to(trail3Ref.current, { x: -20, y: 0, duration: 1, ease: "sine.inOut" })
      .to(trail3Ref.current, { x: -10, y: 10, duration: 1, ease: "sine.inOut" })
      .to(trail3Ref.current, { x: 0, y: 0, duration: 1, ease: "sine.inOut" });

    // Clean up animations when component unmounts
    return () => {
      gsap.killTweensOf(gradientRef.current);
      gsap.killTweensOf(dotRef.current);
      gsap.killTweensOf(trail1Ref.current);
      gsap.killTweensOf(trail2Ref.current);
      gsap.killTweensOf(trail3Ref.current);
    };
  }, []);

  return (
    <nav className="bg-background fixed w-full top-0 z-50 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center space-x-2 relative cursor-pointer"
            onClick={handleLogoClick}
          >
            {/* Animation container for the logo */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Trail elements */}
              <div 
                ref={trail3Ref} 
                className="absolute w-2 h-2 bg-blue-300 rounded-full opacity-30"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
              <div 
                ref={trail2Ref} 
                className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-40"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
              <div 
                ref={trail1Ref} 
                className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-60"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
              
              {/* Main dot */}
              <div 
                ref={dotRef} 
                className="absolute w-3 h-3 bg-blue-600 rounded-full"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
            </div>
            
            {/* Logo text */}
            <div 
              ref={gradientRef} 
              className="text-xl sm:text-2xl font-bold pl-2 relative"
              style={{ backgroundImage: 'linear-gradient(to right, #00b5dd,#155dfc, #0891b2)', backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', backgroundPosition: '0% 50%' }}
            >
              Pathfinder
            </div>
          </div>
          
          {/* Desktop menu - only show on home page */}
          {isHomePage && (
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <button 
                  key={item.path}
                  onClick={() => scrollToSection(item.path)}
                  className="text-muted-foreground hover:text-accent-foreground transition-colors font-medium text-sm"
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
          
          {/* Theme toggle and CTA buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={handleSignIn} 
              className="px-4 py-2 text-muted-foreground hover:text-accent-foreground font-medium text-sm"
            >
              Sign In
            </button>
            <button 
              onClick={handleTrackNow}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-md hover:opacity-90 transition-all shadow-md text-sm font-medium"
            >
              Track Now
            </button>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu - only show on home page when open */}
      {isHomePage && (
        <div className={`md:hidden bg-background border-t border-border ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-4 py-2 space-y-1">
            {menuItems.map((item) => (
              <button 
                key={item.path} 
                onClick={() => scrollToSection(item.path)}
                className="block w-full text-left px-3 py-2 text-muted-foreground hover:text-accent-foreground transition-colors font-medium text-sm"
              >
                {item.title}
              </button>
            ))}
            <div className="border-t border-border pt-2 space-y-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-muted-foreground font-medium text-sm">Theme</span>
                <ThemeToggle />
              </div>
              <button 
                onClick={handleSignIn}
                className="block w-full text-left px-3 py-2 text-muted-foreground hover:text-accent-foreground font-medium text-sm"
              >
                Sign In
              </button>
              <button 
                onClick={handleTrackNow}
                className="block w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-md hover:opacity-90 transition-all text-sm font-medium"
              >
                Track Now
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};