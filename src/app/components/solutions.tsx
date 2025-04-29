"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/app/stores/useThemeStore';

const INDUSTRY_SOLUTIONS = [
  {
    id: 'logistics',
    name: 'Logistics & Delivery',
    tagline: 'Track every package in real-time',
    features: [
      'Live driver tracking',
      'Automated delivery proofs',
      'Route optimization AI'
    ],
    icon: '📦', // Replace with actual icon/image
    bg: 'bg-gradient-to-br from-blue-900 to-blue-950'
  },
  {
    id: 'education',
    name: 'Schools & Universities',
    tagline: 'Safe student transportation',
    features: [
      'Bus attendance automation',
      'Parent notification system',
      'Campus access control'
    ],
    icon: '🎓', // Replace with actual icon/image
    bg: 'bg-gradient-to-br from-purple-900 to-purple-950'
  },
  {
    id: 'enterprise',
    name: 'Corporate',
    tagline: 'Smart workforce management',
    features: [
      'Multi-method attendance',
      'Team analytics dashboard',
      'Secure facility access'
    ],
    icon: '🏢', // Replace with actual icon/image
    bg: 'bg-gradient-to-br from-emerald-900 to-emerald-950'
  },
  {
    id: 'transport',
    name: 'Transport Services',
    tagline: 'Fleet management reimagined',
    features: [
      'bus tracking',
      'Geofencing alerts',
      'Maintenance scheduling'
    ],
    icon: '🚍', // Replace with actual icon/image
    bg: 'bg-gradient-to-br from-amber-900 to-amber-950'
  }
];

export default function AnimatedSolutionShowcase() {
  const [currentSolution, setCurrentSolution] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!isHovering) {
      const timer = setTimeout(() => {
        setCurrentSolution((prev) => (prev + 1) % INDUSTRY_SOLUTIONS.length);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSolution, isHovering]);

  return (
    <div className={`w-full py-24 ${isDark ? 'bg-black' : 'bg-gray-50'} ${isDark ? 'text-white' : 'text-gray-900'} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-12 left-0 w-1/3 h-1/3 rounded-full bg-blue-900/20 blur-3xl" />
     
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Industry-Specific Tracking Solutions
          </h2>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Customized technology for your unique operational needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Solution showcase */}
          <div className="relative h-[500px]">
            <AnimatePresence mode="wait">
              {INDUSTRY_SOLUTIONS.map((solution, index) => (
                currentSolution === index && (
                  <motion.div
                    key={solution.id}
                    className={`absolute inset-0 rounded-3xl overflow-hidden ${solution.bg} p-8 flex flex-col justify-between`}
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
                  >
                    <div>
                      <motion.div 
                        className="text-8xl mb-6"
                        initial={{ scale: 0.5, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                      >
                        {solution.icon}
                      </motion.div>
                      <h3 className="text-3xl font-bold mb-2">{solution.name}</h3>
                      <p className="text-xl text-gray-300 mb-6">{solution.tagline}</p>
                    </div>
                    
                    <motion.ul className="space-y-3">
                      {solution.features.map((feature, i) => (
                        <motion.li 
                          key={i}
                          className="flex items-center gap-3 text-lg text-white"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <div className="w-2 h-2 rounded-full bg-white" />
                          {feature}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Solution selector */}
          <div className="space-y-8">
            <div className="space-y-4">
              {INDUSTRY_SOLUTIONS.map((solution, index) => (
                <motion.div
                  key={solution.id}
                  onMouseEnter={() => {
                    setIsHovering(true);
                    setCurrentSolution(index);
                  }}
                  onMouseLeave={() => setIsHovering(false)}
                  className={`p-6 rounded-xl cursor-pointer transition-all ${currentSolution === index ? (isDark ? 'bg-gray-900 border-l-4 border-blue-500' : 'bg-gray-100 border-l-4 border-blue-500') : (isDark ? 'bg-gray-900/50 hover:bg-gray-800/70' : 'bg-gray-50 hover:bg-gray-100/70')}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl ${currentSolution === index ? (isDark ? 'text-blue-400' : 'text-blue-600') : 'text-gray-500'}`}>
                      {solution.icon}
                    </div>
                    <div>
                      <h3 className={`text-xl font-medium ${currentSolution === index ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-400' : 'text-gray-600')}`}>
                        {solution.name}
                      </h3>
                      <p className={`text-sm ${currentSolution === index ? (isDark ? 'text-gray-300' : 'text-gray-700') : 'text-gray-500'}`}>
                        {solution.tagline}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-6"
            >
              <button className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-800 text-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                Get Custom Solution
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
