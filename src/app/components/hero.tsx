"use client";

import { useState, useEffect } from 'react';
import { MapPin, Car, Activity, Bell } from 'lucide-react';
import { useThemeStore } from '@/app/stores/useThemeStore';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleStartTracking = () => {
    router.push('/auth/register');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`w-full min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} overflow-hidden relative`}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 z-0">
        <div className={`h-full w-full ${isDark ? 'opacity-10' : 'opacity-5'}`} 
            style={{
              backgroundImage: `linear-gradient(${isDark ? '#333' : '#999'} 1px, transparent 1px), 
                               linear-gradient(90deg, ${isDark ? '#333' : '#999'} 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              backgroundPosition: `${scrollY * 0.1}px ${scrollY * 0.1}px`
            }}>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute w-full h-full">
        <div className={`absolute ${isDark ? 'bg-blue-700' : 'bg-blue-500'} opacity-20 rounded-full h-64 w-64`} 
            style={{ 
              top: `${20 + Math.sin(scrollY * 0.01) * 5}%`, 
              left: '10%',
              transform: `scale(${1 + scrollY * 0.0005})`
            }}></div>
        <div className={`absolute ${isDark ? 'bg-purple-700' : 'bg-purple-500'} opacity-20 rounded-full h-80 w-80`} 
            style={{ 
              bottom: `${15 + Math.cos(scrollY * 0.01) * 5}%`, 
              right: '5%',
              transform: `scale(${1 + scrollY * 0.0003})`
            }}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full">
          <div className="w-full lg:w-1/2 space-y-6" 
              style={{ 
                transform: `translateY(${-scrollY * 0.1}px)`,
                opacity: Math.max(1 - scrollY * 0.002, 0.5)
              }}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-700' : 'bg-blue-500'}`}>
                <MapPin size={20} className="text-white" />
              </div>
              <span className={`text-lg font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Pathfinder</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Track Your <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Fleet</span> With Precision
            </h1>
            
            <p className={`text-lg md:text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Powerful, real-time vehicle and personnel tracking with data-driven insights to optimize your operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={handleStartTracking}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 
                  ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white
                  transform hover:scale-105`}>
                Start Tracking
              </button>
              
              <button className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 
                  ${isDark ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'} 
                  transform hover:scale-105`}>
                Watch Demo
              </button>
            </div>
            
            <div className={`flex gap-8 pt-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="flex items-center gap-2">
                <Car size={16} />
                <span>Vehicle Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={16} />
                <span>Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell size={16} />
                <span>Alerts</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center"
              style={{ 
                transform: `translateY(${scrollY * 0.05}px) rotate(${scrollY * 0.02}deg)`,
                opacity: Math.max(1 - scrollY * 0.001, 0.7)
              }}>
            <div className={`relative rounded-xl overflow-hidden shadow-2xl ${isDark ? 'shadow-blue-900/30' : 'shadow-blue-500/20'} w-full max-w-lg`}>
              <div className={`h-8 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} flex items-center px-4`}>
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              <div className={`aspect-video w-full ${isDark ? 'bg-gray-900' : 'bg-white'} p-2`}>
                <div className="w-full h-full relative rounded overflow-hidden bg-blue-900/20">
                  {/* Map visualization */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("/mapp.jpg")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}></div>
                  
                  {/* Moving vehicle icon */}
                  <div className="absolute" style={{
                    top: `${40 + Math.sin(scrollY * 0.05) * 10}%`,
                    left: `${50 + Math.cos(scrollY * 0.03) * 40}%`,
                    transform: 'translate(-50%, -50%)'
                  }}>
                    <div className={`h-4 w-4 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-600'} animate-pulse`}></div>
                  </div>
                  <div className="absolute inset-0 flex items-end justify-end p-4">
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-sm shadow-lg`}>
                      <div className="text-xs font-medium">Fleet Status</div>
                      <div className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>12 Active • 3 Idle</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className={`h-14 w-8 rounded-full ${isDark ? 'border-gray-700' : 'border-gray-300'} border-2 flex justify-center pt-2`}>
            <div className={`h-2 w-2 rounded-full ${isDark ? 'bg-gray-400' : 'bg-gray-600'} animate-bounce`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
