"use client";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Finance from "@/components/QuickLinks/Finance/Finance";

export default function FinancingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000c15]">
      <Header />
      
      <main className="flex-1 pt-24">
        <Finance />
      </main>

      <Footer />
    </div>
  );
}