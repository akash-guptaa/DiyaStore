import { NextResponse } from 'next/server';
import { getOrders, saveOrders } from '@/lib/store';
import { Order } from '@/types';

export async function GET(request: Request) {
  const orders = await getOrders();
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const data = await request.json();
  const orders = await getOrders();

  const newOrder: Order = {
    id: `ord_${Math.random().toString(36).substr(2, 9)}`,
    customerName: data.customerName,
    customerMobile: data.customerMobile,
    customerEmail: data.customerEmail,
    customerAddress: data.customerAddress,
    customerCity: data.customerCity,
    customerState: data.customerState,
    customerPincode: data.customerPincode,
    orderNotes: data.orderNotes,
    items: data.items,
    total: data.items.reduce((acc: number, item: any) => acc + item.total, 0),
    status: 'pending_whatsapp_confirmation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  await saveOrders(orders);

  return NextResponse.json(newOrder, { status: 201 });
}