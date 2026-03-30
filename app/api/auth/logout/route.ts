import { NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST() {
  try {
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
  }
}