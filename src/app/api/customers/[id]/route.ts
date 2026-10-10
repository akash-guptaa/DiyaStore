import { NextResponse } from 'next/server';
import { getCustomers, saveCustomers } from '@/lib/storeCustomers';
import { Customer } from '@/types';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();
  const customers = await getCustomers();
  
  const index = customers.findIndex((c) => c.id === id);
  if (index !== -1) {
    // Manual customer exists
    const updatedCustomer: Customer = {
      ...customers[index],
      name: data.name,
      mobile: data.mobile,
      email: data.email || '',
      city: data.city || ''
    };
    customers[index] = updatedCustomer;
    await saveCustomers(customers);
    return NextResponse.json(updatedCustomer);
  } else {
    // It's a derived customer being edited for the first time, save as manual
    const newCustomer: Customer = {
      id: id,
      name: data.name,
      mobile: data.mobile,
      email: data.email || '',
      city: data.city || '',
      totalSpent: 0,
      orderCount: 0,
      lastOrder: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    customers.push(newCustomer);
    await saveCustomers(customers);
    return NextResponse.json(newCustomer, { status: 201 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customers = await getCustomers();
  
  const updatedCustomers = customers.filter((c) => c.id !== id);
  await saveCustomers(updatedCustomers);

  return new NextResponse(null, { status: 204 });
}
