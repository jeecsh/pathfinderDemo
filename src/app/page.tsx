'use client';

import dynamic from 'next/dynamic';
import HeroSection from "./components/hero";
import PricingCTA from './components/pricing';
import IndustrySolutions from './components/solutions';
import Footer from './components/footer';

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
      <div className="w-screen min-h-screen overflow-hidden">
        <HeroSection />
      </div>
      <div className="w-screen min-h-screen overflow-hidden">
        <FeaturesSection />
      </div>
      <div className="w-screen min-h-screen overflow-hidden">
        <IndustrySolutions/>
      </div>
      <div className="w-screen min-h-screen overflow-hidden">
        <DashboardPreview />
      </div>
      <div className="w-screen min-h-screen overflow-hidden">
        <PricingCTA />
      </div>
      <div className="w-full bg-black text-gray-400 py-1 px-4flex-shrink-0">
        <Footer />
      </div>
    </div>
  );
}
