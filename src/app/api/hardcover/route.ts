const HARDCOVER_BASE = 'https://api.hardcover.app/v1/graphql'

// status_id 2 = currently reading
const QUERY = `{
  me {
    user_books(where: { status_id: { _eq: 2 } }) {
      last_read_date
      book {
        title
        slug
        pages
        image { url }
        contributions { author { name } }
      }
      user_book_reads {
        progress
        progress_pages
        started_at
        finished_at
        edition { pages }
      }
    }
  }
}`

interface Read {
  progress: number | null
  progress_pages: number | null
  started_at: string | null
  finished_at: string | null
  edition: { pages: number | null } | null
}

interface UserBook {
  last_read_date: string | null
  book: {
    title: string
    slug: string | null
    pages: number | null
    image: { url: string } | null
    contributions: { author: { name: string } | null }[]
  }
  user_book_reads: Read[]
}

// Hardcover rate-limits to 60 req/min, so hold results for a while
let cached: { at: number; body: unknown } | null = null
const TTL_MS = 15 * 60 * 1000

export async function GET() {
  const token = process.env.HARDCOVER_API_TOKEN
  if (!token) return Response.json({ error: 'no api token' }, { status: 500 })
  if (cached && Date.now() - cached.at < TTL_MS) return Response.json(cached.body)

  const res = await fetch(HARDCOVER_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
    },
    body: JSON.stringify({ query: QUERY }),
    cache: 'no-store',
  })
  if (!res.ok) return Response.json({ error: 'hardcover error' }, { status: 502 })

  const json = await res.json()
  const userBooks: UserBook[] = json.data?.me?.[0]?.user_books ?? []
  if (json.errors || userBooks.length === 0) {
    return Response.json({ title: '', author: '', percent: null, cover: null, url: null })
  }

  // Most recently updated book: latest of last_read_date / any read's started_at
  const latest = (ub: UserBook) =>
    [ub.last_read_date, ...ub.user_book_reads.map(r => r.started_at)]
      .filter((d): d is string => Boolean(d))
      .sort()
      .at(-1) ?? ''
  const current = [...userBooks].sort((a, b) => latest(b).localeCompare(latest(a)))[0]

  // The active read: unfinished first, then most recently started
  const read = [...current.user_book_reads].sort((a, b) => {
    if (!a.finished_at !== !b.finished_at) return a.finished_at ? 1 : -1
    return (b.started_at ?? '').localeCompare(a.started_at ?? '')
  })[0]

  const totalPages = read?.edition?.pages ?? current.book.pages ?? null
  let percent: number | null = null
  if (read?.progress_pages && totalPages) percent = (read.progress_pages / totalPages) * 100
  else if (typeof read?.progress === 'number') percent = read.progress
  if (percent != null) percent = Math.max(0, Math.min(100, Math.round(percent)))

  const body = {
    title: current.book.title,
    author: current.book.contributions.map(c => c.author?.name).filter(Boolean).slice(0, 2).join(', '),
    percent,
    cover: current.book.image?.url ?? null,
    url: current.book.slug ? `https://hardcover.app/books/${current.book.slug}` : 'https://hardcover.app/@aicheye',
  }
  cached = { at: Date.now(), body }
  return Response.json(body)
}
