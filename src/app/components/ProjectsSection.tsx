'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiPlay, FiX } from 'react-icons/fi'
import projects, { Project } from '@/data/projects'

export function ProjectsSection() {
  const [active, setActive] = useState<Project | null>(null)
  // Bumped on every open so the demo's src changes, forcing a GIF to replay
  // from its first frame even when reopening the same project.
  const [nonce, setNonce] = useState(0)

  const close = () => setActive(null)

  function open(p: Project) {
    setNonce((n) => n + 1)
    setActive(p)
  }

  useEffect(() => {
    if (!active) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    // GIFs auto-close after one play-through; static images stay until closed.
    let timer: ReturnType<typeof setTimeout> | undefined
    if (active.mediaDuration) {
      timer = setTimeout(close, active.mediaDuration * 1000)
    }

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      if (timer) clearTimeout(timer)
    }
  }, [active])

  const src = active ? `${active.media}?t=${nonce}` : ''

  return (
    <section>
      <h2><span>Projects</span></h2>
      <div className="projects">
        {projects.map((p) => (
          <div key={p.title} className="project">
            <div className="project-head">
              <strong><a href={p.github} target="_blank" rel="noopener noreferrer">{p.title}</a></strong>
              {p.media && (
                <button
                  type="button"
                  className="project-play"
                  onClick={() => open(p)}
                  aria-label={`Play ${p.title} demo`}
                >
                  <FiPlay size={11} />
                </button>
              )}
            </div>
            <p>{p.description}</p>
            <div className="badges">
              {p.technologies.map((t: string) => <span key={t} className="badge">{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      {active && createPortal(
        <div
          className="project-modal"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} demo`}
        >
          <div className="project-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="project-modal-close"
              onClick={close}
              aria-label="Close"
            >
              <FiX size={18} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="project-modal-media" src={src} alt={`${active.title} demo`} />
          </div>
        </div>,
        document.body,
      )}
    </section>
  )
}
