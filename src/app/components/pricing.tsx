"use client";

import { useState, useEffect } from 'react';
import { 
  Check, 
  MapPin, 
  ArrowRight, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  BarChart3,
  Package,
  Zap
} from 'lucide-react';
import { useThemeStore } from '@/app/stores/useThemeStore';

export default function PricingCTA() {
  const [isInView, setIsInView] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(1);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  // Sample hardware selection state
  const [selectedHardware, setSelectedHardware] = useState("");
  const [hardwareQuantity, setHardwareQuantity] = useState(1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('pricing-cta');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  // Hardware options - simplified for example
  const hardwareOptions = [
    {
      id: "basic-tracker",
      name: "Basic GPS Tracker",
      price: 29.99,
      description: "Essential GPS tracking device"
    },
    {
      id: "advanced-tracker",
      name: "Advanced Tracker",
      price: 79.99,
      description: "Premium GPS with extended battery"
    },
    {
      id: "fleet-pack",
      name: "Fleet Pack (5 devices)",
      price: 299.99,
      description: "Bundle for small fleets"
    }
  ];

  // Monthly software plans
  const softwarePlans = [
    {
      id: "basic",
      name: "Basic",
      price: 29.99,
      features: [
        "Real-time tracking",
        "5 vehicles included",
        "Email alerts",
        "Basic reporting"
      ]
    },
    {
      id: "professional",
      name: "Professional",
      price: 59.99,
      features: [
        "Advanced tracking",
        "25 vehicles included",
        "SMS & email alerts",
        "Advanced analytics",
        "Mobile app access"
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited vehicles",
        "Custom alerts",
        "API access",
        "Dedicated support",
        "White-label options"
      ]
    }
  ];

  // Calculate one-time hardware cost
  const getHardwareCost = () => {
    if (!selectedHardware) return 0;
    const hardware = hardwareOptions.find(h => h.id === selectedHardware);
    return hardware ? hardware.price * hardwareQuantity : 0;
  };

  // Get current selected software plan price
  const getSoftwarePrice = () => {
    const plan = softwarePlans[selectedPlan];
    return typeof plan.price === 'number' ? plan.price : 0;
  };

  return (
    <div id="pricing-cta" className={`w-full py-20 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} overflow-hidden`}>
      <div className="container mx-auto px-4">
        {/* Pricing section */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isInView ? 'animate-fadeIn' : 'opacity-0'}`}
              style={{ animation: isInView ? 'fadeIn 0.8s ease forwards' : 'none' }}>
            Simple, <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Transparent</span> Pricing
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'} ${isInView ? 'animate-fadeIn delay-200' : 'opacity-0'}`}
              style={{ animation: isInView ? 'fadeIn 0.8s ease 0.2s forwards' : 'none' }}>
            Pay once for hardware and a low monthly fee for our powerful software.
          </p>
        </div>
        
        {/* Hardware selection */}
        <div className={`mb-16 ${isInView ? 'animate-fadeIn delay-300' : 'opacity-0'}`}
            style={{ animation: isInView ? 'fadeIn 0.8s ease 0.3s forwards' : 'none' }}>
          <h3 className="text-2xl font-bold mb-6 text-center">Choose Your Hardware</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {hardwareOptions.map((hardware) => (
              <div 
                key={hardware.id}
                className={`rounded-xl p-6 border transition-all duration-300 cursor-pointer
                  ${selectedHardware === hardware.id 
                    ? (isDark ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-400')
                    : (isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200')
                  }`}
                onClick={() => setSelectedHardware(hardware.id)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Package size={20} />
                  </div>
                  <h4 className="text-lg font-semibold">{hardware.name}</h4>
                </div>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {hardware.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">${hardware.price.toFixed(2)}</span>
                  {selectedHardware === hardware.id && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setHardwareQuantity(Math.max(1, hardwareQuantity - 1));
                        }}
                        className={`p-1 rounded-md ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
                      >
                        -
                      </button>
                      <span>{hardwareQuantity}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setHardwareQuantity(hardwareQuantity + 1);
                        }}
                        className={`p-1 rounded-md ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Software plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {softwarePlans.map((plan, index) => (
            <div 
              key={plan.id}
              className={`rounded-2xl ${
                selectedPlan === index 
                  ? (isDark ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-400') 
                  : (isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200')
                } border p-6 transition-all duration-300 relative
                ${isInView ? 'animate-fadeInUp' : 'opacity-0'}`}
              style={{ 
                animation: isInView ? `fadeInUp 0.6s ease ${0.4 + index * 0.1}s forwards` : 'none',
                transform: selectedPlan === index ? 'scale(1.05)' : 'scale(1)'
              }}
              onClick={() => setSelectedPlan(index)}
            >
              {plan.popular && (
                <div className={`absolute top-0 right-6 -translate-y-1/2 px-4 py-1 text-xs font-medium rounded-full
                    ${isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-3xl font-bold">
                  {typeof plan.price === 'number' ? `$${plan.price.toFixed(2)}` : plan.price}
                </span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                  /month
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`mt-1 p-1 rounded-full ${
                      selectedPlan === index 
                        ? (isDark ? 'bg-blue-700 text-blue-200' : 'bg-blue-500 text-blue-50') 
                        : (isDark ? 'bg-gray-800 text-gray-400' : 'bg-blue-100 text-blue-600')
                      }`}>
                      <Check size={12} />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedPlan === index
                  ? (isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
                  : (isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800')
                }`}>
                Select Plan
              </button>
            </div>
          ))}
        </div>
        
        {/* Divider */}
        <div className="my-20 max-w-sm mx-auto flex items-center gap-4">
          <div className={`flex-grow h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isDark ? 'bg-blue-700' : 'bg-blue-500'}`}>
            <MapPin size={18} className="text-white" />
          </div>
          <div className={`flex-grow h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
        </div>
        
        {/* Order summary */}
        <div className={`max-w-6xl mx-auto rounded-3xl overflow-hidden relative ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-xl
            ${isInView ? 'animate-fadeIn delay-600' : 'opacity-0'}`}
            style={{ 
              animation: isInView ? 'fadeIn 1s ease 0.6s forwards' : 'none',
              boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 255, 0.15)' : '0 25px 50px -12px rgba(0, 0, 0, 0.1)'
            }}>
          
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'} blur-3xl`}></div>
            <div className={`absolute -left-20 -bottom-20 h-64 w-64 rounded-full ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'} blur-3xl`}></div>
          </div>
          
          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
              <div className="w-full md:w-3/5 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Your Order Summary</h2>
                
                {/* Cost breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* One-time hardware cost */}
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-700' : 'bg-blue-500'} text-white`}>
                        <Package size={18} />
                      </div>
                      <h3 className="font-semibold">Hardware (One-Time)</h3>
                    </div>
                    {selectedHardware ? (
                      <>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{hardwareOptions.find(h => h.id === selectedHardware)?.name} × {hardwareQuantity}</span>
                          <span className="font-medium">${getHardwareCost().toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {hardwareOptions.find(h => h.id === selectedHardware)?.description}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400">No hardware selected</div>
                    )}
                  </div>
                  
                  {/* Monthly software cost */}
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-700' : 'bg-purple-500'} text-white`}>
                        <Zap size={18} />
                      </div>
                      <h3 className="font-semibold">Software (Monthly)</h3>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{softwarePlans[selectedPlan].name} Plan</span>
                      <span className="font-medium">
                        {typeof softwarePlans[selectedPlan].price === 'number' 
                          ? `$${softwarePlans[selectedPlan].price.toFixed(2)}` 
                          : "Custom"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {softwarePlans[selectedPlan].features[0]}
                    </div>
                  </div>
                </div>
                
                {/* Total cost */}
                <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} border ${isDark ? 'border-blue-700' : 'border-blue-200'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Total Cost</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        One-time hardware + monthly software
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        ${getHardwareCost().toFixed(2)} + ${getSoftwarePrice().toFixed(2)}/mo
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <button className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 
                      ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white
                      flex items-center justify-center gap-2`}>
                    Complete Purchase <ArrowRight size={16} />
                  </button>
                  <button className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 
                      ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} 
                      flex items-center justify-center gap-2`}>
                    Contact Sales <ArrowRight size={16} />
                  </button>
                </div>
              </div>
              
              <div className="w-full md:w-2/5 flex justify-center">
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'} max-w-xs`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-700' : 'bg-blue-500'} text-white`}>
                        <Package size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">One-Time Hardware</h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Purchase your devices upfront</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-700' : 'bg-purple-500'} text-white`}>
                        <Zap size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">Monthly Software</h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Low recurring fee for our platform</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-green-700' : 'bg-green-500'} text-white`}>
                        <BarChart3 size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">No Lock-In</h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Cancel anytime</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
