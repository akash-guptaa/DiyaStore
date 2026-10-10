'use client';
import { useState, useEffect } from 'react';
import { ProductImage } from '@/types';

export default function ProductGallery({ images, autoSlideDelay }: { images: ProductImage[], autoSlideDelay: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoSlideDelay);

    return () => clearInterval(interval);
  }, [images, autoSlideDelay]);

  if (!images || images.length === 0) {
    return <div className="aspect-square bg-stone-100 rounded-lg"></div>;
  }

  return (
    <div className="flex flex-col md:flex-row-reverse gap-4">
      {/* Main Image */}
      <div className="flex-1 aspect-square bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
        <img src={images[currentIndex].url} alt={images[currentIndex].alt} className="w-full h-full object-cover transition-opacity duration-300" />
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 pb-2 md:pb-0 hide-scrollbar">
          {images.map((img, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-square rounded overflow-hidden border-2 transition-all shrink-0 w-20 md:w-full ${currentIndex === idx ? 'border-rose-700 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}