'use client';

import { ThemeProvider } from 'next-themes';
import { Geist, Geist_Mono } from "next/font/google";
import MainLayout from "./components/main-layout";
import { useThemeStore } from "./stores/useThemeStore";
import { useEffect } from "react";
import { useOrgInit } from "@/hooks/useOrgInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((state) => state.theme);
  useOrgInit(); // Initialize organization data

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MainLayout fontClasses={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </MainLayout>
    </ThemeProvider>
  );
}