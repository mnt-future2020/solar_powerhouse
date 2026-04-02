'use client';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Contact from '@/components/Contact';
import { useEffect } from 'react';

export default function ContactPage() {
  useEffect(() => {
    // Smooth scroll to form if hash is present
    if (window.location.hash === '#contact-form') {
      setTimeout(() => {
        const element = document.getElementById('contact-form');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#000c15]">
      <Header />
      <main className="flex-1 pt-24">
        <Contact />
      </main>
      <Footer />
    </div>
  );
}