const fs = require('fs');
const path = require('path');

const files = {
  "src/app/api/customers/[id]/route.ts": `
import { NextResponse } from 'next/server';
import { getCustomers, saveCustomers } from '@/lib/storeCustomers';
import { Customer } from '@/types';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const customers = await getCustomers();
  
  const index = customers.findIndex((c) => c.id === id);
  if (index !== -1) {
    // Manual customer exists
    const updatedCustomer: Customer = {
      ...customers[index],
      name: data.name,
      mobile: data.mobile,
      email: data.email || '',
      city: data.city || ''
    };
    customers[index] = updatedCustomer;
    await saveCustomers(customers);
    return NextResponse.json(updatedCustomer);
  } else {
    // It's a derived customer being edited for the first time, save as manual
    const newCustomer: Customer = {
      id: id,
      name: data.name,
      mobile: data.mobile,
      email: data.email || '',
      city: data.city || '',
      totalSpent: 0,
      orderCount: 0,
      lastOrder: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    customers.push(newCustomer);
    await saveCustomers(customers);
    return NextResponse.json(newCustomer, { status: 201 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customers = await getCustomers();
  
  const updatedCustomers = customers.filter((c) => c.id !== id);
  await saveCustomers(updatedCustomers);

  return new NextResponse(null, { status: 204 });
}
  `,

  "src/app/admin/customers/page.tsx": `
'use client';
import { useState, useEffect } from 'react';
import { Customer } from '@/types';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '', city: '' });
  const [saving, setSaving] = useState(false);
  
  const fetchCustomers = () => {
    fetch('/api/customers').then(r => r.json()).then(setCustomers);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', mobile: '', email: '', city: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingId(c.id);
    setFormData({ name: c.name, mobile: c.mobile, email: c.email || '', city: c.city || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (editingId) {
      await fetch('/api/customers/' + editingId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } else {
      await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    }
    
    setSaving(false);
    setIsModalOpen(false);
    fetchCustomers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer? (This won't delete their orders)")) return;
    await fetch('/api/customers/' + id, { method: 'DELETE' });
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
          <button onClick={openAddModal} className="bg-rose-700 text-white px-6 py-2 rounded font-medium hover:bg-rose-800 shadow-sm">
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
              <th className="p-4">Actions</th>
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
                <td className="p-4 space-x-3">
                  <button onClick={() => openEditModal(c)} className="text-blue-600 hover:underline text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline text-sm font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-stone-500">No customers found.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Customer' : 'Add Manual Customer'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded font-medium">Cancel</button>
                <button disabled={saving} type="submit" className="px-6 py-2 bg-rose-700 text-white rounded font-medium shadow">{saving ? 'Saving...' : 'Save Customer'}</button>
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
  fs.writeFileSync(fullPath, content.trim() + '\n');
}
console.log('Customer Edit logic applied.');
