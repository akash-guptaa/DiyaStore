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
              {item.image && <img loading="lazy" src={item.image} className="w-16 h-16 object-cover rounded" />}
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
