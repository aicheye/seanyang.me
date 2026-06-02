'use client'

import { useEffect, useRef, useState } from 'react'

interface Track {
  isPlaying: boolean
  title: string
  artist: string
  albumArt: string | null
}

async function extractDominantColor(artUrl: string): Promise<string> {
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = reject
      el.src = `/api/lastfm/art?url=${encodeURIComponent(artUrl)}`
    })
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 10
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, 10, 10)
    const { data } = ctx.getImageData(0, 0, 10, 10)
    let maxS = -1, bestR = 150, bestG = 80, bestB = 50
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255
      const max = Math.max(r, g, b), min = Math.min(r, g, b)
      const s = max === 0 ? 0 : (max - min) / max
      if (s > maxS) { maxS = s; bestR = data[i]; bestG = data[i + 1]; bestB = data[i + 2] }
    }
    return `rgb(${bestR},${bestG},${bestB})`
  } catch {
    return '#8a5c42'
  }
}

export function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null)
  const [labelColor, setLabelColor] = useState('#8a5c42')
  const [recordOut, setRecordOut] = useState(false)
  const [flipHide, setFlipHide] = useState(false)
  const [coverAngle, setCoverAngle] = useState(0)
  const [frontOnTop, setFrontOnTop] = useState(true)
  const [frontArt, setFrontArt] = useState<string | null>(null)
  const [backArt, setBackArt] = useState<string | null>(null)
  const prevArtRef = useRef<string | null>(null)
  const prevKeyRef = useRef<string | null>(null)
  const angleRef = useRef(0)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/lastfm')
        if (res.ok) setTrack(await res.json())
      } catch {}
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

    if (!isPlaying) {
      setRecordOut(false)
      setVisibleArt(albumArt)
      setFrontOnTop(frontVisible)
      colorPromise?.then(setLabelColor).catch(() => {})
      prevKeyRef.current = trackKey
      return
    }
    const prev = prevKeyRef.current
    prevKeyRef.current = trackKey
    // First appearance or same song: show immediately with the record out — no flip.
    if (prev === null || prev === trackKey) {
      setVisibleArt(albumArt)
      setFrontOnTop(frontVisible)
      colorPromise?.then(setLabelColor).catch(() => {})
      setRecordOut(true)
      return
    }

    // Song changed: sequence the animation, preloading the art so the swap never flashes.
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

      setRecordOut(true)                         // 3. record slides back out
    })()

    return () => {
      cancelled = true
      setFlipHide(false)
      timers.forEach(clearTimeout)
    }
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
