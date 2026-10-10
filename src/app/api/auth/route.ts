import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  
  // Hardcoded for demo purposes
  if (data.email === 'admin@diyashop.com' && data.password === 'Passwd@123') {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return response;
  }
  
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}