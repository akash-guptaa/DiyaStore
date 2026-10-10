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
  status: 'pending_whatsapp_confirmation' | 'confirmed' | 'collect_from_shop' | 'delivered' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
  `,

  "src/app/login/page.tsx": `
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        window.location.href = '/admin'; // Force full refresh to clear middleware cache
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-merriweather font-bold text-rose-900">Diya Store</h1>
          <p className="text-stone-500 mt-2">Admin Login</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-stone-800">Email Address</label>
            <input 
              required type="email" 
              className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" 
              value={email} onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-stone-800">Password</label>
            <input 
              required type="password" 
              className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" 
              value={password} onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-rose-800 text-white font-bold py-3 rounded hover:bg-rose-900 transition-colors mt-4"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
  `,

  "src/app/api/auth/route.ts": `
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  
  // Hardcoded for demo purposes
  if (data.email === 'admin@diyashop.com' && data.password === 'Passwd@123') {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return response;
  }
  
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
  `,

  "src/middleware.ts": `
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token');
  
  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || token.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Allow them to logout easily by unsetting the token
  if (request.nextUrl.pathname === '/logout') {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('admin_token');
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/logout'],
};
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
      <nav className="hidden md:flex gap-6">
        <Link href="/" className="hover:text-rose-900">Home</Link>
        <Link href="/admin" className="hover:text-rose-900">Admin</Link>
        <Link href="/logout" className="text-stone-400 hover:text-stone-600 text-sm flex items-center ml-4">Logout</Link>
      </nav>
      <div className="flex gap-4 items-center">
        <Link href="/cart" className="relative text-stone-800 flex items-center font-bold">
          Cart ({itemCount})
        </Link>
      </div>
    </header>
  );
}
  `
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
}
console.log('Admin Auth applied.');
