"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, MapPin, Bell, Users, School, Settings, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';
import { useThemeStore } from '../stores/useThemeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { type ReactNode } from 'react';

export default function BusTrackingShowcase(): ReactNode {
  const [activeTab, setActiveTab] = useState('schedule');
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const features = [
    {
      id: 'schedule',
      title: 'Bus Schedule',
      icon: <Clock size={20} />,
      description: 'Get real-time schedules and alerts when your bus is arriving',
      image: '/time.jpeg'
    },
    {
      id: 'tracking',
      title: 'Live Tracking',
      icon: <MapPin size={20} />,
      description: 'Track your bus in real-time and find routes to your favorite places',
      image: '/mapmobile.jpeg'
    },
    {
      id: 'announcements',
      title: 'Announcements',
      icon: <Bell size={20} />,
      description: 'Stay updated with the latest news from your organization',
      image: '/announcement.jpeg'
    }
  ];

  const additionalFeatures = [
    {
      title: 'Organization Attendance',
      icon: <Users size={24} strokeWidth={1.5} />,
      description: 'Smart attendance tracking for organizations',
      items: [
        'Automated check-in/check-out',
        'Real-time attendance reports',
        'Integration with HR systems'
      ]
    },
    {
      title: 'Child Tracking',
      icon: <School size={24} strokeWidth={1.5} />,
      description: 'Know when your child arrives at or leaves school',
      items: [
        'Real-time bus location updates',
        'School arrival notifications',
        'Safe zone alerts'
      ]
    },
    {
      title: 'Customization',
      icon: <Settings size={24} strokeWidth={1.5} />,
      description: 'Tailor the system to your organization needs',
      items: [
        'Customize bus routes and schedules',
        'Brand the app with your organization identity',
        'Configure user permissions'
      ]
    }
  ];
  
  // Function to cycle through tabs automatically
  const cycleTab = useCallback(() => {
    setActiveTab(currentTab => {
      const currentIndex = features.findIndex(f => f.id === currentTab);
      const nextIndex = (currentIndex + 1) % features.length;
      return features[nextIndex].id;
    });
  }, [features]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    
    // Start auto cycling
    intervalRef.current = setInterval(cycleTab, 5000);
    
    return () => {
      clearTimeout(timer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cycleTab]);
  
  // Pause auto cycling when user interacts
  const handleTabClick = (tabId: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setActiveTab(tabId);
    // Restart auto cycling after 10 seconds of inactivity
    intervalRef.current = setInterval(cycleTab, 5000);
  };

  return (
    <div 
      ref={containerRef}
      className="w-full min-h-screen relative overflow-hidden bg-gray-50 dark:bg-black"
    >
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-20 -left-20 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 50, 200, 0],
          y: [0, 50, 100, 50, 0],
          scale: [1, 1.2, 1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div 
        className="absolute bottom-40 -right-20 w-96 h-96 bg-blue-400/10 dark:bg-blue-400/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, -50, -150, 0],
          y: [0, -70, -120, -50, 0],
          scale: [1, 1.3, 1.1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section - Reduced height and moved up */}
        <motion.div 
          className="section pt-20 pb-8 flex items-start" // Changed from min-h-screen to pt-20 pb-8
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center w-full">
            <motion.h2 
              className="text-4xl md:text-5xl text-gray-900 dark:text-white font-bold mb-4" // Reduced margin bottom
            >
              Track Your Bus{' '}
              <span className="text-blue-600 dark:text-blue-400">
                Anywhere, Anytime
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-white max-w-2xl mx-auto mb-8" // Added margin bottom
            >
              Seamless transportation management for commuters, organizations, and schools
            </motion.p>
          </div>
        </motion.div>

        {/* Features Section - Reduced top margin */}
        <motion.div 
          className="section mb-16" // Reduced margin
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-start"> {/* Changed to align-start */}
            <motion.div 
              className="w-full md:w-1/2 flex justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative w-full md:w-[500px] mx-auto p-8"> {/* Reduced padding */}
                {/* Phone Frame */}
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="rounded-[3rem] overflow-hidden bg-white dark:bg-gray-950 p-4 relative shadow-2xl shadow-blue-500/30 ring-1 ring-gray-200/50 dark:ring-gray-800/50"
                >
                  {/* Side Buttons */}
                  <div className="absolute -right-[2px] w-[3px] h-16 top-32 rounded-l bg-gray-300 dark:bg-gray-800" />
                  <div className="absolute -left-[2px] w-[3px] h-8 top-32 rounded-r bg-gray-300 dark:bg-gray-800" />
                  <div className="absolute -left-[2px] w-[3px] h-8 top-44 rounded-r bg-gray-300 dark:bg-gray-800" />
                  
                  {/* Inner Phone Frame */}
                  <div className="rounded-[2.7rem] overflow-hidden bg-gray-100 dark:bg-black relative ring-1 ring-gray-200 dark:ring-gray-800 outline outline-2 outline-gray-300 dark:outline-gray-800">
                    {/* Status Bar */}
                    <div className="h-10 w-full bg-black flex items-center justify-center">
                      <div className="w-[35%] h-[25px] bg-black absolute top-0 left-1/2 transform -translate-x-1/2 rounded-b-2xl flex items-end justify-center pb-1 gap-2">
                        <div className="w-12 h-1 rounded-full bg-gray-800" />
                        <div className="w-2 h-2 rounded-full bg-gray-800" />
                      </div>
                    </div>

                    <div className="relative h-[700px] overflow-hidden"> {/* Reduced height from 800px */}
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute inset-0"
                      >
                      {isLoading ? (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                      ) : (
                        <div className="relative h-full flex flex-col">
                          <div className="flex-1 relative">
                            <img 
                              src={features.find(f => f.id === activeTab)?.image} 
                              alt={features.find(f => f.id === activeTab)?.title} 
                              className="w-full h-full object-cover"
                            />
                            <div 
                              className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black"
                            />
                          </div>
                          
                          <motion.div 
                            className="absolute bottom-0 left-0 right-0 p-8" // Reduced padding
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="relative backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg">
                              <motion.div 
                                className="flex items-center gap-4 mb-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                <div className="p-3 rounded-xl bg-blue-500 text-white">
                                  {features.find(f => f.id === activeTab)?.icon}
                                </div>
                                <h3 className="text-white text-2xl font-bold tracking-tight">
                                  {features.find(f => f.id === activeTab)?.title}
                                </h3>
                              </motion.div>
                              <motion.p 
                                className="text-white/90 text-base leading-relaxed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                {features.find(f => f.id === activeTab)?.description}
                              </motion.p>
                            </div>
                          </motion.div>
                        </div>
                      )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <div className="w-full md:w-1/2 pt-0 relative">
              {/* Navigation Progress Bar */}
              <div className="h-1 w-full bg-gray-200 dark:bg-gray-800 rounded-full mb-6 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: `${((features.findIndex(f => f.id === activeTab) + 1) / features.length) * 100}%`
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              {/* Automatic Sliding Navigation */}
              <div className="relative overflow-hidden p-2">
                <AnimatePresence mode="wait">
                  {features.map((feature, index) => (
                    <motion.div 
                      key={feature.id}
                      className={`${activeTab === feature.id ? 'block' : 'hidden'}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => handleTabClick(feature.id)}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 cursor-pointer
                                   border-l-4 border-blue-500 shadow-lg hover:shadow-xl
                                   transition-all transform hover:scale-[1.01]"
                      >
                        <div className="flex items-start gap-5">
                          <div className="flex items-center justify-center p-4 rounded-2xl bg-blue-500 text-white">
                            {feature.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {features.map((feature, index) => (
                  <button
                    key={feature.id}
                    onClick={() => handleTabClick(feature.id)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeTab === feature.id 
                        ? 'bg-blue-500 w-8' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-label={`Switch to ${feature.title}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Features Section - Redesigned */}
        <motion.div 
          className="section mt-16 mb-16 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background decorative element */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-500/10 rounded-full blur-2xl" />
          </div>
          
          {/* Section header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-6 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm mb-4"
            >
              Advanced Features
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Everything you need for <span className="text-blue-600 dark:text-blue-400">complete control</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Our platform provides comprehensive transportation management solutions designed for organizations of all sizes
            </motion.p>
          </div>
          
          {/* Features displayed in a modern horizontal layout */}
          <div className="flex flex-col gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.2 }}
                className={`flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="w-full md:w-1/3 flex justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-3xl blur-xl transform -rotate-6" />
                    <div className="relative p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-xl">
                      <div className="w-16 h-16 flex items-center justify-center mb-4 text-white">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-blue-100 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                </div>
                
                <div className="w-full md:w-2/3">
                  <div className="space-y-4">
                    {feature.items.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-white/5 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200 dark:border-gray-700/30"
                      >
                        <div className="text-blue-500 dark:text-blue-400 mt-1">
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 flex justify-start"
                  >
                    <button className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                      Learn more
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
