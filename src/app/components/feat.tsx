"use client";

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Radar, BarChart3, Bell, Shield, Cpu, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/app/stores/useThemeStore';

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    // Rotate through features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  const features = [
    {
      icon: <Navigation size={24} />,
      title: "Real-time Tracking",
      description: "Monitor your entire fleet with precision GPS tracking for both vehicles and personnel."
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Data Analytics",
      description: "Gain valuable insights from comprehensive reports on routes, delays, and performance metrics."
    },
    {
      icon: <Bell size={24} />,
      title: "Smart Alerts",
      description: "Get instant notifications for arrivals, departures, delays, and any unusual activity."
    },
    {
      icon: <Shield size={24} />,
      title: "Security & Privacy",
      description: "Enterprise-grade security ensures your tracking data remains protected and compliant."
    }
  ];

  const visualizations = [
    // Real-time Tracking
    <div key="tracking" className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-3/4 aspect-video">
        <motion.div 
          className={`absolute h-1 ${isDark ? 'bg-blue-400' : 'bg-blue-600'} top-1/2 left-0 right-0`}
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0 0 0)' }}
          transition={{ duration: 1.5 }}
        />
        
        {[0.2, 0.5, 0.8].map((pos, i) => (
          <motion.div 
            key={i}
            className="absolute top-1/2 transform -translate-y-1/2"
            style={{ left: `${pos * 100}%` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
          >
            <div className={`h-4 w-4 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-600'}`} />
            <div className={`mt-2 px-2 py-1 text-xs font-medium rounded ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              Vehicle {i+1}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div 
        className={`mt-6 text-center ${isDark ? 'text-blue-400' : 'text-blue-600'} font-medium`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Real-time tracking of all vehicles
      </motion.div>
    </div>,
    
    // Data Analytics
    <div key="analytics" className="w-full h-full flex items-center justify-center">
      <div className="w-3/4 h-3/4 bg-opacity-30 rounded-lg relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end h-3/4 px-4 pt-8">
          {[0.7, 0.4, 0.9, 0.5, 0.6].map((height, i) => (
            <motion.div 
              key={i}
              className="w-1/6 mx-1 flex flex-col items-center"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: `${height * 100}%`, opacity: 0.8 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 1 }}
            >
              <div className={`w-full rounded-t ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`} style={{ height: '100%' }} />
              <div className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i]}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div 
          className={`absolute top-2 left-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Weekly Performance
        </motion.div>
      </div>
    </div>,
    
    // Smart Alerts
    <div key="alerts" className="w-full h-full flex flex-col items-center justify-center">
      <motion.div 
        className={`w-16 h-16 rounded-full ${isDark ? 'bg-blue-700' : 'bg-blue-100'} flex items-center justify-center`}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Bell size={32} className={isDark ? 'text-blue-300' : 'text-blue-600'} />
      </motion.div>
      
      <div className="mt-8 space-y-3 w-3/4">
        {[
          { text: "Vehicle #103 has arrived at destination", time: "2 min ago" },
          { text: "Route delay detected on Highway 101", time: "15 min ago" },
          { text: "Low fuel alert for Vehicle #215", time: "32 min ago" }
        ].map((alert, i) => (
          <motion.div 
            key={i}
            className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm flex justify-between items-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <span className="text-sm">{alert.text}</span>
            </div>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{alert.time}</span>
          </motion.div>
        ))}
      </div>
    </div>,
    
    // Security & Privacy
    <div key="security" className="w-full h-full flex items-center justify-center">
      <motion.div 
        className={`w-32 h-32 ${isDark ? 'text-blue-400' : 'text-blue-600'} relative`}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <Shield size={128} className="opacity-70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`h-16 w-16 rounded-full ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
            <Shield size={32} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className={`absolute bottom-8 w-3/4 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="text-center">
          <div className="font-medium mb-2">Data Protection</div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Enterprise-grade encryption and compliance with privacy regulations
          </div>
        </div>
      </motion.div>
    </div>
  ];

  return (
    <div className={`w-full py-20 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Complete Control</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Pathfinder delivers comprehensive tracking solutions with an intuitive interface and powerful tools.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left side: Features list */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className={`p-6 rounded-xl cursor-pointer transition-colors duration-300
                  ${activeFeature === index 
                    ? (isDark ? 'bg-gray-800 shadow-lg shadow-blue-900/10' : 'bg-gray-50 shadow-lg shadow-blue-500/10') 
                    : ''
                  }`}
                onClick={() => setActiveFeature(index)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg transition-colors duration-300 ${
                    activeFeature === index 
                      ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                      : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600')
                  }`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Right side: Visualization */}
          <motion.div 
            className="relative rounded-2xl overflow-hidden aspect-square max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <div className={`absolute inset-0 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`} />
            <div className="absolute inset-0 opacity-60">
              <img src="/mapp.jpg" alt="Map visualization" className="w-full h-full object-cover" />
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                className="absolute inset-0 flex items-center justify-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {visualizations[activeFeature]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Additional feature pills */}
        <motion.div 
          className="mt-16 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            { icon: <Cpu size={16} />, text: "IoT Integration" },
            { icon: <Radar size={16} />, text: "GPS Precision" },
            { icon: <Users size={16} />, text: "Personnel Tracking" },
            { icon: <MapPin size={16} />, text: "Geofencing" }
          ].map((pill, i) => (
            <motion.div 
              key={i}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm 
                ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              {pill.icon}
              <span>{pill.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
