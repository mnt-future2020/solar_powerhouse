'use client';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import SolarCalculator from '@/components/QuickLinks/SolarCalculator/SolarCalculator';

export default function SolarCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />
      <main className="flex-1 pt-24">
        <SolarCalculator />
      </main>
      <Footer />
    </div>
  );
}