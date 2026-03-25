'use client';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Contact from '@/components/Contact';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24">
        <Contact />
      </main>
      <Footer />
    </div>
  );
}