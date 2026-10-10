import fs from 'fs';
import path from 'path';
import { Product, Order } from '@/types';
import { cookies } from 'next/headers';

// In a real Netlify environment, we would use:
// import { getStore } from '@netlify/blobs';

const DATA_DIR = path.join(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

export const getProducts = async (): Promise<Product[]> => {
   // Opt into dynamic rendering
  const data = await fs.promises.readFile(PRODUCTS_FILE, 'utf8');
  return JSON.parse(data);
};

export const saveProducts = async (products: Product[]): Promise<void> => {
  await fs.promises.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
};

export const getOrders = async (): Promise<Order[]> => {
   // Opt into dynamic rendering
  const data = await fs.promises.readFile(ORDERS_FILE, 'utf8');
  return JSON.parse(data);
};

export const saveOrders = async (orders: Order[]): Promise<void> => {
  await fs.promises.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
};
