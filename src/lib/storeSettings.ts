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
  autoSlideDelay: 800,
  mapLocationUrl: "https://maps.app.goo.gl/RKAF5cEqpZuYQtny9?g_st=aw"
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
    try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) { console.error('Failed to mkdir ' + DATA_DIR, e); }
  }
  try { await fs.promises.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2)); } catch (e) { console.error('Failed to write ' + SETTINGS_FILE, e); }
};