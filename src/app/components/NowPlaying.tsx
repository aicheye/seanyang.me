'use client'

import { useEffect, useRef, useState } from 'react'

interface Track {
  isPlaying: boolean
  title: string
  artist: string
  albumArt: string | null
}

const FALLBACK_COLOR = '#8a5c42'

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const d = max - min
  const l = (max + min) / 2
  let h = 0
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s, l }
}

// Pick the most prevalent *vibrant* hue rather than a single saturated pixel.
async function extractDominantColor(artUrl: string): Promise<string> {
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = reject
      el.src = `/api/lastfm/art?url=${encodeURIComponent(artUrl)}`
    })
    const N = 40
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = N
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, N, N)
    const { data } = ctx.getImageData(0, 0, N, N)

    // Histogram over hue buckets, each pixel weighted by how vivid + mid-toned it is.
    const BUCKETS = 24
    const w = new Float64Array(BUCKETS)
    const sr = new Float64Array(BUCKETS)
    const sg = new Float64Array(BUCKETS)
    const sb = new Float64Array(BUCKETS)
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue // skip transparent
      const r = data[i], g = data[i + 1], b = data[i + 2]
      const { h, s, l } = rgbToHsl(r, g, b)
      if (s < 0.2 || l < 0.12 || l > 0.92) continue // ignore grey / near-black / near-white
      const weight = s * s * (1 - Math.abs(l - 0.55) * 1.2) // favour saturated, mid-luminance
      if (weight <= 0) continue
      const k = Math.min(BUCKETS - 1, Math.floor((h / 360) * BUCKETS))
      w[k] += weight
      sr[k] += r * weight
      sg[k] += g * weight
      sb[k] += b * weight
    }

    let best = -1, bestW = 0
    for (let k = 0; k < BUCKETS; k++) if (w[k] > bestW) { bestW = w[k]; best = k }
    if (best < 0) return FALLBACK_COLOR // greyscale art — no clear colour

    // Weighted-average colour of the winning hue, as-is (no saturation boost).
    const r = Math.round(sr[best] / w[best])
    const g = Math.round(sg[best] / w[best])
    const b = Math.round(sb[best] / w[best])
    return `rgb(${r},${g},${b})`
  } catch {
    return FALLBACK_COLOR
  }
}

