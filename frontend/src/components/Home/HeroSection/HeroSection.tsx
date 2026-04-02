'use client';
import { useState, useEffect, useCallback } from 'react';
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
    desc: 'Harness the sun to slash electricity costs. Get started with easy financing at just 6% interest rate and save from day one.',
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % slides.length), 9000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <section className="relative w-full min-h-[100dvh] h-screen flex flex-col overflow-hidden">
      {/* Backgrounds */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-800 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img src={s.src} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0a0a0a]/65" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl space-y-5 sm:space-y-8">
            {/* Overline */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-amber-400" />
              <p className="text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase">
                Trusted Solar Partner Since 2020
              </p>
            </div>

            {/* Heading */}
            <h1
              key={current}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.08] tracking-tight"
            >
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-base lg:text-lg text-white/60 leading-relaxed max-w-lg">
              {slide.desc}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-3 bg-amber-500 text-[#0a0a0a] text-sm font-bold px-7 py-3.5 hover:bg-amber-400 transition-colors duration-200 group"
              >
                {slide.btn}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
              >
                Free Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 pb-6 sm:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between">
          {/* Slide indicators */}
          <div className="flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all duration-500 ${
                  i === current
                    ? 'w-10 h-1 bg-amber-400'
                    : 'w-6 h-0.5 bg-white/25 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="w-10 h-10 border border-white/15 hover:border-amber-400/50 flex items-center justify-center text-white/50 hover:text-amber-400 transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="w-10 h-10 border border-white/15 hover:border-amber-400/50 flex items-center justify-center text-white/50 hover:text-amber-400 transition-colors duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
