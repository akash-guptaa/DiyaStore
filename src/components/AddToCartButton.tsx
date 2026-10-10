'use client';
import { useCart } from './CartProvider';

export default function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const price = product.salePrice || product.price;

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
      className="block w-full text-center bg-rose-800 text-white py-2 rounded hover:bg-rose-900 transition-colors text-sm font-semibold mt-auto"
    >
      Add to Cart
    </button>
  );
}