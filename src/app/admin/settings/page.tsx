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
              <label className="block text-sm font-medium mb-1">Google Maps Link</label>
              <input type="text" name="mapLocationUrl" value={settings.mapLocationUrl || ''} onChange={handleChange} className="w-full border rounded p-2 mb-4" />
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
