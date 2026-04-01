import { proxyRequest } from '../_lib/proxy';

export async function GET(request: Request) {
  return proxyRequest(request, '/api/feedbacks');
}

export async function POST(request: Request) {
  return proxyRequest(request, '/api/feedbacks');
}
