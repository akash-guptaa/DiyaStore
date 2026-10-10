import { NextResponse } from 'next/server';
import { getProducts, saveProducts } from '@/lib/store';
import { Product } from '@/types';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.id === id || p.slug === id);
  
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const products = await getProducts();
  
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const updatedProduct: Product = {
    ...products[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  products[index] = updatedProduct;
  await saveProducts(products);

  return NextResponse.json(updatedProduct);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await getProducts();
  
  const updatedProducts = products.filter((p) => p.id !== id);
  await saveProducts(updatedProducts);

  return new NextResponse(null, { status: 204 });
}