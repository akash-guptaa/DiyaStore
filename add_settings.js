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
  heroButtonText: "Shop Now"
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
  "src/app/api/settings/route.ts": `
import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/storeSettings';

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const current = await getSettings();
  const updated = { ...current, ...data };
  await saveSettings(updated);
  return NextResponse.json(updated);
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

        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
  `,
  "src/app/admin/page.tsx": `
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-stone-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/products" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-stone-200">
            <h2 className="text-xl font-semibold mb-2 text-stone-800">Products</h2>
            <p className="text-stone-500 text-sm">Manage your product catalog, add new diyas, and update prices.</p>
          </Link>
          <Link href="/admin/orders" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-stone-200">
            <h2 className="text-xl font-semibold mb-2 text-stone-800">Orders</h2>
            <p className="text-stone-500 text-sm">View WhatsApp orders, update statuses, and manage customers.</p>
          </Link>
          <Link href="/admin/settings" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-stone-200">
            <h2 className="text-xl font-semibold mb-2 text-stone-800">Settings</h2>
            <p className="text-stone-500 text-sm">Update store contact info, address, and hero banner content.</p>
          </Link>
        </div>
      </div>
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
console.log('Settings page generated.');
