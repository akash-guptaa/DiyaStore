import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/storeSettings';

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const current = await getSettings();
  const updated = { ...current, ...data };
  await saveSettings(updated);
  return NextResponse.json(updated);
}