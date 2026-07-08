const LASTFM_BASE = 'https://ws.audioscrobbler.com/2.0'
const USERNAME = 'aicheyeaaa'

let cachedToken: { token: string; expiresAt: number } | null = null

async function getSpotifyToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  if (!clientId || !clientSecret) return null
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) return null

  const json = await res.json()
  cachedToken = { token: json.access_token, expiresAt: Date.now() + (json.expires_in - 60) * 1000 }
  return cachedToken.token
}

async function findSpotifyTrackUrl(title: string, artist: string): Promise<string | null> {
  try {
    const token = await getSpotifyToken()
    if (!token) return null

    const q = `track:${title} artist:${artist}`
    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=1`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null

    const json = await res.json()
    return json.tracks?.items?.[0]?.external_urls?.spotify ?? null
  } catch {
    return null
  }
}

export async function GET() {
  const apiKey = process.env.LASTFM_API_KEY
  if (!apiKey) return Response.json({ error: 'no api key' }, { status: 500 })

  const url = `${LASTFM_BASE}?method=user.getrecenttracks&user=${USERNAME}&api_key=${apiKey}&format=json&limit=1`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return Response.json({ error: 'lastfm error' }, { status: 502 })

  const json = await res.json()
  const tracks = json.recenttracks?.track
  const track = Array.isArray(tracks) ? tracks[0] : tracks

  if (!track) return Response.json({ isPlaying: false, title: '', artist: '', timestamp: null })

  const isPlaying = track['@attr']?.nowplaying === 'true'
  const timestamp = isPlaying ? null : parseInt(track.date?.uts ?? '0', 10) || null

  const images: { '#text': string; size: string }[] = track.image ?? []
  const bySize = new Map(images.map(i => [i.size, i['#text']]))
  const pick = (...names: string[]) => names.map(n => bySize.get(n)).find(Boolean) || null

  const title = track.name ?? ''
  const artist = track.artist?.['#text'] ?? track.artist ?? ''

  const spotifyUrl = title
    ? (await findSpotifyTrackUrl(title, artist)) ??
      `https://open.spotify.com/search/${encodeURIComponent(`${title} ${artist}`)}`
    : 'https://open.spotify.com/user/apexblu'

  return Response.json({
    isPlaying,
    title,
    artist,
    timestamp,
    albumArt: pick('extralarge', 'large', 'medium'),
    spotifyUrl,
  })
}
