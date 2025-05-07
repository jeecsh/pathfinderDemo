'use client';

import { useOrgInit } from '@/hooks/useOrgInit';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Providers } from './providers';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useOrgInit();
  const { isMobile } = useDeviceType();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const pathname = usePathname();

  // Update sidebar state when device type changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  return (
    <Providers>
      <div className="min-h-screen bg-background pt-16">
        <Navbar 
          className="fixed top-0 w-full z-50" 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
        />
        <div className="flex relative min-h-[calc(100vh-4rem)]">
          <Sidebar 
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            className="fixed h-[calc(100vh-4rem)] z-40"
            isMobile={isMobile}
          />
          {/* Mobile overlay */}
          <AnimatePresence>
            {isMobile && sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-30"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>
          
          {/* Main content */}
          <motion.main
            className={cn(
              "flex-1 p-4 transition-all duration-300",
              "md:p-6",
              isMobile ? "w-full" : sidebarOpen ? "md:ml-64" : "md:ml-20"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </motion.main>
        </div>
      </div>
    </Providers>
  );
}
