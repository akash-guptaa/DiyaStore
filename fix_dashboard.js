const fs = require('fs');

let dashboardRoute = `
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
`;

fs.writeFileSync('src/app/api/dashboard/route.ts', dashboardRoute.trim() + '\n');

let customersRoute = `
import { NextResponse } from 'next/server';
import { getCustomers, saveCustomers, getAllDerivedCustomers } from '@/lib/storeCustomers';
import { Customer } from '@/types';

export async function GET() {
  const customers = await getAllDerivedCustomers();
  return NextResponse.json(customers);
}

export async function POST(request: Request) {
  const data = await request.json();
  const manualCustomers = await getCustomers();
  
  const newCustomer: Customer = {
    id: \`cust_\${Math.random().toString(36).substr(2, 9)}\`,
    name: data.name,
    mobile: data.mobile,
    email: data.email || '',
    city: data.city || '',
    totalSpent: 0,
    orderCount: 0,
    lastOrder: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  
  manualCustomers.push(newCustomer);
  await saveCustomers(manualCustomers);
  
  return NextResponse.json(newCustomer, { status: 201 });
}
`;

fs.writeFileSync('src/app/api/customers/route.ts', customersRoute.trim() + '\n');
