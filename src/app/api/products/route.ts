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
