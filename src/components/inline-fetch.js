import { NextResponse } from 'next/server';

export async function inlineFetch(request, UPSTREAM) {
  const upstreamRes = await fetch(UPSTREAM, {
    headers: {
      'user-agent': request.headers.get('user-agent') || 'seanyang.me-proxy',
      accept: request.headers.get('accept') || 'application/pdf',
    },
  });

  if (!upstreamRes.ok) {
    return new NextResponse(`Upstream fetch error: ${upstreamRes.status}`, { status: upstreamRes.status });
  }

  const headers = new Headers(upstreamRes.headers);
  headers.set('content-disposition', 'inline; filename="' + UPSTREAM.split('/').pop() + '"');
  headers.set('content-type', headers.get('content-type') || 'application/pdf');
  headers.set('cache-control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');

  return new NextResponse(upstreamRes.body, { status: 200, headers });
}
