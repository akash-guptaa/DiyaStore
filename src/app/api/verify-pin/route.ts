import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/storeSettings';

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    const settings = await getSettings();
    const expectedPin = settings.inventoryPin || '1234';

    if (String(pin).trim() === String(expectedPin).trim()) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Incorrect 4-digit PIN' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to verify PIN' }, { status: 500 });
  }
}
