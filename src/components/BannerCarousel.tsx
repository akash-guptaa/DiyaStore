'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BannerCarousel({ headline, subtitle }: { headline: string, subtitle: string }) {
  const images = [
    '/uploads/banner_diwali.jpg',
    '/uploads/banner_brass.jpg',
    '/uploads/banner_home.jpg'
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden bg-stone-900">
      {/* Background Images */}
      {images.map((src, idx) => (
        <div 
          key={src}
          className={'absolute inset-0 transition-opacity duration-1000 ' + (idx === currentIndex ? 'opacity-100' : 'opacity-0')}
        >
          <img loading="lazy" src={src} alt="Banner" className="w-full h-full object-cover object-center opacity-60" />
        </div>
      ))}
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="font-merriweather text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-md">
          {headline}
        </h1>
        <p className="text-lg md:text-2xl text-stone-200 mb-8 max-w-3xl mx-auto drop-shadow-md">
          {subtitle}
        </p>
        <button 
          onClick={() => {
            const el = document.getElementById('collection');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-rose-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-rose-600 transition-colors shadow-lg uppercase tracking-wider"
        >
          Shop Now
        </button>
      </div>
      
      {/* Dots indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
        {images.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={'w-3 h-3 rounded-full transition-all ' + (idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50')}
          />
        ))}
      </div>
    </div>
  );
}
