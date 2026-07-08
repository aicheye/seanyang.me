const ALLOWED_HOSTS = ['ltrbxd.com', 'letterboxd.com', 'hardcover.app']

// Proxy Letterboxd posters / Hardcover covers so hotlink protection and
// referer checks never break them, and so responses get cached
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const imgUrl = searchParams.get('url')
  if (!imgUrl) return new Response('', { status: 400 })

  try {
    const { hostname } = new URL(imgUrl)
    if (!ALLOWED_HOSTS.some(h => hostname === h || hostname.endsWith(`.${h}`))) {
      return new Response('', { status: 403 })
    }
    const res = await fetch(imgUrl)
    const data = await res.arrayBuffer()
    return new Response(data, {
      headers: {
        'Content-Type': res.headers.get('Content-Type') ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return new Response('', { status: 502 })
  }
}
