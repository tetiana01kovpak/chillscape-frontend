//update user

import { proxyRequest } from '../_lib/proxy';

export async function PATCH(request: Request) {
  return proxyRequest(request, '/api/users');
}
