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
    id: 'cust_' + Math.random().toString(36).substr(2, 9),
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
