import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/store';

export async function GET(request: Request, { params }: { params: Promise<{ mobile: string }> }) {
  const { mobile } = await params;
  const orders = await getOrders();
  
  // Clean input mobile just in case
  const cleanMobile = mobile.replace(/[^0-9]/g, '');
  
  const customerOrders = orders.filter(o => o.customerMobile.replace(/[^0-9]/g, '') === cleanMobile);
  customerOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return NextResponse.json(customerOrders);
}