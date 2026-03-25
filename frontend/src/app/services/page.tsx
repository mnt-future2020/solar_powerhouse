"use client";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Service from "@/components/Service/Service";

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000c15]">
      <Header />
      
      <main className="flex-1 pt-24">
         <Service />
      </main>

      <Footer />
    </div>
  );
}
