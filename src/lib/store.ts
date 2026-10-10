import fs from 'fs';
import path from 'path';
import { Product, Order } from '@/types';
import { cookies } from 'next/headers';

// In a real Netlify environment, we would use:
// import { getStore } from '@netlify/blobs';

const DATA_DIR = path.join(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) { console.error('Failed to mkdir ' + DATA_DIR, e); }
}

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

if (!fs.existsSync(PRODUCTS_FILE)) {
  try { fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2)); } catch (e) { console.error('Failed to writeSync ' + PRODUCTS_FILE, e); }
}
if (!fs.existsSync(ORDERS_FILE)) {
  try { fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2)); } catch (e) { console.error('Failed to writeSync ' + ORDERS_FILE, e); }
}

export const getProducts = async (): Promise<Product[]> => {
   // Opt into dynamic rendering
  const data = await fs.promises.readFile(PRODUCTS_FILE, 'utf8');
  return JSON.parse(data);
};

export const saveProducts = async (products: Product[]): Promise<void> => {
  try { await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2)); } catch (e) { console.error('Failed to write ' + PRODUCTS_FILE, e); }
};

export const getOrders = async (): Promise<Order[]> => {
   // Opt into dynamic rendering
  const data = await fs.promises.readFile(ORDERS_FILE, 'utf8');
  return JSON.parse(data);
};

export const saveOrders = async (orders: Order[]): Promise<void> => {
  try { await fs.promises.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2)); } catch (e) { console.error('Failed to write ' + ORDERS_FILE, e); }
};
