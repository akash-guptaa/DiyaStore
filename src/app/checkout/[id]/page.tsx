'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';

function CheckoutForm() {
  const { id } = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) return alert('Please fill all fields');
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: name,
          customerMobile: mobile,
          quantity
        })
      });
      
      const order = await res.json();
      
      // Construct WhatsApp URL
      const text = `Hello! I would like to order from your Diya Store.

Order ID: ${order.id}

Customer Name: ${order.customerName}
Customer Mobile: ${order.customerMobile}

Product Name: ${order.productName}
Product Code: ${order.productCode}
Product ID: ${order.productId}
Quantity: ${order.quantity}
Unit Price: ₹${order.unitPrice}
Total: ₹${order.total}

Please confirm availability and delivery details.`;

      const encodedText = encodeURIComponent(text);
      window.location.href = `https://wa.me/917400422743?text=${encodedText}`;
      
    } catch (err) {
      alert('Failed to place order');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  return (
    <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-merriweather font-bold mb-6 text-center">Complete Your Order</h1>
      
      <div className="bg-stone-50 p-4 rounded mb-6 flex gap-4">
        {product.images?.[0] && <img loading="lazy" src={product.images[0].url} className="w-16 h-16 object-cover rounded" alt={product.images[0].alt || 'Product'} />}
        <div>
          <div className="font-semibold">{product.name}</div>
          <div className="text-sm text-stone-500">{product.productCode}</div>
          <div className="font-bold text-rose-900 mt-1">₹{product.salePrice || product.price}</div>
        </div>
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
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input required type="number" min="1" className="w-full border rounded p-2" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
        </div>
        
        <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>₹{(product.salePrice || product.price) * quantity}</span>
        </div>

        <button disabled={submitting} type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700">
          {submitting ? 'Processing...' : 'Continue to WhatsApp'}
        </button>
        
        <button type="button" onClick={() => router.back()} className="w-full text-stone-500 py-2">
          Cancel
        </button>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8 flex items-center justify-center">
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}