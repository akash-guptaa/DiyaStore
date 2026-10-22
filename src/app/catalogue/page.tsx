import { getProducts } from '@/lib/store';
import { getSettings } from '@/lib/storeSettings';
import CatalogueViewer from '@/components/CatalogueViewer';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Product Catalogue PDF - Diya Store',
  description: 'Download and browse our official handcrafted Diya Store catalogue in high-resolution PDF format.',
};

export default async function CataloguePage() {
  const products = await getProducts();
  const settings = await getSettings();
  const publishedProducts = products.filter(p => p.status === 'published');

  return <CatalogueViewer products={publishedProducts} settings={settings} />;
}
