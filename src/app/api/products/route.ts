import { NextResponse } from 'next/server';
import { getProducts, saveProducts } from '@/lib/store';
import { Product } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeDrafts = searchParams.get('includeDrafts') === 'true';

  let products = await getProducts();

  if (!includeDrafts) {
    products = products.filter(p => p.status === 'published');
  }

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const data = await request.json();
  const products = await getProducts();
  
  if (Array.isArray(data)) {
    const newItems: Product[] = data.map(item => ({
      ...item,
      id: item.id || `prod_${Math.random().toString(36).substr(2, 9)}`,
      productCode: item.productCode || item.code || `DIYA-${Math.floor(100 + Math.random() * 900)}`,
      name: item.name || 'Handcrafted Diya',
      slug: item.slug || (item.name ? item.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '') : `product-${Date.now()}`),
      shortDescription: item.shortDescription || '',
      description: item.description || '',
      price: Number(item.price) || 0,
      salePrice: item.salePrice ? Number(item.salePrice) : null,
      categoryId: item.categoryId || item.category || 'terracotta',
      stockQuantity: Number(item.stockQuantity ?? item.stock) || 10,
      status: item.status || 'published',
      featured: item.featured ?? true,
      images: Array.isArray(item.images) && item.images.length > 0 
        ? item.images 
        : (item.imageUrl || item.image ? [{ url: item.imageUrl || item.image, alt: item.name || 'Product', isMain: true, sortOrder: 0 }] : []),
      specifications: item.specifications || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    products.push(...newItems);
    await saveProducts(products);

    return NextResponse.json({ success: true, count: newItems.length, products: newItems }, { status: 201 });
  }

  const newProduct: Product = {
    ...data,
    id: `prod_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  products.push(newProduct);
  await saveProducts(products);

  return NextResponse.json(newProduct, { status: 201 });
}
