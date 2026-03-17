import { useState } from 'react'
import './App.css'
import webringW from './assets/webring/webring_logo_w.svg'
import adjectives from './data/adjectives'
import jobs from './data/jobs'
import portfolio from './data/portfolio'
import quotes from './data/quotes'
import { primaryEmail, socials } from './data/socials'

function App() {
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)])
  const [copied, setCopied] = useState(false)

  function copySSH() {
    navigator.clipboard.writeText('ssh seanyang.me')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <div className="site">
        <header>
          <div className="name-row">
            <h1>Sean Yang</h1>
            <span className="location"><span className="pulse" />Waterloo, ON</span>
          </div>
          <div className="tagline">
            <span>{primaryEmail.label}</span>
            <span>·</span>
            <a className="resume-link" href="/resume" target="_blank" rel="noopener noreferrer">resume ↗</a>
          </div>
          <div className="about">
            <span className="sep">&#91;</span>
            {adjectives.flatMap((w, i) => i === 0
              ? [<span key={w}>{w}</span>]
              : [<span key={`sep-${i}`} className="sep">·</span>, <span key={w}>{w}</span>]
            )}
            <span className="sep">&#93;</span>
          </div>
          <div className="ssh-hint">
            prefer a terminal?
            <button className="ssh-copy" onClick={copySSH}>
              <code>$ ssh seanyang.me</code>
              <span className="ssh-copy-label">{copied ? '✓' : '(copy)'}</span>
            </button>
          </div>
        </header>

        <div className="quote">
          <blockquote>"{quote.text}"</blockquote>
          <cite>— {quote.author}</cite>
        </div>

        <section>
          <h2><span>Experience</span></h2>
          <div className="jobs">
            {jobs.map((job) => (
              <div key={job.title} className={`job${job.current ? ' job-current' : ''}`}>
                <div className="job-header">
                  <span className="job-meta">{job.dates.join(' – ')}</span>
                  <a href={job.website} target="_blank" rel="noopener noreferrer"><strong>{job.title} @ {job.company}</strong></a>
                </div>
                {job.description && <p className="job-description">{job.description}</p>}
                {job.technologies.length > 0 && (
                  <div className="badges badges-right">
                    {job.technologies.map((t: string) => <span key={t} className="badge">{t}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2><span>Projects</span></h2>
          <div className="projects">
            {portfolio.map((p) => (
              <div key={p.title} className="project">
                <strong><a href={p.github} target="_blank" rel="noopener noreferrer">{p.title}</a></strong>
                <p>{p.description}</p>
                <div className="badges">
                  {p.languages.map((l: string) => <span key={l} className="badge">{l}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2><span>Links</span></h2>
          <nav className="links">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </nav>
        </section>

        <footer>
          <span>0.03 g CO₂ / view</span>
          <a className="webring" href="https://se-webring.xyz" target="_blank" rel="noopener noreferrer">
            <img src={webringW} alt="SE Webring" />
          </a>
        </footer>
      </div>
    </>
  )
}

export default App
