"use client";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import About from "@/components/About/About";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000c15]">
      <Header />
      
      <main className="flex-1 pt-24">
         <About />
      </main>

      <Footer />
    </div>
  );
}
