import { proxyRequest } from '../_lib/proxy';

export async function GET(request: Request) {
  return proxyRequest(request, '/api/locations');
}

export async function POST(request: Request) {
  return proxyRequest(request, '/api/locations');
}
