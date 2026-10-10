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
  items: OrderItem[];
  total: number;
  status: 'pending_whatsapp_confirmation' | 'confirmed' | 'processing' | 'ready_for_pickup' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
  `,
  "src/components/CartProvider.tsx": `
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  code: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setItems(JSON.parse(saved));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem('cart', JSON.stringify(items));
  }, [items, loaded]);

  const addToCart = (newItem: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === newItem.id);
      if (existing) {
        return prev.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i);
      }
      return [...prev, newItem];
    });
    alert('Added to cart!');
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
  `,
  "src/app/layout.tsx": `
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";

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
          {children}
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

export default function Header() {
  const { items } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="flex justify-between items-center p-4 md:px-8 border-b border-stone-200 bg-white sticky top-0 z-50">
      <Link href="/" className="font-merriweather font-bold text-2xl text-rose-900">Diya Store</Link>
      <nav className="hidden md:flex gap-6">
        <Link href="/" className="hover:text-rose-900">Home</Link>
        <Link href="/admin" className="hover:text-rose-900">Admin</Link>
      </nav>
      <div className="flex gap-4 items-center">
        <Link href="/cart" className="relative text-stone-800 flex items-center font-bold">
          Cart ({itemCount})
        </Link>
      </div>
    </header>
  );
}
  `,
  "src/app/api/orders/route.ts": `
import { NextResponse } from 'next/server';
import { getOrders, saveOrders } from '@/lib/store';
import { Order } from '@/types';

export async function GET(request: Request) {
  const orders = await getOrders();
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const data = await request.json();
  const orders = await getOrders();

  const newOrder: Order = {
    id: \`ord_\${Math.random().toString(36).substr(2, 9)}\`,
    customerName: data.customerName,
    customerMobile: data.customerMobile,
    items: data.items,
    total: data.items.reduce((acc: number, item: any) => acc + item.total, 0),
    status: 'pending_whatsapp_confirmation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  await saveOrders(orders);

  return NextResponse.json(newOrder, { status: 201 });
}
  `,
  "src/components/AddToCartButton.tsx": `
'use client';
import { useCart } from './CartProvider';

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const price = product.salePrice || product.price;

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        addToCart({
          id: product.id,
          name: product.name,
          code: product.productCode,
          price: price,
          quantity: 1,
          image: product.images?.[0]?.url
        });
      }} 
      className="block w-full text-center bg-rose-800 text-white py-2 rounded hover:bg-rose-900 transition-colors text-sm font-semibold mt-auto"
    >
      Add to Cart
    </button>
  );
}
  `,
  "src/app/page.tsx": `
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { getProducts } from '@/lib/store';
import AddToCartButton from '@/components/AddToCartButton';

export default async function Home() {
  const products = await getProducts();
  const publishedProducts = products.filter(p => p.status === 'published');

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-orange-50 py-20 px-4 text-center">
        <h1 className="font-merriweather text-4xl md:text-5xl font-bold mb-4 text-stone-900">Light Up Every Moment.</h1>
        <p className="text-lg md:text-xl text-stone-600 mb-8 max-w-2xl mx-auto">
          Discover beautiful diyas that bring warmth, tradition, and elegance to every celebration.
        </p>
      </section>

      <main className="flex-1 max-w-7xl mx-auto p-4 md:p-8 w-full">
        <h2 className="font-merriweather text-3xl font-bold mb-8 text-center mt-8">Our Collection</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {publishedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <Link href={\`/product/\${product.slug || product.id}\`} className="flex-1">
                <div className="relative aspect-square bg-stone-100">
                  {product.images?.[0] && (
                    <img src={product.images[0].url} alt={product.images[0].alt} className="object-cover w-full h-full" />
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-stone-500 mb-1">{product.productCode}</div>
                  <h3 className="font-semibold text-stone-900 mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">₹{product.salePrice || product.price}</span>
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4">
                <AddToCartButton product={product} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
  `,
  "src/app/product/[id]/page.tsx": `
export const dynamic = 'force-dynamic';
import { getProducts } from '@/lib/store';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find(p => p.id === id || p.slug === id);

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden">
          {product.images?.[0] && <img src={product.images[0].url} className="w-full h-full object-cover" />}
        </div>
        <div>
          <div className="text-sm text-stone-500 mb-2">Code: {product.productCode}</div>
          <h1 className="text-3xl font-merriweather font-bold mb-4">{product.name}</h1>
          <div className="text-2xl font-bold text-rose-900 mb-6">₹{product.salePrice || product.price}</div>
          <p className="text-stone-600 mb-8 whitespace-pre-wrap">{product.description}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
  `,
  "src/app/cart/page.tsx": `
'use client';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/" className="text-rose-700 underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8 space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-4">
            <div className="flex items-center gap-4 flex-1">
              {item.image && <img src={item.image} className="w-16 h-16 object-cover rounded" />}
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-stone-500">₹{item.price}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-stone-100 rounded">-</button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-stone-100 rounded">+</button>
            </div>
            <div className="font-bold w-20 text-right">₹{item.price * item.quantity}</div>
            <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm ml-2">X</button>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
        <div className="text-xl font-bold">Total: ₹{cartTotal}</div>
        <Link href="/checkout" className="bg-green-600 text-white px-8 py-3 rounded hover:bg-green-700 font-bold">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
  `,
  "src/app/checkout/page.tsx": `
'use client';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useRouter } from 'next/navigation';

export default function GlobalCheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return <div className="p-8 text-center">Your cart is empty.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) return alert('Please fill all fields');
    
    setSubmitting(true);
    try {
      const orderItems = items.map(i => ({
        productId: i.id,
        productCode: i.code,
        productName: i.name,
        unitPrice: i.price,
        quantity: i.quantity,
        total: i.price * i.quantity
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerMobile: mobile,
          items: orderItems
        })
      });
      
      const order = await res.json();
      
      let text = \`Hello! I would like to place an order.\\n\\nOrder ID: \${order.id}\\nName: \${order.customerName}\\nMobile: \${order.customerMobile}\\n\\n*Items:*\\n\`;
      
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
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-merriweather font-bold mb-6">Complete Order</h1>
        <div className="bg-stone-50 p-4 rounded mb-6 text-sm text-stone-600">
          Ordering {items.length} item(s) for a total of ₹{cartTotal}.
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input required type="text" className="w-full border rounded p-2" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile Number</label>
            <input required type="tel" className="w-full border rounded p-2" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+91" />
          </div>
          <button disabled={submitting} type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700">
            {submitting ? 'Processing...' : 'Send Order to WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
}
  `,
  "src/app/admin/orders/page.tsx": `
'use client';
import { useState, useEffect } from 'react';
import { Order } from '@/types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(setOrders);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <table className="w-full bg-white rounded shadow text-left">
        <thead>
          <tr className="bg-stone-50 border-b">
            <th className="p-4">ID</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Items</th>
            <th className="p-4">Total</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-b">
              <td className="p-4 text-sm text-stone-500">{o.id}</td>
              <td className="p-4">
                <div>{o.customerName}</div>
                <div className="text-sm text-stone-500">{o.customerMobile}</div>
              </td>
              <td className="p-4">
                {o.items?.map((i, idx) => (
                  <div key={idx} className="text-sm">
                    {i.quantity}x {i.productName}
                  </div>
                ))}
              </td>
              <td className="p-4 font-bold">₹{o.total}</td>
              <td className="p-4 text-sm">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
console.log('Cart update applied.');
