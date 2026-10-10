const fs = require('fs');

// 1. types
let types = fs.readFileSync('src/types/settings.ts', 'utf8');
if (!types.includes('mapLocationUrl?: string')) {
  types = types.replace('autoSlideDelay: number;', 'autoSlideDelay: number;\n  mapLocationUrl?: string;');
  fs.writeFileSync('src/types/settings.ts', types);
}

// 2. storeSettings
let storeSettings = fs.readFileSync('src/lib/storeSettings.ts', 'utf8');
if (!storeSettings.includes('mapLocationUrl:')) {
  storeSettings = storeSettings.replace(
    'autoSlideDelay: 800\n};', 
    'autoSlideDelay: 800,\n  mapLocationUrl: "https://maps.app.goo.gl/RKAF5cEqpZuYQtny9?g_st=aw"\n};'
  );
  fs.writeFileSync('src/lib/storeSettings.ts', storeSettings);
}

// 3. settings page
let settingsPage = fs.readFileSync('src/app/admin/settings/page.tsx', 'utf8');
if (!settingsPage.includes('name="mapLocationUrl"')) {
  settingsPage = settingsPage.replace(
    '<label className="block text-sm font-medium mb-1">Store Address</label>',
    '<label className="block text-sm font-medium mb-1">Google Maps Link</label>\n              <input type="text" name="mapLocationUrl" value={settings.mapLocationUrl || \'\'} onChange={handleChange} className="w-full border rounded p-2 mb-4" />\n              <label className="block text-sm font-medium mb-1">Store Address</label>'
  );
  fs.writeFileSync('src/app/admin/settings/page.tsx', settingsPage);
}

// 4. Footer
// To make footer fetch settings, it should be an async Server Component!
let footer = `
import Link from 'next/link';
import { getSettings } from '@/lib/storeSettings';

export default async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="bg-stone-900 text-stone-200 pt-16 pb-8 border-t-4 border-rose-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h3 className="font-merriweather text-2xl font-bold text-white mb-4">{settings.storeName || 'Diya Store'}</h3>
          <p className="text-stone-400 mb-6 max-w-sm">
            Discover beautiful diyas that bring warmth, tradition, and elegance to every celebration. Premium Indian handicraft and home décor.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="text-stone-400 hover:text-white transition-colors">Shop All Products</Link></li>
            <li><Link href="/profile" className="text-stone-400 hover:text-white transition-colors">My Profile & Orders</Link></li>
            <li><Link href="/cart" className="text-stone-400 hover:text-white transition-colors">Shopping Cart</Link></li>
            <li><Link href="/admin" className="text-stone-400 hover:text-white transition-colors">Admin Dashboard</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Contact & Store</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-rose-500">📍</span>
              <span className="text-stone-400 text-sm whitespace-pre-line">
                {settings.address || 'Online Store'}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-rose-500">📞</span>
              <span className="text-stone-400 text-sm">{settings.contactNumber || settings.whatsappNumber}</span>
            </li>
            {settings.mapLocationUrl && (
              <li className="mt-4">
                <a 
                  href={settings.mapLocationUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-stone-800 text-white px-4 py-2 rounded hover:bg-rose-900 transition-colors text-sm font-semibold border border-stone-700"
                >
                  🗺️ Open in Google Maps
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-stone-800 pt-8 text-center text-sm text-stone-500">
        &copy; {new Date().getFullYear()} {settings.storeName || 'Diya Store'}. All rights reserved.
      </div>
    </footer>
  );
}
`;
fs.writeFileSync('src/components/Footer.tsx', footer.trim() + '\\n');
console.log('Settings and footer updated!');
