'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useOrgStore } from '@/app/stores/useOrgStore';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

// Lucide React Icons
import {
  LayoutDashboard,
  Users,
  Car,
  UsersRound,
  Route,
  Train,
  Megaphone,
  AlertTriangle,
  ClipboardList,
  Activity,
  Settings,
  Navigation,
  PenBoxIcon,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard'
  },
  {
    label: 'Manage Users',
    icon: Users,
    href: '/dashboard/users'
  },
  {
    label: 'Manage Vehicles',
    icon: Car,
    href: '/dashboard/vehicles'
  },
  {
    label: 'Manage Teams',
    icon: UsersRound,
    href: '/dashboard/teams'
  },
  {
label:'Manage nfc attendance',
icon:PenBoxIcon,
href:'/dashboard/nfc'
  },
  {
    label: 'Manage Routes',
    icon: Route,
    href: '/dashboard/routes'
  },
  {
    label: 'Manage Stations',
    icon: Train,
    href: '/dashboard/stations'
  },
  {
    label: 'Manage Announcements',
    icon: Megaphone,
    href: '/dashboard/announcements'
  },
  {
    label: 'Issues',
    icon: AlertTriangle,
    href: '/dashboard/issues'
  },
  {
    label: 'Logs',
    icon: ClipboardList,
    href: '/dashboard/logs'
  },
  {
    label: 'System Health',
    icon: Activity,
    href: '/dashboard/health'
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings'
  }
];

export function Sidebar({ className = '', isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { colorTheme } = useOrgStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { theme } = useTheme();
  
  // Set a default size for all icons
  const iconSize = 18;

  return (
    <motion.aside
      className={cn(
        "bg-background/95 border-r border-border/40 backdrop-blur-sm h-[calc(100vh-4rem)]",
        "fixed left-0 top-16 z-30",
        "transition-all duration-300 ease-in-out",
        // Hide scrollbar but keep functionality
        "overflow-y-auto scrollbar-hide",
        className
      )}
      initial={{ width: 256 }}
      animate={{ width: isOpen ? 256 : 72 }}
    >
      {/* Sidebar Header with Toggle */}
      <div className="flex items-center justify-center p-3 border-b border-border/40">
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-accent/80 transition-colors"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          style={{ color: colorTheme }}
        >
          <Navigation 
            size={22} 
            className={cn(
              "text-foreground/80 transition-transform duration-300",
              isOpen ? "rotate-0" : "rotate-90"
            )}
          />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <motion.div
              key={item.href}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="overflow-hidden"
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-3 text-sm font-medium",
                  "transition-all duration-150 ease-in-out",
                  isActive 
                    ? "text-white shadow-sm" 
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/30",
                  isOpen ? "justify-start" : "justify-center"
                )}
                style={{
                  backgroundColor: isActive ? colorTheme : undefined,
                }}
                title={!isOpen ? item.label : undefined}
              >
                <Icon 
                  size={iconSize} 
                  className={cn(
                    "flex-shrink-0",
                    isActive ? "text-white" : "text-foreground/70"
                  )}
                  style={{ 
                    color: isActive ? 'white' : colorTheme 
                  }}
                />
                
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "truncate",
                      isActive ? "" : "text-foreground/90"
                    )}
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      {/* Footer */}
      {isOpen && (
        <div className="mt-auto px-4 py-4 border-t border-border/40">
          <p className="text-xs text-foreground/50 text-center">
            © 2025 Transport System
          </p>
        </div>
      )}
    </motion.aside>
  );
}

// You may need to add this CSS class to your global styles or a utility class
// .scrollbar-hide::-webkit-scrollbar {
//   display: none;
// }
// .scrollbar-hide {
//   -ms-overflow-style: none;
//   scrollbar-width: none;
// }

export default Sidebar;