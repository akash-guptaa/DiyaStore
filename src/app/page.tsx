export const dynamic = 'force-dynamic';
import { getProducts } from '@/lib/store';
import { getSettings } from '@/lib/storeSettings';
import BannerCarousel from '@/components/BannerCarousel';
import ProductCollection from '@/components/ProductCollection';

export default async function Home() {
  const products = await getProducts();
  const settings = await getSettings();
  const publishedProducts = products.filter(p => p.status === 'published');

  return (
    <div className="flex flex-col min-h-screen">
      <BannerCarousel headline={settings.heroHeadline} subtitle={settings.heroSubtitle} />

      <main id="collection" className="flex-1 max-w-7xl mx-auto p-4 md:p-8 w-full scroll-mt-20">
        <h2 className="font-merriweather text-3xl font-bold mb-6 text-center mt-6 text-stone-900">Our Collection</h2>
        <ProductCollection products={publishedProducts} />
      </main>
    </div>
  );
}
