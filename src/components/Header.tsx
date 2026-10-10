'use client';
import Link from 'next/link';
import Image from 'next/image';
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
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 overflow-hidden rounded-full border border-stone-200 shadow-sm flex items-center justify-center bg-white">
          <Image src="/logo.jpg" alt="Diya Store Logo" width={40} height={40} className="object-cover scale-[1.3]" />
        </div>
        <span className="font-merriweather font-bold text-2xl text-rose-900">Diya Store</span>
      </Link>
      
      <nav className="hidden md:flex gap-6 items-center">
        <Link href="/" className="font-medium hover:text-rose-900">Products</Link>
        
        {isAdmin && (
          <>
            <div className="w-px h-6 bg-stone-300 mx-2"></div>
            <Link href="/admin" className="text-stone-500 hover:text-stone-800 text-sm font-semibold">Admin</Link>
            <button onClick={handleAdminLogout} className="text-rose-600 hover:text-rose-800 text-sm font-bold">Logout</button>
          </>
        )}
      </nav>
      
      <div className="flex gap-4 items-center">
        <Link href="/profile" className="text-stone-700 hover:text-rose-900 transition-colors p-2 rounded-full hover:bg-stone-100" title="My Profile">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </Link>
        <Link href="/cart" className="relative text-stone-800 flex items-center font-bold bg-stone-100 px-4 py-2 rounded-full hover:bg-stone-200 transition-colors">
          🛒 Cart ({itemCount})
        </Link>
      </div>
    </header>
  );
}
