import { proxyRequest } from '../../_lib/proxy';

type Context = {
  params: Promise<{
    locationId: string;
  }>;
};

export async function GET(request: Request, context: Context) {
  const { locationId } = await context.params;
  return proxyRequest(request, `/api/locations/${locationId}`);
}

export async function PATCH(request: Request, context: Context) {
  const { locationId } = await context.params;
  return proxyRequest(request, `/api/locations/${locationId}`);
}
