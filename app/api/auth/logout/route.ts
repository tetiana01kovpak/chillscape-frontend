
import { NextResponse } from 'next/server';
//import { api } from '@/lib/api';
import { proxyRequest } from '../../_lib/proxy';
//import { cookies } from 'next/headers';
//import { isAxiosError } from 'axios';
//import { logErrorResponse } from '../../_utils/utils';

export async function POST(request: Request) {

    const response = await proxyRequest(request, '/api/auth/logout');

    const nextResponse = NextResponse.json(await response.json(), {
        status: response.status,
    });
    
    nextResponse.cookies.set('accessToken', '', { maxAge: 0 });
    nextResponse.cookies.set('refreshToken', '', { maxAge: 0 });

    return nextResponse;
  /*try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!accessToken || !refreshToken) {
        return NextResponse.json(
            { error: 'You are not logged in' },
            { status: 401 } // або 400
        );
    }

    await api.post('auth/logout', null, {
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
    });

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } */
}

