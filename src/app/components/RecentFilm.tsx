'use client'

import { useEffect, useState } from 'react'

interface Film {
  title: string
  year: string | null
  rating: number | null
  link: string | null
  poster: string | null
}

// Letterboxd-style stars: 3.5 → ★★★½
function stars(rating: number): string {
  return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '')
}

export function RecentFilm() {
  const [film, setFilm] = useState<Film | null>(null)

  useEffect(() => {
    fetch('/api/letterboxd')
      .then(res => (res.ok ? res.json() : null))
      .then(data => { if (data?.title) setFilm(data) })
      .catch(() => {
        /* just don't render the widget */
      })
  }, [])

  if (!film) return null

  const posterStyle = film.poster
    ? { backgroundImage: `url(/api/art?url=${encodeURIComponent(film.poster)})` }
    : undefined

  return (
    <a
      className="recent-film"
      href={film.link ?? 'https://letterboxd.com/aicheye'}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="lb-poster" style={posterStyle}>
        <div className="lb-peel" />
      </div>
      <div className="lb-info">
        <span className="lb-title">{film.title}</span>
        <span className="lb-meta">
          {film.year && <span className="lb-year">{film.year}</span>}
          {film.rating != null && <span className="lb-stars">{stars(film.rating)}</span>}
        </span>
      </div>
    </a>
  )
}
