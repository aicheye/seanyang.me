import portfolio from '@/data/portfolio'

export function ProjectsSection() {
  return (
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
  )
}
