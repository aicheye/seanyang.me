'use client'

import { useSyncExternalStore } from 'react'
import quotes from '@/data/quotes'

type Quote = typeof quotes[number]

let cachedQuote: Quote | null = null

function getSnapshot(): Quote | null {
  if (!cachedQuote) cachedQuote = quotes[Math.floor(Math.random() * quotes.length)]
  return cachedQuote
}

function getServerSnapshot(): null {
  return null
}

export function RandomQuote() {
  const quote = useSyncExternalStore(() => () => {}, getSnapshot, getServerSnapshot)

  if (!quote) return null

  return (
    <div className="quote">
      <blockquote>&quot;{quote.text}&quot;</blockquote>
      <cite>— {quote.author}</cite>
    </div>
  )
}