export function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null)
  const [labelColor, setLabelColor] = useState(FALLBACK_COLOR)
  const [recordOut, setRecordOut] = useState(false)
  const [flipHide, setFlipHide] = useState(false)
  const [coverAngle, setCoverAngle] = useState(0)
  const [frontOnTop, setFrontOnTop] = useState(true)
  const [frontArt, setFrontArt] = useState<string | null>(null)
  const [backArt, setBackArt] = useState<string | null>(null)
  const prevArtRef = useRef<string | null>(null)
  const prevKeyRef = useRef<string | null>(null)
  const wasPlayingRef = useRef(false)
  const angleRef = useRef(0)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/lastfm')
        if (res.ok) setTrack(await res.json())
      } catch {
        /* ignore transient fetch errors; the next poll retries */
      }
    }
    load()
    const poll = setInterval(load, 3_000)
    return () => clearInterval(poll)
  }, [])

  // On a track change while playing: record in → (disk colour + flip, together) → record out.
  const trackKey = `${track?.title ?? ''}__${track?.artist ?? ''}`
  const isPlaying = track?.isPlaying ?? false
  const albumArt = track?.albumArt ?? null
  useEffect(() => {
    if (!track?.title) return // nothing real yet — don't touch the refs (avoids a first-load flip)

    // Which face currently shows: front when the angle is an even multiple of 180°, else back.
    const frontVisible = (Math.round(angleRef.current / 180)) % 2 === 0
    const setVisibleArt = (art: string | null) => (frontVisible ? setFrontArt(art) : setBackArt(art))

    // Kick off colour extraction as soon as the art changes (runs in parallel with everything).
    const artChanged = albumArt !== prevArtRef.current
    prevArtRef.current = albumArt
    const colorPromise = artChanged && albumArt ? extractDominantColor(albumArt) : null

    const wasPlaying = wasPlayingRef.current
    wasPlayingRef.current = isPlaying

    // Record in → (disk colour + flip, together) → optionally back out.
    // slideOutAtEnd=false leaves the record tucked in (used when playback stops).
    const runFlip = (slideOutAtEnd: boolean) => {
      let cancelled = false
      const timers: ReturnType<typeof setTimeout>[] = []
      const wait = (ms: number) => new Promise<void>(r => timers.push(setTimeout(r, ms)))
      const preload = new Promise<void>(resolve => {
        if (!albumArt) return resolve()
        const im = new Image()
        im.onload = im.onerror = () => resolve()
        im.src = albumArt
      })

      ;(async () => {
        setRecordOut(false)                        // 1. record slides in behind the cover
        await Promise.all([wait(1000), preload])   //    wait for the slide-in AND the new art to be ready
        if (cancelled) return

        // 2. disk colour + flip, in parallel
        const color = colorPromise ? await colorPromise.catch(() => null) : null
        if (cancelled) return
        if (color) setLabelColor(color)            //    change the disk colour…
        if (frontVisible) setBackArt(albumArt)     //    …and put the new art on the hidden face
        else setFrontArt(albumArt)
        setFlipHide(true)                          //    hide the record through the whole flip
        angleRef.current += 180
        setCoverAngle(angleRef.current)            //    …and start the flip
        await wait(450)                            //    reach edge-on (90°)
        if (cancelled) return
        setFrontOnTop(!frontVisible)               //    bring the incoming face forward at the edge
        await wait(450)                            //    finish the flip (180°)
        if (cancelled) return
        setFlipHide(false)

        if (slideOutAtEnd) setRecordOut(true)      // 3. record slides back out (skipped when stopped)
      })()

      return () => {
        cancelled = true
        setFlipHide(false)
        timers.forEach(clearTimeout)
      }
    }

    const settle = (out: boolean) => {
      setRecordOut(out)
      setVisibleArt(albumArt)
      setFrontOnTop(frontVisible)
      colorPromise?.then(setLabelColor).catch(() => {})
    }

    if (!isPlaying) {
      prevKeyRef.current = trackKey
      // Playback just stopped after playing: animate in → flip, but stay in (no slide out).
      if (wasPlaying && artChanged) return runFlip(false)
      settle(false) // already stopped, or art unchanged — just settle in
      return
    }

    const prev = prevKeyRef.current
    prevKeyRef.current = trackKey
    // First appearance or same song: show immediately with the record out — no flip.
    if (prev === null || prev === trackKey) {
      settle(true)
      return
    }

    // Song changed while playing: in → flip → out.
    return runFlip(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackKey, isPlaying, albumArt])

  if (!track || !track.title) return null

  const { title, artist } = track
  const frontFill = frontArt ?? albumArt
  const frontStyle = {
    backgroundImage: frontFill ? `url(${frontFill})` : undefined,
    zIndex: frontOnTop ? 2 : 1,
  }
  const backStyle = {
    backgroundImage: backArt ? `url(${backArt})` : undefined,
    zIndex: frontOnTop ? 1 : 2,
  }

  return (
    <a
      className={`now-playing${isPlaying ? ' np-playing' : ''}`}
      href="https://open.spotify.com/user/apexblu"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="np-album">
        <div className={`np-vinyl${recordOut ? ' np-vinyl-out' : ''}${flipHide ? ' np-vinyl-hidden' : ''}`}>
          <div className="np-print" style={{ background: labelColor }} />
        </div>
        <div className="np-cover-flip" style={{ transform: `rotateY(${coverAngle}deg)` }}>
          <div className="np-cover np-cover-front" style={frontStyle} />
          <div className="np-cover np-cover-back" style={backStyle} />
        </div>
      </div>
      <div className="np-info">
        <span className="np-title">
          {isPlaying && (
            <span className="np-eq" aria-label="Now playing">
              <span />
              <span />
              <span />
            </span>
          )}
          <span className="np-title-text">{title}</span>
        </span>
        <span className="np-artist">{artist}</span>
      </div>
    </a>
  )
}
