'use client';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useRouter } from 'next/navigation';

export default function GlobalCheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '', mobile: '', email: '', address: '', city: '', state: '', pincode: '', notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

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
      
      order.items.forEach((item: any) => {
        text += `- ${item.quantity}x ${item.productName} (${item.productCode}) @ ₹${item.unitPrice}\n`;
      });
      
      text += `\n*Total: ₹${order.total}*\n\nPlease confirm!`;

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
          <span>Total: ₹{cartTotal}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-stone-800">Full Name *</label>
              <input required type="text" name="name" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-stone-800">Mobile Number *</label>
              <input required type="tel" name="mobile" className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" value={formData.mobile} onChange={handleChange} placeholder="+91" />
            </div>
          </div>
          
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
