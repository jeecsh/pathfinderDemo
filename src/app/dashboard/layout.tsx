'use client';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { useOrgInit } from '@/hooks/useOrgInit';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useOrgInit();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <Navbar className="fixed top-0 w-full z-50" />
      <div className="flex pt-16">
        <Sidebar 
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          className="fixed h-[calc(100vh-4rem)] z-40"
        />
        <motion.main
          className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-20'}`}
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
  );
}
