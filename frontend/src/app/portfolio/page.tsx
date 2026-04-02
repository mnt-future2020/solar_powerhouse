'use client';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Zap, X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/axios';

interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  location: string;
  capacity: string;
}

const filterCategories = ['All', 'Residential', 'Commercial', 'Industrial', 'Government', 'Educational'];

// ── Lightbox Modal ────────────────────────────────────────────────────────────
function Lightbox({
  item, items, onClose, onNavigate
}: {
  item: PortfolioItem;
  items: PortfolioItem[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const currentIndex = items.findIndex(i => i._id === item._id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(items[currentIndex - 1]._id);
      if (e.key === 'ArrowRight' && hasNext) onNavigate(items[currentIndex + 1]._id);
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [item._id, hasPrev, hasNext, currentIndex, items, onClose, onNavigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-navy/95 flex items-center justify-center p-3 sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col lg:flex-row bg-white rounded-xl sm:rounded-2xl overflow-hidden overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative lg:w-3/5 aspect-video sm:aspect-4/3 lg:aspect-auto bg-cream-dark shrink-0">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />

          {/* Nav arrows */}
          {hasPrev && (
            <button
              onClick={() => onNavigate(items[currentIndex - 1]._id)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
              aria-label="Previous project"
            >
              <ChevronLeft className="h-5 w-5 text-navy" />
            </button>
          )}
          {hasNext && (
            <button
              onClick={() => onNavigate(items[currentIndex + 1]._id)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
              aria-label="Next project"
            >
              <ChevronRight className="h-5 w-5 text-navy" />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-navy/70 text-white text-xs font-semibold">
            {currentIndex + 1} / {items.length}
          </div>
        </div>

        {/* Details panel */}
        <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded-full bg-gold/15 text-gold-dark text-xs font-bold">
                {item.category}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-cream-dark hover:bg-cream flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-charcoal" />
              </button>
            </div>

            <h2
              className="text-2xl sm:text-3xl font-bold text-navy leading-snug mb-4"
            >
              {item.title}
            </h2>

            {item.description && (
              <p className="text-sm text-charcoal/50 leading-relaxed mb-6">
                {item.description}
              </p>
            )}

            {/* Meta */}
            <div className="space-y-3">
              {item.location && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cream-dark flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-[10px] text-charcoal/30 font-semibold uppercase tracking-wider">Location</p>
                    <p className="text-sm font-semibold text-navy">{item.location}</p>
                  </div>
                </div>
              )}
              {item.capacity && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cream-dark flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4 text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-[10px] text-charcoal/30 font-semibold uppercase tracking-wider">System Capacity</p>
                    <p className="text-sm font-semibold text-navy">{item.capacity}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/contact#contact-form"
            className="btn-pill btn-pill-gold justify-center mt-8 text-sm"
          >
            Get a Similar Setup
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);
  const LOAD_MORE = 6;

  useEffect(() => {
    axios.get('/portfolio')
      .then(r => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'All'
    ? items
    : items.filter(item => item.category === activeFilter);

  const selectedItem = filtered.find(i => i._id === selectedId) || null;

  // Count per category
  const counts = filterCategories.reduce((acc, cat) => {
    acc[cat] = cat === 'All' ? items.length : items.filter(i => i.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen flex flex-col bg-navy">
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="bg-navy py-14 sm:py-20 lg:py-28 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left — Text */}
              <div>
                <span className="text-xs font-bold text-gold uppercase tracking-widest">Our Work</span>
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mt-4"
                >
                  Projects That<br />
                  <span className="text-gold">Speak Results</span>
                </h1>
                <p className="text-white/40 text-sm sm:text-base mt-5 max-w-md leading-relaxed">
                  Every installation is a testament to quality, precision, and our commitment to a sustainable future.
                </p>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-white/8">
                  <div>
                    <p className="text-3xl font-extrabold text-white">{items.length}+</p>
                    <p className="text-xs text-white/30 font-medium mt-1">Projects Completed</p>
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-white">
                      {new Set(items.map(i => i.category).filter(Boolean)).size}
                    </p>
                    <p className="text-xs text-white/30 font-medium mt-1">Sectors Served</p>
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-white">
                      {new Set(items.map(i => i.location).filter(Boolean)).size}+
                    </p>
                    <p className="text-xs text-white/30 font-medium mt-1">Locations</p>
                  </div>
                </div>
              </div>

              {/* Right — Featured images grid */}
              <div className="hidden lg:block">
                {items.length >= 3 ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-3">
                      <div className="aspect-4/3 rounded-2xl overflow-hidden">
                        <img src={items[0].image} alt={items[0].title} className="w-full h-full object-cover" />
                      </div>
                      <div className="aspect-square rounded-2xl overflow-hidden">
                        <img src={items[2].image} alt={items[2].title} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="pt-8 space-y-3">
                      <div className="aspect-square rounded-2xl overflow-hidden">
                        <img src={items[1].image} alt={items[1].title} className="w-full h-full object-cover" />
                      </div>
                      {items[3] && (
                        <div className="aspect-4/3 rounded-2xl overflow-hidden">
                          <img src={items[3].image} alt={items[3].title} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : items.length > 0 ? (
                  <div className="aspect-4/3 rounded-2xl overflow-hidden">
                    <img src={items[0].image} alt={items[0].title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-4/3 rounded-2xl bg-navy-light flex items-center justify-center">
                    <p className="text-white/20 text-sm">Add projects to showcase here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Filter + Grid */}
        <section className="py-10 sm:py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-12">
              {filterCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveFilter(cat); setVisibleCount(9); }}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeFilter === cat
                      ? 'bg-navy text-white shadow-md shadow-navy/10'
                      : 'bg-cream-dark text-charcoal/40 hover:text-charcoal/70'
                  }`}
                >
                  {cat}
                  {counts[cat] > 0 && (
                    <span className={`ml-1.5 text-xs ${activeFilter === cat ? 'text-white/50' : 'text-charcoal/25'}`}>
                      {counts[cat]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-cream-dark animate-pulse aspect-4/3" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-charcoal/25 text-base font-medium">No projects in this category yet.</p>
              </div>
            ) : (
              <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.slice(0, visibleCount).map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedId(item._id)}
                  >
                    <div className="relative rounded-2xl overflow-hidden bg-cream-dark">
                      {/* Image */}
                      <div className="aspect-4/3 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <ArrowRight className="h-5 w-5 text-navy" />
                        </div>
                      </div>

                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1.5 rounded-full bg-white/90 text-navy text-xs font-bold shadow-sm">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Info below image */}
                    <div className="mt-4 space-y-1.5">
                      <h3 className="text-base font-bold text-navy group-hover:text-gold-dark transition-colors duration-200">
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-charcoal/35 text-xs">
                        {item.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {item.location}
                          </span>
                        )}
                        {item.capacity && (
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" /> {item.capacity}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-charcoal/30 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              {visibleCount < filtered.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setVisibleCount(prev => prev + LOAD_MORE)}
                    className="px-8 py-3 rounded-full bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors shadow-md shadow-navy/10"
                  >
                    Load More ({filtered.length - visibleCount} remaining)
                  </button>
                </div>
              )}
              </>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-navy py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2
              className="text-2xl sm:text-3xl font-bold text-white leading-tight"
            >
              Ready to Start Your Solar Project?
            </h2>
            <p className="text-white/35 text-sm mt-3 max-w-md mx-auto leading-relaxed">
              Get a free consultation and a custom solar solution designed for your property.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/contact#contact-form" className="btn-pill btn-pill-gold">
                Get Free Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact#contact-form" className="btn-pill btn-pill-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <Lightbox
            item={selectedItem}
            items={filtered}
            onClose={() => setSelectedId(null)}
            onNavigate={(id) => setSelectedId(id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
