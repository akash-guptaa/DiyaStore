import { NextResponse } from 'next/server';
import { getOrders, saveOrders } from '@/lib/store';
import { Order } from '@/types';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const orders = await getOrders();
  
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updatedOrder: Order = {
    ...orders[index],
    status: data.status,
    updatedAt: new Date().toISOString(),
  };

  orders[index] = updatedOrder;
  await saveOrders(orders);

  return NextResponse.json(updatedOrder);
}