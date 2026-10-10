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
      const res = await fetch(`/api/orders/customer/${mobile}`);
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
