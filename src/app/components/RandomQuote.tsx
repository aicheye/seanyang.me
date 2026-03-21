import quotes from '@/data/quotes'

export function RandomQuote() {
  // eslint-disable-next-line react-hooks/purity
  const quote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <div className="quote">
      <blockquote>&quot;{quote.text}&quot;</blockquote>
      <cite>— {quote.author}</cite>
    </div>
  )
}
