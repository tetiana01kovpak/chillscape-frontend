import { NextResponse } from 'next/server';
import { proxyRequest } from '../../_lib/proxy';

export async function POST(request: Request) {
  const response = await proxyRequest(request, '/api/auth/logout');

  const nextResponse = new NextResponse(null, {
    status: response.status,
  });

  nextResponse.cookies.set('accessToken', '', { maxAge: 0 });
  nextResponse.cookies.set('refreshToken', '', { maxAge: 0 });

  return nextResponse;
}
