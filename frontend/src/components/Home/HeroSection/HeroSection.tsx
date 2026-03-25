'use client';
import { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ConsultationModal from '@/components/ui/ConsultationModal';

const slides = [
  {
    src: '/assets/image/banner/hero1.jpg',
    title: 'Solar Power for Every Rooftop',
    desc: 'Bring clean energy home with our tailored residential solar installations. Built for your roof, designed for your savings.',
    btn: 'Start Today',
  },
  {
    src: '/assets/image/banner/hero2.jpg',
    title: 'Cut Your Energy Bills with Solar',
    desc: 'Harness the sun to slash electricity costs. Our smart solar systems deliver real savings from the very first day.',
    btn: 'Start Saving with Us',
  },
  {
    src: '/assets/image/banner/hero3.jpg',
    title: 'Industrial-Scale Solar Solutions',
    desc: 'Power your facility with high-capacity solar systems engineered for industrial and commercial demands.',
    btn: 'Get Started',
  },
];

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 9000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const counter = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;

  return (
    <section className="relative w-full h-screen flex flex-col overflow-hidden">
      {/* Backgrounds */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img src={s.src} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
        </div>
      ))}

      {/* Top-left content — sits just below header */}
      <div className="relative z-10 flex-1 flex flex-col justify-start pt-24">
        <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-xl space-y-4 mt-6">
          <h2 className="text-5xl font-semibold text-white leading-snug">
            {slide.title}
          </h2>
          <p className="text-base text-white/80 leading-relaxed">
            {slide.desc}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 border border-white text-white text-sm font-semibold px-6 py-3 hover:bg-amber-500 hover:border-amber-500 transition-all duration-300 group mt-2"
          >
            {slide.btn}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        </div>
      </div>

      {/* Bottom-left: counter + square arrows */}
      <div className="relative z-10 pb-8">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center gap-3">
        <span className="text-white font-semibold text-sm tracking-widest mr-1">
          {counter}
        </span>
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="w-9 h-9 border border-white/60 hover:border-amber-400 flex items-center justify-center text-white hover:text-amber-400 transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="w-9 h-9 border border-white/60 hover:border-amber-400 flex items-center justify-center text-white hover:text-amber-400 transition-all duration-200"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        </div>
      </div>

      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
