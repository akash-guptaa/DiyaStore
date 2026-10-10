const fs = require('fs');
const path = require('path');

const files = {
  "src/types/index.ts": `
export interface ProductImage {
  url: string;
  alt: string;
  isMain: boolean;
  sortOrder: number;
}

export interface Product {
  id: string; 
  productCode: string; 
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice: number | null;
  categoryId: string;
  images: ProductImage[];
  specifications: Record<string, string>;
  stockQuantity: number;
  status: 'draft' | 'published';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productCode: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string; 
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  customerAddress?: string;
  customerCity?: string;
  customerPincode?: string;
  customerState?: string;
  orderNotes?: string;
  items: OrderItem[];
  total: number;
  status: 'pending_whatsapp_confirmation' | 'confirmed' | 'collect_from_shop' | 'delivered' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  city?: string;
  totalSpent: number;
  orderCount: number;
  lastOrder: string;
  createdAt: string;
}
  `,

  "src/lib/storeCustomers.ts": `
import fs from 'fs';
import path from 'path';
import { Customer } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'customers.json');

export const getCustomers = async (): Promise<Customer[]> => {
  if (!fs.existsSync(FILE)) return [];
  const data = await fs.promises.readFile(FILE, 'utf8');
  return JSON.parse(data);
};

export const saveCustomers = async (customers: Customer[]): Promise<void> => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  await fs.promises.writeFile(FILE, JSON.stringify(customers, null, 2));
};
  `,

  "src/app/api/customers/route.ts": `
import { NextResponse } from 'next/server';
import { getCustomers, saveCustomers } from '@/lib/storeCustomers';
import { getOrders } from '@/lib/store';
import { Customer } from '@/types';

export async function GET() {
  const manualCustomers = await getCustomers();
  const orders = await getOrders();
  
  const customersMap = new Map<string, Customer>();
  
  // Add manual customers first
  manualCustomers.forEach(c => customersMap.set(c.mobile, c));
  
  // Merge order data
  orders.forEach(o => {
    if (!customersMap.has(o.customerMobile)) {
      customersMap.set(o.customerMobile, {
        id: \`cust_\${Math.random().toString(36).substr(2, 9)}\`,
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
    const c = customersMap.get(o.customerMobile)!;
    c.totalSpent += o.total;
    c.orderCount += 1;
    if (new Date(o.createdAt) > new Date(c.lastOrder)) c.lastOrder = o.createdAt;
  });

  return NextResponse.json(Array.from(customersMap.values()));
}

export async function POST(request: Request) {
  const data = await request.json();
  const manualCustomers = await getCustomers();
  
  const newCustomer: Customer = {
    id: \`cust_\${Math.random().toString(36).substr(2, 9)}\`,
    name: data.name,
    mobile: data.mobile,
    email: data.email || '',
    city: data.city || '',
    totalSpent: 0,
    orderCount: 0,
    lastOrder: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  
  manualCustomers.push(newCustomer);
  await saveCustomers(manualCustomers);
  
  return NextResponse.json(newCustomer, { status: 201 });
}
  `,

  "src/app/admin/customers/page.tsx": `
'use client';
import { useState, useEffect } from 'react';
import { Customer } from '@/types';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '', city: '' });
  const [saving, setSaving] = useState(false);
  
  const fetchCustomers = () => {
    fetch('/api/customers').then(r => r.json()).then(setCustomers);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setSaving(false);
    setIsModalOpen(false);
    setFormData({ name: '', mobile: '', email: '', city: '' });
    fetchCustomers();
  };

  const exportCSV = () => {
    const headers = ['Name', 'Mobile', 'Email', 'City', 'Orders', 'Total Spent'];
    const rows = customers.map(c => [c.name, c.mobile, c.email||'', c.city||'', c.orderCount, c.totalSpent]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer List</h1>
        <div className="space-x-4">
          <button onClick={exportCSV} className="bg-stone-200 text-stone-800 px-4 py-2 rounded font-medium hover:bg-stone-300">
            Download CSV
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-rose-700 text-white px-6 py-2 rounded font-medium hover:bg-rose-800">
            + Add Customer
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow text-left min-w-max">
          <thead>
            <tr className="bg-stone-100 border-b">
              <th className="p-4">Name</th>
              <th className="p-4">Mobile</th>
              <th className="p-4">Location</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c: any) => (
              <tr key={c.mobile} className="border-b hover:bg-stone-50">
                <td className="p-4 font-bold">{c.name}</td>
                <td className="p-4 text-stone-600"><a href={\`https://wa.me/\${c.mobile.replace('+', '')}\`} target="_blank" className="text-green-600 underline">{c.mobile}</a></td>
                <td className="p-4 text-stone-600">{c.city || 'N/A'}</td>
                <td className="p-4 font-bold">{c.orderCount}</td>
                <td className="p-4 font-bold text-rose-900">₹{c.totalSpent}</td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={5} className="p-8 text-center">No customers found.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Add Manual Customer</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name *</label>
                <input required type="text" className="w-full border rounded p-2" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Mobile *</label>
                <input required type="text" className="w-full border rounded p-2" value={formData.mobile} onChange={e=>setFormData({...formData, mobile: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input type="email" className="w-full border rounded p-2" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">City</label>
                <input type="text" className="w-full border rounded p-2" value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-stone-100 rounded">Cancel</button>
                <button disabled={saving} type="submit" className="px-4 py-2 bg-rose-700 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
console.log('Customers with CSV export applied.');
