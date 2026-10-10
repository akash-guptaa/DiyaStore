const fs = require('fs');
const path = require('path');

const files = {
  "src/types/settings.ts": `
export interface StoreSettings {
  storeName: string;
  contactNumber: string;
  whatsappNumber: string;
  address: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroButtonText: string;
  autoSlideDelay: number;
}
  `,

  "src/lib/storeSettings.ts": `
import fs from 'fs';
import path from 'path';
import { StoreSettings } from '@/types/settings';

const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

const defaultSettings: StoreSettings = {
  storeName: "Diya Store",
  contactNumber: "+91 7400422743",
  whatsappNumber: "+91 7400422743",
  address: "Shop No. 1, Girnar Dharshan, Narayan Nagar Road, Bhayandar West, Maharashtra – 401101, India.",
  heroHeadline: "Light Up Every Moment.",
  heroSubtitle: "Discover beautiful diyas that bring warmth, tradition, and elegance to every celebration.",
  heroButtonText: "Shop Now",
  autoSlideDelay: 800
};

export const getSettings = async (): Promise<StoreSettings> => {
  if (!fs.existsSync(SETTINGS_FILE)) {
    return defaultSettings;
  }
  const data = await fs.promises.readFile(SETTINGS_FILE, 'utf8');
  return { ...defaultSettings, ...JSON.parse(data) };
};

export const saveSettings = async (settings: StoreSettings): Promise<void> => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  await fs.promises.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
};
  `,

  "src/components/ProductGallery.tsx": `
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
              className={\`relative aspect-square rounded overflow-hidden border-2 transition-all shrink-0 w-20 md:w-full \${currentIndex === idx ? 'border-rose-700 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}\`}
            >
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
  `,
  
  "src/app/product/[id]/page.tsx": `
export const dynamic = 'force-dynamic';
import { getProducts } from '@/lib/store';
import { getSettings } from '@/lib/storeSettings';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import ProductGallery from '@/components/ProductGallery';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getProducts();
  const settings = await getSettings();
  
  const product = products.find((p: any) => p.id === id || p.slug === id);

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Product Gallery */}
        <ProductGallery images={product.images || []} autoSlideDelay={settings.autoSlideDelay || 800} />
        
        {/* Right Side: Product Details */}
        <div>
          <div className="text-sm text-stone-500 mb-2 font-mono tracking-wide">{product.productCode}</div>
          <h1 className="text-3xl font-merriweather font-bold mb-4 text-stone-900">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="text-3xl font-bold text-rose-900">₹{product.salePrice || product.price}</div>
            {product.salePrice && (
              <div className="text-lg text-stone-400 line-through">₹{product.price}</div>
            )}
          </div>
          
          <div className="bg-stone-50 p-4 rounded-lg mb-8 border border-stone-100">
            <h3 className="font-semibold text-stone-800 mb-2">Description</h3>
            <p className="text-stone-600 whitespace-pre-wrap text-sm leading-relaxed">{product.description}</p>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
  `,

  "src/app/admin/settings/page.tsx": `
'use client';
import { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) setMessage('Settings saved successfully!');
      else setMessage('Error saving settings.');
    } catch(err) {
      setMessage('Error saving settings.');
    }
    setSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  if (!settings) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Store Settings</h1>
      
      {message && <div className="mb-4 p-4 bg-green-50 text-green-700 rounded border border-green-200">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Store Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Store Name</label>
              <input type="text" name="storeName" value={settings.storeName || ''} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Number</label>
              <input type="text" name="contactNumber" value={settings.contactNumber || ''} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
              <input type="text" name="whatsappNumber" value={settings.whatsappNumber || ''} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Store Address</label>
              <textarea name="address" value={settings.address || ''} onChange={handleChange} className="w-full border rounded p-2 h-24" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 mt-8">Hero Banner</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hero Headline</label>
              <input type="text" name="heroHeadline" value={settings.heroHeadline || ''} onChange={handleChange} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
              <textarea name="heroSubtitle" value={settings.heroSubtitle || ''} onChange={handleChange} className="w-full border rounded p-2 h-20" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 mt-8">Product Display Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Image Auto-Slide Delay (ms)</label>
              <input type="number" step="100" min="500" name="autoSlideDelay" value={settings.autoSlideDelay || 800} onChange={handleChange} className="w-full border rounded p-2" />
              <p className="text-xs text-stone-500 mt-1">Controls how fast product images slide automatically (default: 800ms).</p>
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
  `
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
}
console.log('Product Gallery slider applied.');
