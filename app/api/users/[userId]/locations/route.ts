//to get user's locations

import { proxyRequest } from '../../../_lib/proxy';

type Context = {
  params: Promise<{
    userId: string;
  }>;
};

export async function GET(request: Request, context: Context) {
  const { userId } = await context.params;
  return proxyRequest(request, `/api/users/${userId}/locations`);
}
