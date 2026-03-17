const START = new Date('2025-09-01')
const END = new Date('2030-05-01')

function toPct(d: Date): number {
  const total = END.getTime() - START.getTime()
  return ((d.getTime() - START.getTime()) / total) * 100
}

function termEnd(date: Date): Date {
  const m = date.getMonth() + 1
  if (m >= 9) return new Date(date.getFullYear() + 1, 0, 1)
  if (m <= 4) return new Date(date.getFullYear(), 4, 1)
  return new Date(date.getFullYear(), 8, 1)
}

function buildTerms(): { startPct: number; endPct: number }[] {
  const terms = []
  let cur = new Date(START)
  while (cur < END) {
    const end = termEnd(cur)
    const clipped = end < END ? end : new Date(END)
    terms.push({ startPct: toPct(cur), endPct: toPct(clipped) })
    cur = new Date(clipped)
  }
  return terms
}

export function TermProgress() {
  const terms = buildTerms()
  const progressPct = Math.max(0, Math.min(100, toPct(new Date())))

  return (
    <div className="term-progress">
      <span className="term-label">uw bse &apos;30 progress</span>
      <div className="term-bar">
        <div className="term-fill" style={{ width: `${progressPct}%` }} />
        {terms.slice(0, -1).map((term, i) => (
          <div key={i} className="term-tick" style={{ left: `${term.endPct}%` }} />
        ))}
      </div>
    </div>
  )
}
