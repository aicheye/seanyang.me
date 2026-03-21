import { FiMapPin } from 'react-icons/fi'
import adjectives from '@/data/adjectives'
import { primaryEmail } from '@/data/socials'
import { SSHCopyButton } from './SSHCopyButton'
import { TermProgress } from './TermProgress'

export function Header() {
  return (
    <header>
      <div className="name-row">
        <h1>Sean Yang</h1>
        <span className="location"><span className="pulse" />Waterloo, ON<FiMapPin size={12} /></span>
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
  )
}
