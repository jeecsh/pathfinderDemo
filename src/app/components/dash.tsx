"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Settings, ChevronDown, Maximize2, MapPin, Car, User, AlertTriangle, Clock } from 'lucide-react';
import { useThemeStore } from '@/app/stores/useThemeStore';

export default function DashboardPreview() {
  const [isInView, setIsInView] = useState(false);
  const [rotation, setRotation] = useState(0);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const chartData = [
    { name: '8 AM', vehicles: 12, personnel: 25 },
    { name: '9 AM', vehicles: 19, personnel: 30 },
    { name: '10 AM', vehicles: 15, personnel: 28 },
    { name: '11 AM', vehicles: 25, personnel: 32 },
    { name: '12 PM', vehicles: 30, personnel: 35 },
    { name: '1 PM', vehicles: 28, personnel: 40 },
    { name: '2 PM', vehicles: 32, personnel: 42 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    
    const element = document.getElementById('dashboard-preview');
    if (element) observer.observe(element);
    
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    
    return () => {
      if (element) observer.unobserve(element);
      clearInterval(interval);
    };
  }, []);

  return (
    <div id="dashboard-preview" className={`w-full py-20 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isInView ? 'animate-fadeIn' : 'opacity-0'}`}
              style={{ animation: isInView ? 'fadeIn 0.8s ease forwards' : 'none' }}>
            Powerful <span className={isDark ? 'text-blue-600' : 'text-blue-600'}>Dashboard</span> for Complete Control
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'} ${isInView ? 'animate-fadeIn delay-200' : 'opacity-0'}`}
              style={{ animation: isInView ? 'fadeIn 0.8s ease 0.2s forwards' : 'none' }}>
            Monitor your entire fleet, track personnel, and gain valuable insights all in one place.
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Dashboard frame */}
          <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-900 shadow-blue-900/20' : 'bg-white shadow-blue-200/50'} shadow-xl 
              ${isInView ? 'animate-slideUp' : 'opacity-0 translate-y-10'}`}
              style={{ 
                transition: 'opacity 1s ease, transform 1s ease',
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(10px)'
              }}>
            
            {/* Dashboard header */}
            <div className={`px-6 py-4 flex justify-between items-center border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}>
                  <MapPin size={18} className="text-white" />
                </div>
                <h3 className="font-semibold text-lg">Pathfinder Dashboard</h3>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-xs ${isDark ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'}`}>
                  All Systems Online
                </div>
                <button className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                  <Settings size={18} />
                </button>
              </div>
            </div>
            
            {/* Dashboard content */}
            <div className="p-6">
              {/* Stats row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: <Car size={20} />, label: "Active Vehicles", value: "24", change: "+3" },
                  { icon: <User size={20} />, label: "Personnel Tracked", value: "42", change: "+7" },
                  { icon: <AlertTriangle size={20} />, label: "Active Alerts", value: "3", change: "-2" },
                  { icon: <Clock size={20} />, label: "Avg. Response Time", value: "4.2m", change: "-0.5" }
                ].map((stat, i) => (
                  <div 
                    key={i}
                    className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'} 
                        ${isInView ? 'animate-fadeIn' : 'opacity-0'}`}
                    style={{ animation: isInView ? `fadeIn 0.5s ease ${0.3 + i * 0.1}s forwards` : 'none' }}  
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
                        <div className="text-2xl font-semibold">{stat.value}</div>
                      </div>
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className={stat.change.startsWith('+') ? 
                        (isDark ? 'text-green-400' : 'text-green-500') : 
                        (isDark ? 'text-red-400' : 'text-red-500')
                      }>
                        {stat.change}
                      </div>
                      <div className={`text-xs ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>from yesterday</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Map and Chart row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Map section */}
                <div className={`col-span-2 rounded-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-50'} p-4
                    ${isInView ? 'animate-fadeIn delay-200' : 'opacity-0'}`}
                    style={{ animation: isInView ? 'fadeIn 0.8s ease 0.2s forwards' : 'none' }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Fleet Map</h4>
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
                        <span>Real-time</span>
                        <ChevronDown size={14} />
                      </div>
                      <button className={`p-1 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                        <Maximize2 size={16} />
                      </button>  
                    </div>
                  </div>
                  
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="/map.webp" 
                      alt="Interactive map showing vehicle locations" 
                      className="w-full h-full object-cover" 
                    />
                    
                    {/* Vehicle markers */}
                    {[
                      { top: '20%', left: '30%' },
                      { top: '40%', left: '70%' },
                      { top: '60%', left: '50%' },
                      { top: '70%', left: '20%' },
                      { top: '35%', left: '40%' }
                    ].map((pos, i) => (
                      <div key={i} 
                          className={`absolute z-10 ${isInView ? 'animate-ping' : ''}`} 
                          style={{ 
                            top: pos.top, 
                            left: pos.left,
                            animation: isInView ? `ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite ${i * 0.2}s` : 'none'
                          }}>
                        <div className={`h-3 w-3 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-600'}`}></div>
                      </div>
                    ))}
                    
                    {/* Route lines */}
                    <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path 
                        d="M30,20 C40,30 60,20 70,40 S50,60 20,70" 
                        fill="none" 
                        stroke={isDark ? "#3b82f6" : "#2563eb"}
                        strokeWidth="0.5"
                        strokeDasharray="1,1"
                        style={{
                          strokeDashoffset: isInView ? -rotation : 0,
                          transition: "stroke-dashoffset 0.1s linear"
                        }}
                      />
                    </svg>
                    
                    {/* Map controls */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <button className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>+</button>
                      <button className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>-</button>
                    </div>
                    
                    {/* Legend */}
                    <div className={`absolute bottom-3 left-3 p-2 rounded-lg ${isDark ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-sm text-xs`}>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-600'}`}></div>
                        <span>Active Vehicles</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Chart section */}
                <div className={`rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'} p-4
                    ${isInView ? 'animate-fadeIn delay-300' : 'opacity-0'}`}
                    style={{ animation: isInView ? 'fadeIn 0.8s ease 0.3s forwards' : 'none' }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Today's Activity</h4>
                    <div className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
                      <span>Last 7 Hours</span>
                      <ChevronDown size={14} />
                    </div>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }} 
                          stroke={isDark ? "#6b7280" : "#9ca3af"}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }} 
                          stroke={isDark ? "#6b7280" : "#9ca3af"}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: isDark ? "#1f2937" : "#ffffff",
                            borderColor: isDark ? "#374151" : "#e5e7eb",
                            color: isDark ? "#f9fafb" : "#111827"
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="vehicles" 
                          stroke={isDark ? "#3b82f6" : "#2563eb"} 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          isAnimationActive={isInView}
                          animationDuration={1500}
                          animationEasing="ease-out"
                          name="Vehicles"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="personnel" 
                          stroke={isDark ? "#a855f7" : "#7c3aed"} 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          isAnimationActive={isInView}
                          animationDuration={1500}
                          animationEasing="ease-out"
                          animationBegin={300}
                          name="Personnel"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {/* Alert row */}
              <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-50'} p-4
                  ${isInView ? 'animate-fadeIn delay-400' : 'opacity-0'}`}
                  style={{ animation: isInView ? 'fadeIn 0.8s ease 0.4s forwards' : 'none' }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Recent Alerts</h4>
                  <button className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    View All
                  </button>
                </div>
                
                <div className="space-y-2">
                  {[
                    { level: "warning", message: "Vehicle #103 low fuel (15%)", time: "5 minutes ago" },
                    { level: "error", message: "Route delay detected on Highway 101", time: "15 minutes ago" },
                    { level: "info", message: "Driver shift change for Vehicle #215", time: "32 minutes ago" }
                  ].map((alert, i) => (
                    <div 
                      key={i}
                      className={`p-3 rounded-lg flex items-center justify-between 
                          ${isDark ? 'bg-gray-700' : 'bg-white'}
                          ${isInView ? 'animate-fadeInRight' : 'opacity-0'}`}
                      style={{ animation: isInView ? `fadeInRight 0.5s ease ${0.5 + i * 0.1}s forwards` : 'none' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${
                          alert.level === 'error' ? 'bg-red-500' : 
                          alert.level === 'warning' ? 'bg-yellow-500' : 
                          'bg-blue-500'}`}>
                        </div>
                        <span>{alert.message}</span>
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {alert.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className={`absolute -z-10 h-64 w-64 rounded-full ${isDark ? 'bg-blue-900' : 'bg-blue-200'} opacity-20 blur-3xl top-1/4 -left-32`}></div>
          <div className={`absolute -z-10 h-64 w-64 rounded-full ${isDark ? 'bg-purple-900' : 'bg-purple-200'} opacity-20 blur-3xl bottom-0 right-0`}></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInRight {
          from { 
            opacity: 0;
            transform: translateX(20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
