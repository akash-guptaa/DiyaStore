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
    await fetch('/api/orders/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
    setLoadingId(null);
  };

  
  const exportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Mobile', 'Total Amount', 'Status', 'Date'];
    const rows = orders.map(o => [o.id, o.customerName, o.customerMobile, o.total, o.status, new Date(o.createdAt || Date.now()).toLocaleDateString()]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNotifyWhatsApp = (order: Order) => {
    let message = '';
    const cleanMobile = order.customerMobile.replace(/[^0-9]/g, '');

    switch (order.status) {
      case 'pending_whatsapp_confirmation':
        message = 'Hello ' + order.customerName + ', we have received your order #' + order.id + ' for ₹' + order.total + '. We will confirm it shortly!';
        break;
      case 'confirmed':
        message = 'Hello ' + order.customerName + ', your order #' + order.id + ' for ₹' + order.total + ' is confirmed! We are preparing it for you.';
        break;
      case 'collect_from_shop':
        message = 'Hello ' + order.customerName + ', your order #' + order.id + ' is ready to collect from our shop! Please visit us during working hours.';
        break;
      case 'delivered':
        message = 'Hello ' + order.customerName + ', your order #' + order.id + ' has been delivered. Thank you for shopping with Diya Store!';
        break;
      case 'completed':
        message = 'Hello ' + order.customerName + ', your order #' + order.id + ' is now complete. We hope you love your products!';
        break;
      case 'cancelled':
        message = 'Hello ' + order.customerName + ', unfortunately your order #' + order.id + ' has been cancelled. Please let us know if you need any help.';
        break;
      default:
        message = 'Hello ' + order.customerName + ', regarding your order #' + order.id + ' for ₹' + order.total + '.';
    }

    const whatsappUrl = 'https://wa.me/' + cleanMobile + '?text=' + encodeURIComponent(message);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">\n        <h1 className="text-2xl font-bold">Orders</h1>
        <button onClick={exportCSV} className="bg-stone-200 text-stone-800 px-4 py-2 rounded font-medium hover:bg-stone-300">Download CSV</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow text-left min-w-max">
          <thead>
            <tr className="bg-stone-100 border-b">
              <th className="p-4 text-stone-600 font-semibold">ID</th>
              <th className="p-4 text-stone-600 font-semibold">Customer</th>
              <th className="p-4 text-stone-600 font-semibold">Items</th>
              <th className="p-4 text-stone-600 font-semibold">Total</th>
              <th className="p-4 text-stone-600 font-semibold">Status & Notify</th>
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
                  {(o.items || [{ productName: o.productName, quantity: o.quantity }]).map((i: any, idx: number) => (
                    <div key={idx} className="text-sm bg-stone-100 px-2 py-1 rounded inline-block m-1 border">
                      {i.quantity}x {i.productName}
                    </div>
                  ))}
                </td>
                <td className="p-4 font-bold text-rose-900">₹{o.total}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-2 max-w-[200px]">
                    <select 
                      disabled={loadingId === o.id}
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="border rounded p-2 text-sm bg-white shadow-sm w-full"
                    >
                      <option value="pending_whatsapp_confirmation">Pending WhatsApp</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="collect_from_shop">Collect from shop</option>
                      <option value="delivered">Delivered</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <button 
                      onClick={() => handleNotifyWhatsApp(o)}
                      className="bg-green-500 text-white text-xs py-1.5 px-3 rounded hover:bg-green-600 transition-colors flex items-center justify-center gap-1 shadow-sm font-semibold"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      Notify via WhatsApp
                    </button>
                  </div>
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
