'use client';

import dynamic from 'next/dynamic';
import HeroSection from "./components/hero";
import PricingCTA from './components/pricing';
import IndustrySolutions from './components/solutions';
import Footer from './components/footer';
import  BusTrackingShowcase from './components/mobile';

const DashboardPreview = dynamic(() => import("./components/dash"), {
  ssr: false,
  loading: () => <div className="min-h-screen animate-pulse bg-muted" />
});

const FeaturesSection = dynamic(() => import("./components/feat"), {
  ssr: false,
  loading: () => <div className="min-h-screen animate-pulse bg-muted" />
});

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <div id="hero" className="w-screen min-h-screen overflow-hidden">
        <HeroSection />
      </div>
      <div id="features" className="w-screen min-h-screen overflow-hidden">
        <FeaturesSection />
      </div>
      <div id="solutions" className="w-screen min-h-screen overflow-hidden">
        <IndustrySolutions/>
      </div>
      <div id="dashboard" className="w-screen min-h-screen overflow-hidden">
        <DashboardPreview/>
      </div>
      <div className="w-full bg-background">
        <div className="bg-background">
          <BusTrackingShowcase/>
        </div>
        <div className="bg-background">
          <PricingCTA/>
        </div>
        <div className="bg-background">
          <Footer />
        </div>
      </div>
    </div>
  );}
