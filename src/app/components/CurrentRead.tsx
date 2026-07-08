'use client'

import { useEffect, useState } from 'react'

interface Book {
  title: string
  author: string
  percent: number | null
  cover: string | null
  url: string | null
}

export function CurrentRead() {
  const [book, setBook] = useState<Book | null>(null)

  useEffect(() => {
    fetch('/api/hardcover')
      .then(res => (res.ok ? res.json() : null))
      .then(data => { if (data?.title) setBook(data) })
      .catch(() => {
        /* just don't render the widget */
      })
  }, [])

  if (!book) return null

  const coverStyle = book.cover
    ? { backgroundImage: `url(/api/art?url=${encodeURIComponent(book.cover)})` }
    : undefined

  return (
    <a
      className="current-read"
      href={book.url ?? 'https://hardcover.app/@aicheye'}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="hc-scene">
        <div className="hc-float">
          <div className="hc-book">
            <div className="hc-cover" style={coverStyle} />
            <div className="hc-pages" />
            <div className="hc-spine" />
            <div className="hc-back" />
          </div>
        </div>
        <div className="hc-shadow" />
      </div>
      <div className="hc-info">
        <span className="hc-title">{book.title}</span>
        {book.author && <span className="hc-author">{book.author}</span>}
        {book.percent != null && (
          <span className="hc-progress">
            <span className="hc-track">
              <span className="hc-fill" style={{ width: `${book.percent}%` }} />
            </span>
            <span className="hc-pct">{book.percent}%</span>
          </span>
        )}
      </div>
    </a>
  )
}
