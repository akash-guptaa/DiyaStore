'use client';
import { useCart } from './CartProvider';

export default function AddToCartButton({ product }: { product: any }) {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const price = product.salePrice || product.price;

  const cartItem = items.find(i => i.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  if (quantity > 0) {
    return (
      <div className="flex items-center justify-between bg-stone-100 rounded border border-stone-200 mt-auto overflow-hidden w-full h-9">
        <button 
          onClick={(e) => {
            e.preventDefault();
            if (quantity === 1) removeFromCart(product.id);
            else updateQuantity(product.id, quantity - 1);
          }}
          className="flex-1 flex items-center justify-center h-full text-stone-600 hover:bg-stone-200 hover:text-rose-700 font-bold text-lg transition-colors"
        >
          -
        </button>
        <span className="font-bold text-sm text-stone-800 px-2 min-w-[80px] text-center">
          {quantity} added
        </span>
        <button 
          onClick={(e) => {
            e.preventDefault();
            updateQuantity(product.id, quantity + 1);
          }}
          className="flex-1 flex items-center justify-center h-full text-stone-600 hover:bg-stone-200 hover:text-green-700 font-bold text-lg transition-colors"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        addToCart({
          id: product.id,
          name: product.name,
          code: product.productCode,
          price: price,
          quantity: 1,
          image: product.images?.[0]?.url
        });
      }} 
      className="block w-full h-9 text-center bg-rose-800 text-white rounded hover:bg-rose-900 transition-colors text-sm font-semibold mt-auto"
    >
      Add to Cart
    </button>
  );
}
