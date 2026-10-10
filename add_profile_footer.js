const fs = require('fs');
const path = require('path');

const files = {
  "src/app/api/orders/customer/[mobile]/route.ts": `
import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/store';

export async function GET(request: Request, { params }: { params: Promise<{ mobile: string }> }) {
  const { mobile } = await params;
  const orders = await getOrders();
  
  // Clean input mobile just in case
  const cleanMobile = mobile.replace(/[^0-9]/g, '');
  
  const customerOrders = orders.filter(o => o.customerMobile.replace(/[^0-9]/g, '') === cleanMobile);
  customerOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return NextResponse.json(customerOrders);
}
  `,

  "src/app/profile/page.tsx": `
'use client';
import { useState, useEffect } from 'react';
import { Order } from '@/types';
import Link from 'next/link';

export default function ProfilePage() {
  const [customer, setCustomer] = useState<{name: string, mobile: string} | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [inputName, setInputName] = useState('');
  const [inputMobile, setInputMobile] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('customer_profile');
    if (saved) {
      const data = JSON.parse(saved);
      setCustomer(data);
      fetchCustomerOrders(data.mobile);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCustomerOrders = async (mobile: string) => {
    try {
      const res = await fetch(\`/api/orders/customer/\${mobile}\`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name: inputName, mobile: inputMobile };
    localStorage.setItem('customer_profile', JSON.stringify(data));
    setCustomer(data);
    setLoading(true);
    fetchCustomerOrders(data.mobile);
  };

  const handleLogout = () => {
    localStorage.removeItem('customer_profile');
    setCustomer(null);
    setOrders([]);
  };

  if (loading) return <div className="p-8 text-center min-h-[50vh]">Loading profile...</div>;

  if (!customer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4 bg-stone-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-merriweather font-bold mb-6 text-center text-rose-900">Customer Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Full Name</label>
              <input required type="text" className="w-full border rounded p-2 focus:ring focus:ring-rose-200" value={inputName} onChange={e => setInputName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Mobile Number</label>
              <input required type="tel" className="w-full border rounded p-2 focus:ring focus:ring-rose-200" value={inputMobile} onChange={e => setInputMobile(e.target.value)} placeholder="Enter the number used for orders" />
            </div>
            <button type="submit" className="w-full bg-rose-800 text-white font-bold py-3 rounded hover:bg-rose-900 mt-4">
              Access My Orders
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center mb-8 border border-stone-200">
          <div>
            <h1 className="text-2xl font-bold font-merriweather">Welcome, {customer.name}</h1>
            <p className="text-stone-500">{customer.mobile}</p>
          </div>
          <button onClick={handleLogout} className="bg-stone-200 text-stone-800 px-4 py-2 rounded hover:bg-stone-300 font-medium">
            Logout
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4 font-merriweather text-stone-800">Your Last Orders</h2>
        
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-stone-200">
            <p className="text-stone-500 mb-4">You haven't placed any orders with this number yet.</p>
            <Link href="/" className="bg-rose-700 text-white px-6 py-2 rounded font-medium inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-stone-500">{o.id}</span>
                    <span className="bg-stone-100 text-stone-800 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{o.status.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-sm text-stone-600 mb-2">
                    {new Date(o.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="space-y-1">
                    {o.items.map((i, idx) => (
                      <div key={idx} className="text-sm font-medium">
                        {i.quantity}x {i.productName}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between">
                  <div className="font-bold text-xl text-rose-900">₹{o.total}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
  `,

  "src/components/Header.tsx": `
'use client';
import Link from 'next/link';
import { useCart } from './CartProvider';

export default function Header() {
  const { items } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="flex justify-between items-center p-4 md:px-8 border-b border-stone-200 bg-white sticky top-0 z-50">
      <Link href="/" className="font-merriweather font-bold text-2xl text-rose-900">Diya Store</Link>
      
      <nav className="hidden md:flex gap-6 items-center">
        <Link href="/" className="font-medium hover:text-rose-900">Products</Link>
        <Link href="/profile" className="font-medium hover:text-rose-900">Profile</Link>
        
        <div className="w-px h-6 bg-stone-300 mx-2"></div>
        
        <Link href="/admin" className="text-stone-500 hover:text-stone-800 text-sm">Admin</Link>
      </nav>
      
      <div className="flex gap-4 items-center">
        <Link href="/cart" className="relative text-stone-800 flex items-center font-bold bg-stone-100 px-4 py-2 rounded-full hover:bg-stone-200 transition-colors">
          🛒 Cart ({itemCount})
        </Link>
      </div>
    </header>
  );
}
  `,
  
  "src/components/Footer.tsx": `
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-200 pt-16 pb-8 border-t-4 border-rose-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h3 className="font-merriweather text-2xl font-bold text-white mb-4">Diya Store</h3>
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
              <span className="text-stone-400 text-sm">
                Shop No. 1, Girnar Dharshan, Narayan Nagar Road, Bhayandar West, Maharashtra – 401101, India. (5-min walk from station)
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-rose-500">📞</span>
              <span className="text-stone-400 text-sm">+91 7400422743 / +91 9322274986</span>
            </li>
            <li className="mt-4">
              <a 
                href="https://maps.app.goo.gl/RKAF5cEqpZuYQtny9?g_st=aw" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-stone-800 text-white px-4 py-2 rounded hover:bg-rose-900 transition-colors text-sm font-semibold border border-stone-700"
              >
                🗺️ Open in Google Maps
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-stone-800 pt-8 text-center text-sm text-stone-500">
        &copy; {new Date().getFullYear()} Diya Store. All rights reserved.
      </div>
    </footer>
  );
}
  `,

  "src/app/layout.tsx": `
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({ weight: ["300", "400", "700", "900"], subsets: ["latin"], variable: "--font-merriweather" });

export const metadata: Metadata = {
  title: "Premium Diya Store - Light Up Every Moment",
  description: "Discover beautiful diyas that bring warmth, tradition, and elegance.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={\`\${inter.variable} \${merriweather.variable} antialiased bg-stone-50 text-stone-900 font-sans min-h-screen flex flex-col\`}>
        <CartProvider>
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
  `
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
}
console.log('Profile and Footer added.');
