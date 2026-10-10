'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/components/CartProvider';
import { useRouter } from 'next/navigation';

export default function GlobalCheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '', mobile: '', email: '', address: '', city: '', state: '', pincode: '', notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [pastAddresses, setPastAddresses] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('customer_profile');
    if (saved) {
      const data = JSON.parse(saved);
      setFormData(prev => ({ ...prev, name: data.name, mobile: data.mobile }));
      
      fetch('/api/orders/customer/' + data.mobile)
        .then(r => r.json())
        .then(orders => {
          if (orders && orders.length > 0) {
            const uniqueAddrs: any[] = [];
            const seen = new Set();
            
            for (const o of orders) {
              if (o.customerAddress) {
                const key = (o.customerAddress + o.customerCity + o.customerPincode).toLowerCase();
                if (!seen.has(key)) {
                  seen.add(key);
                  uniqueAddrs.push({
                    address: o.customerAddress,
                    city: o.customerCity,
                    state: o.customerState,
                    pincode: o.customerPincode,
                    email: o.customerEmail || ''
                  });
                }
              }
            }
            
            setPastAddresses(uniqueAddrs);
            
            if (uniqueAddrs.length > 0) {
              const last = uniqueAddrs[0];
              setFormData(prev => ({
                ...prev,
                address: prev.address || last.address || '',
                city: prev.city || last.city || '',
                state: prev.state || last.state || '',
                pincode: prev.pincode || last.pincode || '',
                email: prev.email || last.email || ''
              }));
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  if (items.length === 0) return <div className="p-8 text-center">Your cart is empty.</div>;

  const handleChange = (e: any) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.address) return alert('Please fill required fields (Name, Mobile, Address)');
    
    setSubmitting(true);
    try {
      const orderItems = items.map(i => ({
        productId: i.id, productCode: i.code, productName: i.name, unitPrice: i.price, quantity: i.quantity, total: i.price * i.quantity
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name, customerMobile: formData.mobile, customerEmail: formData.email,
          customerAddress: formData.address, customerCity: formData.city, customerState: formData.state,
          customerPincode: formData.pincode, orderNotes: formData.notes,
          items: orderItems
        })
      });
      
      const order = await res.json();
      
      let text = `Hello! I would like to place an order.\n\nOrder ID: ${order.id}\nName: ${order.customerName}\nMobile: ${order.customerMobile}\nAddress: ${order.customerAddress}, ${order.customerCity}, ${order.customerState} - ${order.customerPincode}\nNotes: ${order.orderNotes}\n\n*Items:*\n`;
      
      if (order.items) {
        order.items.forEach((item: any) => {
          text += `- ${item.quantity}x ${item.productName} (${item.productCode}) @ Rs.${item.unitPrice}\n`;
        });
      }
      
      text += `\n*Total: Rs.${order.total}*\n\nPlease confirm!`;

      clearCart();
      window.open(`https://wa.me/917400422743?text=${encodeURIComponent(text)}`, '_blank');
      window.location.href = '/profile';
      
    } catch (err) {
      alert('Failed to place order');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 flex justify-center">
      <div className="max-w-2xl w-full bg-white p-6 md:p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-merriweather font-bold mb-6 text-stone-900 border-b pb-4">Checkout</h1>
        <div className="bg-stone-50 p-4 rounded mb-8 text-stone-700 font-medium flex justify-between border">
          <span>{items.length} item(s)</span>
          <span>Total: Rs.{cartTotal}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-stone-800">Full Name *</label>
              <input required type="text" name="name" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200 bg-stone-50" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-stone-800">Mobile Number *</label>
              <input required type="tel" name="mobile" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200 bg-stone-50" value={formData.mobile} onChange={handleChange} placeholder="+91" />
            </div>
          </div>
          
          {pastAddresses.length > 0 && (
            <div className="mt-8 mb-4 border-t border-stone-200 pt-6">
              <label className="block text-sm font-bold mb-3 text-rose-900 uppercase tracking-wide">Select a Past Address</label>
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                {pastAddresses.map((addr, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setFormData(prev => ({ ...prev, ...addr }))}
                    className="snap-start flex-shrink-0 w-64 border-2 border-stone-200 rounded-lg p-4 cursor-pointer hover:border-rose-500 hover:bg-rose-50 transition-all bg-white shadow-sm"
                  >
                    <p className="font-bold text-stone-800 truncate mb-1">{addr.address}</p>
                    <p className="text-stone-600 text-sm truncate">{addr.city}, {addr.state}</p>
                    <p className="text-stone-500 text-sm">{addr.pincode}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-1 text-stone-800">Email Address (Optional)</label>
            <input type="email" name="email" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" value={formData.email} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-stone-800">Full Address *</label>
            <textarea required name="address" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200 h-20" value={formData.address} onChange={handleChange}></textarea>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-stone-800">City *</label>
              <input required type="text" name="city" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" value={formData.city} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-stone-800">State *</label>
              <input required type="text" name="state" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" value={formData.state} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-stone-800">Pincode *</label>
              <input required type="text" name="pincode" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" value={formData.pincode} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-stone-800">Order Notes / Instructions (Optional)</label>
            <textarea name="notes" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200 h-16" value={formData.notes} onChange={handleChange}></textarea>
          </div>

          <button disabled={submitting} type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition-colors shadow shadow-green-200 text-lg mt-4">
            {submitting ? 'Processing...' : 'Place Order via WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
}
