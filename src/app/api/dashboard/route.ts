import { NextResponse } from 'next/server';
import { getOrders, getProducts } from '@/lib/store';
import { getAllDerivedCustomers } from '@/lib/storeCustomers';

export async function GET() {
  const orders = await getOrders();
  const products = await getProducts();
  const customers = await getAllDerivedCustomers();
  
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const activeProducts = products.filter(p => p.status === 'published').length;
  const totalCustomers = customers.length;
  
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    activeProducts,
    totalCustomers,
    recentOrders
  });
}
