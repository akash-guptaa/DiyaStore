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