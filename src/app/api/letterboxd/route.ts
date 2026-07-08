const FEED_URL = 'https://letterboxd.com/aicheye/rss/'

const decode = (s: string) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, '&')

const tag = (xml: string, name: string) =>
  xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1]?.trim() || null

export async function GET() {
  const res = await fetch(FEED_URL, {
    headers: { 'User-Agent': 'seanyang.me (+https://seanyang.me)' },
    next: { revalidate: 1800 },
  })
  if (!res.ok) return Response.json({ error: 'letterboxd error' }, { status: 502 })
  const xml = await res.text()

  // Newest diary entry — watches/reviews carry <letterboxd:filmTitle>, lists don't
  const item = (xml.match(/<item>[\s\S]*?<\/item>/g) ?? []).find(i => i.includes('<letterboxd:filmTitle>'))
  if (!item) return Response.json({ title: '', year: null, rating: null, link: null, poster: null })

  const rating = tag(item, 'letterboxd:memberRating')
  const poster = (tag(item, 'description') ?? '').match(/<img src="([^"]+)"/)?.[1] ?? null

  return Response.json({
    title: decode(tag(item, 'letterboxd:filmTitle') ?? ''),
    year: tag(item, 'letterboxd:filmYear'),
    rating: rating ? parseFloat(rating) : null,
    link: decode(tag(item, 'link') ?? '') || null,
    poster: poster ? decode(poster) : null,
  })
}
