export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { getProducts } from '@/lib/store';
import { getSettings } from '@/lib/storeSettings';
import AddToCartButton from '@/components/AddToCartButton';

export default async function Home() {
  const products = await getProducts();
  const settings = await getSettings();
  const publishedProducts = products.filter(p => p.status === 'published');

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-orange-50 py-20 px-4 text-center">
        <h1 className="font-merriweather text-4xl md:text-5xl font-bold mb-4 text-stone-900">{settings.heroHeadline}</h1>
        <p className="text-lg md:text-xl text-stone-600 mb-8 max-w-2xl mx-auto">{settings.heroSubtitle}</p>
      </section>

      <main className="flex-1 max-w-7xl mx-auto p-4 md:p-8 w-full">
        <h2 className="font-merriweather text-3xl font-bold mb-8 text-center mt-8">Our Collection</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {publishedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <Link href={`/product/${product.slug || product.id}`} className="flex-1">
                <div className="relative aspect-square bg-stone-100">
                  {product.images?.[0] && (
                    <img src={product.images[0].url} alt={product.images[0].alt} className="object-cover w-full h-full" />
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-stone-500 mb-1">{product.productCode}</div>
                  <h3 className="font-semibold text-stone-900 mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">₹{product.salePrice || product.price}</span>
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4">
                <AddToCartButton product={product} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}