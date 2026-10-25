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

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const idsToDelete: string[] = Array.isArray(body.ids) ? body.ids : (body.id ? [body.id] : []);
    
    if (idsToDelete.length === 0) {
      return NextResponse.json({ error: 'No order IDs provided' }, { status: 400 });
    }

    const orders = await getOrders();
    const updatedOrders = orders.filter((o) => !idsToDelete.includes(o.id));
    await saveOrders(updatedOrders);

    return NextResponse.json({ success: true, deletedCount: orders.length - updatedOrders.length });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete orders' }, { status: 500 });
  }
}