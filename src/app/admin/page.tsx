'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/orders" className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 hover:shadow-md transition">
          <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">Total Revenue</p>
          <div className="text-3xl font-bold text-rose-900">
            {loading ? '...' : `₹${data?.totalRevenue || 0}`}
          </div>
        </Link>
        <Link href="/admin/orders" className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 hover:shadow-md transition">
          <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">Total Orders</p>
          <div className="text-3xl font-bold text-stone-800">
            {loading ? '...' : data?.totalOrders || 0}
          </div>
        </Link>
        <Link href="/admin/customers" className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 hover:shadow-md transition">
          <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">Customers</p>
          <div className="text-3xl font-bold text-stone-800">
            {loading ? '...' : data?.totalCustomers || 0}
          </div>
        </Link>
        <Link href="/admin/products" className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 hover:shadow-md transition">
          <p className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-1">Active Products</p>
          <div className="text-3xl font-bold text-stone-800">
            {loading ? '...' : data?.activeProducts || 0}
          </div>
        </Link>
      </div>

      {/* Reports Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-stone-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-blue-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          {loading ? (
            <div className="text-stone-500 py-4">Loading reports...</div>
          ) : data?.recentOrders?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-sm text-stone-500">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((o: any) => (
                    <tr key={o.id} className="border-b last:border-0 hover:bg-stone-50">
                      <td className="py-3 text-sm font-mono text-stone-500">{o.id}</td>
                      <td className="py-3 font-medium">{o.customerName}</td>
                      <td className="py-3">
                        <span className="bg-stone-100 px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider text-stone-700">
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-rose-900">₹{o.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-stone-500 py-4">No recent orders found.</div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="space-y-3">
            <Link href="/admin/products" className="block p-4 rounded bg-stone-50 hover:bg-stone-100 border transition">
              <div className="font-semibold text-stone-800">Add New Product</div>
              <div className="text-xs text-stone-500 mt-1">Upload diyas and set prices</div>
            </Link>
            <Link href="/admin/settings" className="block p-4 rounded bg-stone-50 hover:bg-stone-100 border transition">
              <div className="font-semibold text-stone-800">Store Settings</div>
              <div className="text-xs text-stone-500 mt-1">Update phone numbers & layout</div>
            </Link>
            <Link href="/" className="block p-4 rounded bg-stone-50 hover:bg-stone-100 border transition" target="_blank">
              <div className="font-semibold text-stone-800">View Storefront</div>
              <div className="text-xs text-stone-500 mt-1">See how customers view the shop</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
