import fs from 'fs';
import path from 'path';
import { Customer } from '@/types';
import { getOrders } from './store';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'customers.json');

export const getCustomers = async (): Promise<Customer[]> => {
  if (!fs.existsSync(FILE)) return [];
  const data = await fs.promises.readFile(FILE, 'utf8');
  return JSON.parse(data);
};

export const saveCustomers = async (customers: Customer[]): Promise<void> => {
  if (!fs.existsSync(DATA_DIR)) try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) { console.error('Failed to mkdir ' + DATA_DIR, e); }
  try { await fs.promises.writeFile(FILE, JSON.stringify(customers, null, 2)); } catch (e) { console.error('Failed to write ' + FILE, e); }
};

export const getAllDerivedCustomers = async (): Promise<Customer[]> => {
  const manualCustomers = await getCustomers();
  const orders = await getOrders();
  
  const customersMap = new Map<string, Customer>();
  
  manualCustomers.forEach(c => customersMap.set(c.mobile, c));
  
  orders.forEach(o => {
    if (!customersMap.has(o.customerMobile)) {
      customersMap.set(o.customerMobile, {
        id: 'cust_' + Math.random().toString(36).substr(2, 9),
        name: o.customerName,
        mobile: o.customerMobile,
        email: o.customerEmail || '',
        city: o.customerCity || '',
        totalSpent: 0,
        orderCount: 0,
        lastOrder: o.createdAt,
        createdAt: o.createdAt
      });
    }
    const c = customersMap.get(o.customerMobile);
    if (c) {
      c.totalSpent += o.total;
      c.orderCount += 1;
      if (new Date(o.createdAt) > new Date(c.lastOrder)) c.lastOrder = o.createdAt;
    }
  });

  return Array.from(customersMap.values());
};
