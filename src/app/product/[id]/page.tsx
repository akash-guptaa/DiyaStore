export const dynamic = 'force-dynamic';
import { getProducts } from '@/lib/store';
import { getSettings } from '@/lib/storeSettings';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import ProductGallery from '@/components/ProductGallery';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getProducts();
  const settings = await getSettings();
  
  const product = products.find((p: any) => p.id === id || p.slug === id);

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Product Gallery */}
        <ProductGallery images={product.images || []} autoSlideDelay={settings.autoSlideDelay || 800} />
        
        {/* Right Side: Product Details */}
        <div>
          <div className="text-sm text-stone-500 mb-2 font-mono tracking-wide">{product.productCode}</div>
          <h1 className="text-3xl font-merriweather font-bold mb-4 text-stone-900">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="text-3xl font-bold text-rose-900">₹{product.salePrice || product.price}</div>
            {product.salePrice && (
              <div className="text-lg text-stone-400 line-through">₹{product.price}</div>
            )}
          </div>
          
          <div className="bg-stone-50 p-4 rounded-lg mb-8 border border-stone-100">
            <h3 className="font-semibold text-stone-800 mb-2">Description</h3>
            <p className="text-stone-600 whitespace-pre-wrap text-sm leading-relaxed">{product.description}</p>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}