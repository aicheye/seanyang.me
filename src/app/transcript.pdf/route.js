import { NextResponse } from 'next/server';

const UPSTREAM = 'https://docs.seanyang.me/Sean_Yang_transcript/Sean_Yang_transcript.pdf';

export async function GET(request) {
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
  headers.set('content-disposition', 'inline; filename="Sean_Yang_transcript.pdf"');
  headers.set('content-type', headers.get('content-type') || 'application/pdf');
  headers.set('cache-control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');

  return new NextResponse(upstreamRes.body, { status: 200, headers });
}
