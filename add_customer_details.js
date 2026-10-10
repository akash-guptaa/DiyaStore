const fs = require('fs');
const path = require('path');

const typesContent = `
export interface ProductImage {
  url: string;
  alt: string;
  isMain: boolean;
  sortOrder: number;
}

export interface Product {
  id: string; // e.g. prod_8f32a1
  productCode: string; // e.g. DIYA-0001
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
  id: string; // e.g. ord_xyz123
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
  status: 'pending_whatsapp_confirmation' | 'confirmed' | 'delivered' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
`;

const files = {
  "src/types/index.ts": typesContent,

  "src/app/checkout/page.tsx": `
'use client';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useRouter } from 'next/navigation';

export default function GlobalCheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '', mobile: '', email: '', address: '', city: '', state: '', pincode: '', notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) return <div className="p-8 text-center">Your cart is empty.</div>;

  const handleChange = (e: any) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.address) return alert('Please fill required fields (Name, Mobile, Address)');
    
    setSubmitting(true);
    try {
      const orderItems = items.map(i => ({
        productId: i.id, productCode: i.code, productName: i.name, unitPrice: i.price, quantity: i.quantity, total: i.price * i.quantity
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name, customerMobile: formData.mobile, customerEmail: formData.email,
          customerAddress: formData.address, customerCity: formData.city, customerState: formData.state,
          customerPincode: formData.pincode, orderNotes: formData.notes,
          items: orderItems
        })
      });
      
      const order = await res.json();
      
      let text = \`Hello! I would like to place an order.\\n\\nOrder ID: \${order.id}\\nName: \${order.customerName}\\nMobile: \${order.customerMobile}\\nAddress: \${order.customerAddress}, \${order.customerCity}, \${order.customerState} - \${order.customerPincode}\\nNotes: \${order.orderNotes}\\n\\n*Items:*\\n\`;
      
      order.items.forEach((item: any) => {
        text += \`- \${item.quantity}x \${item.productName} (\${item.productCode}) @ ₹\${item.unitPrice}\\n\`;
      });
      
      text += \`\\n*Total: ₹\${order.total}*\\n\\nPlease confirm!\`;

      clearCart();
      window.location.href = \`https://wa.me/917400422743?text=\${encodeURIComponent(text)}\`;
      
    } catch (err) {
      alert('Failed to place order');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 flex justify-center">
      <div className="max-w-2xl w-full bg-white p-6 md:p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-merriweather font-bold mb-6 text-stone-900 border-b pb-4">Checkout</h1>
        <div className="bg-stone-50 p-4 rounded mb-8 text-stone-700 font-medium flex justify-between border">
          <span>{items.length} item(s)</span>
          <span>Total: ₹{cartTotal}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-stone-800">Full Name *</label>
              <input required type="text" name="name" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-stone-800">Mobile Number *</label>
              <input required type="tel" name="mobile" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" value={formData.mobile} onChange={handleChange} placeholder="+91" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-1 text-stone-800">Email Address (Optional)</label>
            <input type="email" name="email" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" value={formData.email} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-stone-800">Full Address *</label>
            <textarea required name="address" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200 h-20" value={formData.address} onChange={handleChange}></textarea>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-stone-800">City *</label>
              <input required type="text" name="city" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" value={formData.city} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-stone-800">State *</label>
              <input required type="text" name="state" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" value={formData.state} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-stone-800">Pincode *</label>
              <input required type="text" name="pincode" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" value={formData.pincode} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-stone-800">Order Notes / Instructions (Optional)</label>
            <textarea name="notes" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200 h-16" value={formData.notes} onChange={handleChange}></textarea>
          </div>

          <button disabled={submitting} type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition-colors shadow shadow-green-200 text-lg mt-4">
            {submitting ? 'Processing...' : 'Place Order via WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
}
  `,

  "src/app/api/orders/[id]/route.ts": `
import { NextResponse } from 'next/server';
import { getOrders, saveOrders } from '@/lib/store';
import { Order } from '@/types';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const orders = await getOrders();
  
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updatedOrder: Order = {
    ...orders[index],
    status: data.status,
    updatedAt: new Date().toISOString(),
  };

  orders[index] = updatedOrder;
  await saveOrders(orders);

  return NextResponse.json(updatedOrder);
}
  `,

  "src/app/admin/orders/page.tsx": `
'use client';
import { useState, useEffect } from 'react';
import { Order } from '@/types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  useEffect(() => {
    fetch('/api/orders').then(r => r.json()).then(setOrders);
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    await fetch(\`/api/orders/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
    setLoadingId(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow text-left min-w-max">
          <thead>
            <tr className="bg-stone-100 border-b">
              <th className="p-4 text-stone-600 font-semibold">ID</th>
              <th className="p-4 text-stone-600 font-semibold">Customer</th>
              <th className="p-4 text-stone-600 font-semibold">Items</th>
              <th className="p-4 text-stone-600 font-semibold">Total</th>
              <th className="p-4 text-stone-600 font-semibold">Status Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b hover:bg-stone-50">
                <td className="p-4 text-sm text-stone-500 font-mono">{o.id}</td>
                <td className="p-4">
                  <div className="font-bold text-stone-800">{o.customerName}</div>
                  <div className="text-sm text-stone-600">{o.customerMobile}</div>
                  {o.customerCity && <div className="text-xs text-stone-400 mt-1">{o.customerCity}, {o.customerState}</div>}
                </td>
                <td className="p-4">
                  {o.items?.map((i, idx) => (
                    <div key={idx} className="text-sm bg-stone-100 px-2 py-1 rounded inline-block m-1 border">
                      {i.quantity}x {i.productName}
                    </div>
                  ))}
                </td>
                <td className="p-4 font-bold text-rose-900">₹{o.total}</td>
                <td className="p-4">
                  <select 
                    disabled={loadingId === o.id}
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="border rounded p-2 text-sm bg-white shadow-sm"
                  >
                    <option value="pending_whatsapp_confirmation">Pending WhatsApp</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-stone-500">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
  `,

  "src/app/admin/customers/page.tsx": `
'use client';
import { useState, useEffect } from 'react';
import { Order } from '@/types';
import Link from 'next/link';

export default function AdminCustomers() {
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    fetch('/api/orders').then(r => r.json()).then(setOrders);
  }, []);

  // Extract unique customers based on mobile number
  const customersMap = new Map();
  orders.forEach(o => {
    if (!customersMap.has(o.customerMobile)) {
      customersMap.set(o.customerMobile, {
        name: o.customerName,
        mobile: o.customerMobile,
        email: o.customerEmail,
        city: o.customerCity,
        totalSpent: 0,
        orderCount: 0,
        lastOrder: o.createdAt
      });
    }
    const c = customersMap.get(o.customerMobile);
    c.totalSpent += o.total;
    c.orderCount += 1;
    if (new Date(o.createdAt) > new Date(c.lastOrder)) c.lastOrder = o.createdAt;
  });

  const customers = Array.from(customersMap.values());

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Customer List</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow text-left min-w-max">
          <thead>
            <tr className="bg-stone-100 border-b">
              <th className="p-4 text-stone-600 font-semibold">Name</th>
              <th className="p-4 text-stone-600 font-semibold">Mobile</th>
              <th className="p-4 text-stone-600 font-semibold">Location</th>
              <th className="p-4 text-stone-600 font-semibold">Orders</th>
              <th className="p-4 text-stone-600 font-semibold">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c: any) => (
              <tr key={c.mobile} className="border-b hover:bg-stone-50">
                <td className="p-4 font-bold text-stone-800">{c.name}</td>
                <td className="p-4 text-stone-600">
                  <a href={\`https://wa.me/\${c.mobile.replace('+', '')}\`} target="_blank" className="text-green-600 underline">
                    {c.mobile}
                  </a>
                </td>
                <td className="p-4 text-stone-600">{c.city || 'N/A'}</td>
                <td className="p-4 text-stone-600">
                  <span className="font-bold">{c.orderCount}</span>
                </td>
                <td className="p-4 font-bold text-rose-900">₹{c.totalSpent}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-stone-500">No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
  `,
  
  "src/app/admin/page.tsx": `
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-stone-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/products" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-stone-200">
            <h2 className="text-xl font-semibold mb-2 text-stone-800">Products</h2>
            <p className="text-stone-500 text-sm">Manage your product catalog, add new diyas, and update prices.</p>
          </Link>
          <Link href="/admin/orders" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-stone-200">
            <h2 className="text-xl font-semibold mb-2 text-stone-800">Orders</h2>
            <p className="text-stone-500 text-sm">View WhatsApp orders, update statuses, and manage workflow.</p>
          </Link>
          <Link href="/admin/customers" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-stone-200">
            <h2 className="text-xl font-semibold mb-2 text-stone-800">Customers</h2>
            <p className="text-stone-500 text-sm">View customer list, interlink details, and see lifetime value.</p>
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
console.log('Customer update applied.');
