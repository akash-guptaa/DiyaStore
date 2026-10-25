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

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const idsToDelete: string[] = Array.isArray(body.ids) ? body.ids : (body.id ? [body.id] : []);
    
    if (idsToDelete.length === 0) {
      return NextResponse.json({ error: 'No customer IDs provided' }, { status: 400 });
    }

    const manualCustomers = await getCustomers();
    const updatedCustomers = manualCustomers.filter((c) => !idsToDelete.includes(c.id));
    await saveCustomers(updatedCustomers);

    return NextResponse.json({ success: true, deletedCount: manualCustomers.length - updatedCustomers.length });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete customers' }, { status: 500 });
  }
}
