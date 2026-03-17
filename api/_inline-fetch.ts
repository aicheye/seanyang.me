import type { VercelRequest, VercelResponse } from '@vercel/node';

export async function inlineFetch(req: VercelRequest, res: VercelResponse, upstream: string) {
  const upstreamRes = await fetch(upstream, {
    headers: {
      'user-agent': (req.headers['user-agent'] as string) || 'seanyang.me-proxy',
      accept: (req.headers['accept'] as string) || 'application/pdf',
    },
  });

  if (!upstreamRes.ok) {
    res.status(upstreamRes.status).send(`Upstream fetch error: ${upstreamRes.status}`);
    return;
  }

  const filename = upstream.split('/').pop();
  const contentType = upstreamRes.headers.get('content-type') ?? 'application/pdf';

  res.setHeader('content-disposition', `inline; filename="${filename}"`);
  res.setHeader('content-type', contentType);
  res.setHeader('cache-control', 'public, max-age=60, s-maxage=60, must-revalidate');

  const buffer = Buffer.from(await upstreamRes.arrayBuffer());
  res.status(200).end(buffer);
}
