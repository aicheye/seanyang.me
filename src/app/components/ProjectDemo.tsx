'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiPlay, FiX } from 'react-icons/fi'

/* GIFs never fire an "ended" event, so sum the frame delays from the file's
   graphic control extensions to know when one playthrough finishes.
   Returns null for static or unparseable files (modal then stays open). */
function gifDurationMs(buf: ArrayBuffer): number | null {
  const b = new Uint8Array(buf)
  if (b.length < 13 || b[0] !== 0x47 || b[1] !== 0x49 || b[2] !== 0x46) return null
  let p = 6
  const packed = b[p + 4]
  p += 7
  if (packed & 0x80) p += 3 * (1 << ((packed & 0x07) + 1))
  let total = 0
  let frames = 0
  while (p < b.length) {
    const block = b[p++]
    if (block === 0x3b) break
    if (block === 0x21) {
      const label = b[p++]
      if (label === 0xf9) {
        const delay = b[p + 2] | (b[p + 3] << 8)
        // browsers clamp near-zero delays to 100ms
        total += (delay < 2 ? 10 : delay) * 10
        frames++
      }
      while (p < b.length && b[p] !== 0) p += b[p] + 1
      p++
    } else if (block === 0x2c) {
      const localPacked = b[p + 8]
      p += 9
      if (localPacked & 0x80) p += 3 * (1 << ((localPacked & 0x07) + 1))
      p++
      while (p < b.length && b[p] !== 0) p += b[p] + 1
      p++
    } else {
      break
    }
  }
  return frames > 1 && total > 0 ? total : null
}

export function ProjectDemo({ title, gif }: { title: string; gif: string }) {
  const [open, setOpen] = useState(false)
  const [src, setSrc] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const duration = useRef<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    trigger.current?.focus()
  }, [])

  /* Fetch as a blob URL so playback always restarts from frame 0 —
     a cached <img> src can resume mid-loop in some browsers. */
  useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    let url: string | null = null
    fetch(gif, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`)
        return r.arrayBuffer()
      })
      .then((buf) => {
        duration.current = gifDurationMs(buf)
        url = URL.createObjectURL(new Blob([buf], { type: 'image/gif' }))
        setSrc(url)
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true)
      })
    return () => {
      controller.abort()
      if (url) URL.revokeObjectURL(url)
      if (timer.current) clearTimeout(timer.current)
      timer.current = null
      duration.current = null
      setSrc(null)
      setFailed(false)
    }
  }, [open, gif])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, close])

  function onGifLoad() {
    if (duration.current) {
      // small grace period so the last frame registers before closing
      timer.current = setTimeout(close, duration.current + 150)
    }
  }

  return (
    <>
      <button
        ref={trigger}
        className="demo-play"
        aria-label={`Play ${title} demo`}
        title="play demo"
        onClick={() => setOpen(true)}
      >
        <FiPlay size={9} />
      </button>
      {open &&
        createPortal(
          <div className="demo-overlay" onClick={close}>
            <div
              className="demo-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`${title} demo`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="demo-header">
                <span className="demo-title">{title}</span>
                <button ref={closeBtn} className="demo-close" aria-label="Close demo" onClick={close}>
                  <FiX size={14} />
                </button>
              </div>
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element -- blob URL, next/image can't optimize it
                <img src={src} alt={`${title} demo`} onLoad={onGifLoad} />
              ) : (
                <div className="demo-loading">{failed ? 'demo unavailable' : 'loading…'}</div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
