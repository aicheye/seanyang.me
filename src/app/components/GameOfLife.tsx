'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const CELL = 14
const TICK = 80

export function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const grid = useRef<Uint8Array>(new Uint8Array(0))
  const cols = useRef(0)
  const rows = useRef(0)
  const painting = useRef(false)
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const [density, setDensity] = useState(5)  // 1–10: sparse → dense
  const sparsityRef = useRef(6)              // derived: 11 - density
  const densityRef = useRef(5)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#d6cfb8'
    const C = cols.current
    const R = rows.current
    const g = grid.current
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        if (g[r * C + c]) {
          ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2)
        }
      }
    }
  }, [])

  const tick = useCallback(() => {
    const g = grid.current
    const C = cols.current
    const R = rows.current
    const next = new Uint8Array(C * R)
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        let n = 0
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++)
            if (dr || dc) n += g[((r + dr + R) % R) * C + ((c + dc + C) % C)]
        const alive = g[r * C + c]
        next[r * C + c] = alive ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0)
      }
    }
    grid.current = next
    render()
  }, [render])

  const paint = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const c = Math.floor((clientX - rect.left) / CELL)
    const r = Math.floor((clientY - rect.top) / CELL)
    const C = cols.current
    const R = rows.current
    if (c >= 0 && c < C && r >= 0 && r < R) {
      grid.current[r * C + c] = 1
      render()
    }
  }, [render])

  const seed = useCallback(() => {
    const C = cols.current
    const R = rows.current
    const g = new Uint8Array(C * R)
    // sparsity 1–10 → divisor 200–5000 (log scale), halved on mobile for more clusters
    const mobile = window.innerWidth <= 1000
    const divisor = (mobile ? 100 : 200) * Math.pow(25, (sparsityRef.current - 1) / 9)
    const clusterCount = Math.max(1, Math.floor((C * R) / divisor))
    const fillProb = densityRef.current / 10
    for (let k = 0; k < clusterCount; k++) {
      const cx = Math.random() * C
      const cy = Math.random() * R
      const radius = 3 + Math.random() * 5
      for (let dr = -Math.ceil(radius); dr <= Math.ceil(radius); dr++) {
        for (let dc = -Math.ceil(radius); dc <= Math.ceil(radius); dc++) {
          const dist = Math.sqrt(dr * dr + dc * dc)
          if (dist <= radius && Math.random() < fillProb) {
            const r = Math.round(cy + dr)
            const c = Math.round(cx + dc)
            if (r >= 0 && r < R && c >= 0 && c < C) g[r * C + c] = 1
          }
        }
      }
    }
    grid.current = g
    render()
  }, [render])

  const clear = useCallback(() => {
    grid.current = new Uint8Array(cols.current * rows.current)
    render()
  }, [render])

  useEffect(() => {
    const canvas = canvasRef.current!

    // Initial setup: size canvas and seed
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    cols.current = Math.ceil(canvas.width / CELL)
    rows.current = Math.ceil(canvas.height / CELL)
    seed()

    timer.current = setInterval(tick, TICK)

    // On resize: preserve existing grid, copy cells into new dimensions
    let resizeTimer: ReturnType<typeof setTimeout>
    const resize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        const newCols = Math.ceil(window.innerWidth / CELL)
        const newRows = Math.ceil(window.innerHeight / CELL)
        const oldGrid = grid.current
        const oldCols = cols.current
        const oldRows = rows.current
        const newGrid = new Uint8Array(newCols * newRows)
        const minR = Math.min(oldRows, newRows)
        const minC = Math.min(oldCols, newCols)
        for (let r = 0; r < minR; r++)
          for (let c = 0; c < minC; c++)
            newGrid[r * newCols + c] = oldGrid[r * oldCols + c]
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        cols.current = newCols
        rows.current = newRows
        grid.current = newGrid
        render()
      }, 400)
    }
    window.addEventListener('resize', resize)

    const down = (e: MouseEvent) => { painting.current = true; paint(e.clientX, e.clientY) }
    const move = (e: MouseEvent) => { if (painting.current) paint(e.clientX, e.clientY) }
    const up = () => { painting.current = false }
    window.addEventListener('mousedown', down)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)

    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', resize)
      clearInterval(timer.current)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
  }, [tick, paint, render, seed])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />
      <div className="gol-controls" style={{ position: 'fixed', top: 20, right: 24, zIndex: 2 }}>
        <a
          href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
          target="_blank"
          rel="noopener noreferrer"
          className="gol-link"
        >
          Conway&apos;s Game of Life ↗
        </a>
        <label className="gol-slider-row">
          <span>density</span>
          <input
            type="range" min={1} max={10} step={1} value={density}
            onChange={e => {
              const v = Number(e.target.value)
              setDensity(v)
              densityRef.current = v
              sparsityRef.current = 11 - v
            }}
          />
        </label>
        <div className="gol-btn-row">
          <button className="gol-btn" onClick={clear}>clear</button>
          <button className="gol-btn" onClick={seed}>regenerate</button>
        </div>
      </div>
    </>
  )
}
