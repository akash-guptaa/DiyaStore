'use client';
import { useState, useEffect, useMemo } from 'react';
import { Order } from '@/types';
import Link from 'next/link';
import Pagination from '@/components/Pagination';

export default function ProfilePage() {
  const [customer, setCustomer] = useState<{name: string, mobile: string} | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [inputName, setInputName] = useState('');
  const [inputMobile, setInputMobile] = useState('');

  // Pagination for user orders
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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
      setOrders(Array.isArray(data) ? data : []);
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

  const totalPages = Math.ceil(orders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return orders.slice(start, start + itemsPerPage);
  }, [orders, currentPage, itemsPerPage]);

  if (loading) return <div className="p-8 text-center min-h-[50vh]">Loading profile...</div>;

  if (!customer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4 bg-stone-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-stone-200">
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
            <button type="submit" className="w-full bg-rose-800 text-white font-bold py-3 rounded hover:bg-rose-900 mt-4 shadow-sm">
              Access My Orders
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-2xs flex justify-between items-center border border-stone-200">
          <div>
            <h1 className="text-2xl font-bold font-merriweather">Welcome, {customer.name}</h1>
            <p className="text-stone-500 font-mono text-sm">{customer.mobile}</p>
          </div>
          <button onClick={handleLogout} className="bg-stone-100 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-200 font-medium text-sm transition-colors border border-stone-300">
            Logout
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-merriweather text-stone-800">Your Orders ({orders.length})</h2>
          </div>
          
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-2xs text-center border border-stone-200">
              <p className="text-stone-500 mb-4">You haven't placed any orders with this number yet.</p>
              <Link href="/" className="bg-rose-800 text-white px-6 py-2.5 rounded-lg font-medium inline-block hover:bg-rose-900 shadow-sm transition-colors">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-4">
                {paginatedOrders.map(o => (
                  <div key={o.id} className="bg-white p-6 rounded-xl shadow-2xs border border-stone-200 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">#{o.id}</span>
                        <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mb-3">
                        Placed on {new Date(o.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="space-y-1.5">
                        {(o.items || [{ productName: o.productName, quantity: o.quantity }]).map((i: any, idx: number) => (
                          <div key={idx} className="text-xs font-medium text-stone-700 bg-stone-50 border border-stone-100 px-2.5 py-1 rounded inline-block mr-2 mb-1">
                            {i.quantity}x {i.productName}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between items-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                      <div className="font-bold text-2xl text-rose-900">₹{o.total}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination controls */}
              {orders.length > itemsPerPage && (
                <div className="bg-white rounded-xl border border-stone-200 p-2 shadow-2xs">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={orders.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
                    pageSizeOptions={[5, 10, 20]}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
