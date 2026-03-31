const BACKEND_URL = process.env.BACKEND_URL;

const getBody = async (request: Request) => {
  const method = request.method;
  const contentType = request.headers.get('content-type') || '';

  if (method === 'GET' || method === 'HEAD') {
    return undefined;
  }

  if (contentType.includes('application/json')) {
    const data = await request.json();
    return JSON.stringify(data);
  }

  if (contentType.includes('multipart/form-data')) {
    return await request.formData();
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        params.append(key, value);
      }
    }

    return params;
  }
  return await request.text();
};

const buildHeaders = (request: Request, hasBody: boolean) => {
  const headers = new Headers();

  const contentType = request.headers.get('content-type');
  const cookie = request.headers.get('cookie');
  const authorization = request.headers.get('authorization');

  if (contentType && hasBody && !contentType.includes('multipart/form-data')) {
    headers.set('content-type', contentType);
  }

  if (cookie) {
    headers.set('cookie', cookie);
  }

  if (authorization) {
    headers.set('authorization', authorization);
  }

  return headers;
};

export const proxyRequest = async (request: Request, backendPath: string) => {
  if (!BACKEND_URL) {
    return new Response(
      JSON.stringify({
        status: 500,
        message: 'BACKEND_URL is not configured',
      }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  const incomingUrl = new URL(request.url);
  const targetUrl = new URL(`${BACKEND_URL}${backendPath}`);

  targetUrl.search = incomingUrl.search;

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const body = hasBody ? await getBody(request) : undefined;

  const backendResponse = await fetch(targetUrl.toString(), {
    method: request.method,
    headers: buildHeaders(request, hasBody),
    body,
    cache: 'no-store',
    redirect: 'follow',
  });

  const responseHeaders = new Headers();
  const contentType = backendResponse.headers.get('content-type');
  const setCookie = backendResponse.headers.get('set-cookie');

  if (contentType) {
    responseHeaders.set('content-type', contentType);
  }

  if (setCookie) {
    responseHeaders.set('set-cookie', setCookie);
  }

  return new Response(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
};
