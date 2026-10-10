const fs = require('fs');
const path = require('path');

const files = {
  "src/app/api/auth/logout/route.ts": `
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_token', '', { maxAge: 0, path: '/' });
  return response;
}
  `,

  "src/app/layout.tsx": `
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({ weight: ["300", "400", "700", "900"], subsets: ["latin"], variable: "--font-merriweather" });

export const metadata: Metadata = {
  title: "Premium Diya Store - Light Up Every Moment",
  description: "Discover beautiful diyas that bring warmth, tradition, and elegance.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has('admin_token');

  return (
    <html lang="en">
      <body className={\`\${inter.variable} \${merriweather.variable} antialiased bg-stone-50 text-stone-900 font-sans min-h-screen flex flex-col\`}>
        <CartProvider>
          <Header isAdmin={isAdmin} />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
  `,

  "src/components/Header.tsx": `
'use client';
import Link from 'next/link';
import { useCart } from './CartProvider';

export default function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const { items } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleAdminLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <header className="flex justify-between items-center p-4 md:px-8 border-b border-stone-200 bg-white sticky top-0 z-50">
      <Link href="/" className="font-merriweather font-bold text-2xl text-rose-900">Diya Store</Link>
      
      <nav className="hidden md:flex gap-6 items-center">
        <Link href="/" className="font-medium hover:text-rose-900">Products</Link>
        <Link href="/profile" className="font-medium hover:text-rose-900">Profile</Link>
        
        {isAdmin && (
          <>
            <div className="w-px h-6 bg-stone-300 mx-2"></div>
            <Link href="/admin" className="text-stone-500 hover:text-stone-800 text-sm font-semibold">Admin</Link>
            <button onClick={handleAdminLogout} className="text-rose-600 hover:text-rose-800 text-sm font-bold">Logout</button>
          </>
        )}
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

  "src/app/admin/layout.tsx": `
'use client';
import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#322923] text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-brand-gold" style={{color: '#d4af37'}}>Store Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors">
            Products
          </Link>
          <Link href="/admin/orders" className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors">
            Orders
          </Link>
          <Link href="/admin/customers" className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors">
            Customers
          </Link>
          <Link href="/admin/settings" className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors">
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link href="/" className="block px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            &larr; Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          <button onClick={handleLogout} className="text-sm font-bold text-rose-600 hover:text-rose-800 border border-rose-200 px-4 py-2 rounded transition-colors">
            Logout Session
          </button>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
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
console.log('Admin auth header logic applied.');
