  'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { LandingPageNavbar } from "./mainnav";

export default function MainLayout({
  children,
  fontClasses,
}: {
  children: React.ReactNode;
  fontClasses: string;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showNav = !pathname?.startsWith('/auth/signin' ) && !pathname?.startsWith('/dashboard');  
  const showProgressNavbar = (pathname?.startsWith('/auth/register') || pathname?.startsWith('/onboarding'));

  return (
    <div className={`${fontClasses} antialiased`}>
      {showNav && (
        showProgressNavbar ? (
          <Navbar />
        ) : (
          <LandingPageNavbar 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        )
      )}
      <main className={`min-h-screen bg-background ${showNav ? 'pt-16' : ''}`}>
        {children}
      </main>
    </div>
  );
}
