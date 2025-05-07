'use client';

import { useOrgStore } from '@/app/stores/useOrgStore';
import { useThemeStore } from '@/app/stores/useThemeStore';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { motion } from 'framer-motion';
import { Bell, User, Navigation } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  className?: string;
  onMenuClick?: () => void;
  isMobile?: boolean;
}

export function Navbar({ className = '', onMenuClick, isMobile }: NavbarProps) {
  const router = useRouter();
  const { orgName, orgLogo, colorTheme } = useOrgStore();
  const { theme } = useThemeStore();

  const handleSignOut = () => {
    router.push('/');
  };

  return (
    <>
      {/* Add this in your layout file or at the top of your component */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
      `}</style>

      <motion.nav
        className={`bg-background/95 backdrop-blur-md shadow-sm sticky top-0 z-50 dark:text-white text-black ${className}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-16 flex items-center w-full">
          <div className="flex items-center gap-4 pl-3">
            {isMobile && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-md hover:bg-accent/80 transition-colors"
                aria-label="Toggle menu"
              >
                <Navigation size={22} className="text-foreground/80" />
              </button>
            )}
            <div className="flex items-center gap-3 min-w-[256px]">
              {orgLogo ? (
                <div className="h-10 w-10 rounded-lg overflow-hidden relative">
                  <Image
                    src={orgLogo}
                    alt={orgName || 'Organization logo'}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold shadow-md"
                  style={{ backgroundColor: colorTheme }}
                >
                  {orgName?.[0]?.toUpperCase() || 'D'}
                </div>
              )}
              <div className="flex items-baseline gap-2 ml-2">
                <div className="block">
                  <div className="relative flex items-center">
                    <div className="flex items-baseline gap-2">
                      <div
                        className="text-lg font-semibold leading-tight hover:opacity-80 transition-opacity"
                        style={{ color: colorTheme }}
                      >
                        {orgName}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Pacifico', cursive",
                          fontSize: '1.25rem',
                          fontWeight: 500,
                          display: 'inline-block'
                        }}
                        className="dark:text-white text-black"
                      >
                        Admin Panel
                      </div>
                    </div>
                    <span
                      className="absolute -bottom-1 left-0 h-0.5 rounded-full"
                      style={{
                        width: '100%',
                        background: theme === 'dark'
                          ? `linear-gradient(to right, ${colorTheme || '#ffffff'}, transparent)`
                          : `linear-gradient(to right, ${colorTheme || '#000000'}, transparent)`,
                        opacity: 0.7
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 ml-auto pr-6">
            <div className="relative group">
              <button
                className="relative p-2 rounded-full transition-colors"
                style={{ backgroundColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colorTheme}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Bell
                  size={20}
                  className={theme === 'dark' ? 'text-white' : 'text-black'}
                />
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: colorTheme }}
                ></span>
              </button>
              <div
                className="absolute right-0 mt-2 w-64 p-2 bg-white dark:bg-black rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                style={{ border: `1px solid ${colorTheme}` }}
              >
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 pb-1 border-b dark:border-gray-700">Notifications</div>
                <div className="py-2 text-xs text-gray-500 dark:text-gray-400">No new notifications</div>
              </div>
            </div>

            <ThemeToggle />

            <div className="relative group">
              <button
                className="flex items-center gap-2 py-1 px-3 rounded-full transition-colors"
                style={{
                  border: `1px solid gray`,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colorTheme}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="h-7 w-7 rounded-full flex items-center justify-center overflow-hidden">
                  <User size={16} className={theme === 'dark' ? 'text-white' : 'text-black'} />
                </div>
                <span className="text-sm font-medium text-black dark:text-white">Profile</span>
              </button>
              <div
                className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-black rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                style={{ border: `1px solid ${colorTheme}` }}
              >
                <div
                  className="px-4 py-2 text-sm cursor-pointer transition-colors"
                  style={{ color: theme === 'dark' ? '#e5e7eb' : '#374151' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colorTheme}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Account Settings
                </div>
                <div
                  className="px-4 py-2 text-sm cursor-pointer transition-colors"
                  style={{ color: theme === 'dark' ? '#e5e7eb' : '#374151' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colorTheme}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Help & Support
                </div>
                <div className="border-t my-1" style={{ borderColor: `${colorTheme}40` }}></div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
}

export default Navbar;
