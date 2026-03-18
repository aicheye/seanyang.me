import { FiMapPin } from 'react-icons/fi'
import adjectives from '../data/adjectives'
import jobs from '../data/jobs'
import portfolio from '../data/portfolio'
import quotes from '../data/quotes'
import { primaryEmail, socials } from '../data/socials'
import { GameOfLife } from './GameOfLife'
import { SSHCopyButton } from './SSHCopyButton'
import { TermProgress } from './TermProgress'

export default function Page() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <>
      <GameOfLife />
      <div className="site">
        <header>
          <div className="name-row">
            <h1>Sean Yang</h1>
            <span className="location"><span className="pulse" />Waterloo, Ontario<FiMapPin size={12} /></span>
          </div>
          <div className="tagline">
            <a href={primaryEmail.href}>{primaryEmail.label}</a>
            <span>|</span>
            <a href="/resume" target="_blank" rel="noopener noreferrer">resume ↗</a>
          </div>
          <div className="about">
            <span className="sep">&#91;</span>
            {adjectives.flatMap((w, i) => i === 0
              ? [<span key={w}>{w}</span>]
              : [<span key={`sep-${i}`} className="sep">·</span>, <span key={w}>{w}</span>]
            )}
            <span className="sep">&#93;</span>
          </div>
          <TermProgress />
          <SSHCopyButton />
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
                  <div className="job-meta">
                    <span>{job.dates.join(' – ')}</span>
                    {job.location && <span className="job-location">{job.location}</span>}
                  </div>
                  <div className="job-body">
                    <a href={job.website} target="_blank" rel="noopener noreferrer"><strong>{job.title} @ {job.company}</strong></a>
                    {job.description && <p className="job-description">{job.description}</p>}
                    {job.technologies.length > 0 && (
                      <div className="badges badges-right">
                        {job.technologies.map((t: string) => <span key={t} className="badge">{t}</span>)}
                      </div>
                    )}
                  </div>
                </div>
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
          <a href="https://websitecarbon.com/website/seanyang-me/" target="_blank" rel="noopener noreferrer">0.03 g CO₂ / view</a>
          <a className="webring" href="https://se-webring.xyz" target="_blank" rel="noopener noreferrer">
            <img src="/logo_b.png" alt="SE Webring" />
          </a>
        </footer>
      </div>
    </>
  )
}
