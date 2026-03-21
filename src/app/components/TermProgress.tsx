'use client'

import { useEffect, useState } from 'react'

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
  let cur = termEnd(START)
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
  const [progressPct, setProgressPct] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setProgressPct(Math.max(0, Math.min(100, toPct(new Date())))), 100)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="term-progress">
      <div className="term-label">
        <span>uwaterloo bse &apos;30 progress</span>
        <span style={{ fontFamily: 'var(--font-mono), monospace' }}>{progressPct.toFixed(8)}%</span>
      </div>
      <div className="term-bar">
        <div className="term-fill" style={{ width: `${progressPct}%` }} />
        {terms.slice(0, -1).map((term, i) => (
          <div key={i} className="term-tick" style={{ left: `${term.endPct}%` }} />
        ))}
      </div>
    </div>
  )
}
