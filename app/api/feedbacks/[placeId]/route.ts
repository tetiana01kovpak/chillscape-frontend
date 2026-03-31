import { proxyRequest } from '../../_lib/proxy';

type Context = {
  params: Promise<{
    placeId: string;
  }>;
};

export async function GET(request: Request, context: Context) {
  const { placeId } = await context.params;
  return proxyRequest(request, `/api/feedbacks/${placeId}`);
}
