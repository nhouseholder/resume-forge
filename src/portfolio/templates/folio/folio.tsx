import type { PortfolioTemplateProps } from '../../types'
import type {
  ResumeData,
  ResumeWork,
  ResumeEducation,
  ResumeSkill,
  ResumePublication,
  ResumeProject,
} from '../../../types/resume'

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3)
}

function formatDate(d?: string): string {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

function dateRange(start?: string, end?: string): string {
  const s = formatDate(start)
  const e = end ? formatDate(end) : 'Present'
  if (!s && !e) return ''
  if (!s) return e
  return `${s} — ${e}`
}

function fieldLabel(category: string | null): string {
  switch (category) {
    case 'academic': return 'Research / Academic / Education'
    case 'tech': return 'Engineering / Technology / Product'
    case 'creative': return 'Design / Creative / Portfolio'
    case 'business': return 'Business / Strategy / Operations'
    default: return 'Professional Portfolio'
  }
}

interface NavItem { id: string; label: string }

function buildNav(data: ResumeData): NavItem[] {
  const nav: NavItem[] = []
  if (data.basics?.summary) nav.push({ id: 'about', label: 'About' })
  if (data.projects?.length) nav.push({ id: 'projects', label: 'Projects' })
  if (data.work?.length) nav.push({ id: 'experience', label: 'Experience' })
  if (data.education?.length) nav.push({ id: 'education', label: 'Education' })
  if (data.skills?.length) nav.push({ id: 'skills', label: 'Skills' })
  if (data.publications?.length) nav.push({ id: 'publications', label: 'Publications' })
  return nav
}

export function FolioTemplate({ data, fieldCategory }: PortfolioTemplateProps) {
  const { basics } = data
  const nav = buildNav(data)
  const initials = getInitials(basics?.name || 'Portfolio')

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#top">{initials}</a>
          <nav className="site-nav" aria-label="Primary">
            {nav.map((item) => (
              <a key={item.id} href={`#${item.id}`}>{item.label}</a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top">
        <HeroSection
          name={basics?.name || ''}
          label={basics?.label}
          summary={basics?.summary}
          email={basics?.email}
          url={basics?.url}
          fieldCategory={fieldCategory}
        />

        {basics?.summary && (
          <section id="about" className="portfolio-section" data-reveal="">
            <div className="section-header">
              <div className="section-eyebrow">About</div>
              <h2 className="section-title">Profile</h2>
            </div>
            <p className="section-desc" style={{ maxWidth: '48rem' }}>{basics.summary}</p>
          </section>
        )}

        {data.projects?.length > 0 && (
          <ProjectsSection projects={data.projects} />
        )}

        {data.work?.length > 0 && (
          <ExperienceSection entries={data.work} />
        )}

        {data.education?.length > 0 && (
          <EducationSection entries={data.education} />
        )}

        {data.skills?.length > 0 && (
          <SkillsSection skills={data.skills} />
        )}

        {data.publications?.length > 0 && (
          <PublicationsSection publications={data.publications} />
        )}
      </main>

      <footer className="site-footer">
        <p className="footer-tagline">Built with intent. Powered by ResumeForge.</p>
        {basics?.profiles && basics.profiles.length > 0 && (
          <div className="footer-links">
            {basics.profiles.map((p) => (
              <a key={p.network} href={p.url || '#'} className="footer-link" target="_blank" rel="noopener noreferrer">
                {p.network}
              </a>
            ))}
            {basics.email && (
              <a href={`mailto:${basics.email}`} className="footer-link">Email</a>
            )}
          </div>
        )}
      </footer>
    </div>
  )
}

function HeroSection({
  name, label, summary, email, url, fieldCategory,
}: {
  name: string; label?: string; summary?: string; email?: string; url?: string; fieldCategory: string | null
}) {
  return (
    <section className="hero" data-reveal="">
      <div className="hero-grid">
        <div>
          <div className="eyebrow">{fieldLabel(fieldCategory)}</div>
          <h1>{name}</h1>
          {label && <p className="hero-lead">{label}</p>}
          {summary && <p className="hero-body">{summary}</p>}
          <div className="hero-actions">
            {email && (
              <a className="btn btn-primary" href={`mailto:${email}`}>Get in touch</a>
            )}
            {url && (
              <a className="btn btn-secondary" href={url} target="_blank" rel="noopener noreferrer">Website</a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectsSection({ projects }: { projects: ResumeProject[] }) {
  return (
    <section id="projects" className="portfolio-section" data-reveal="">
      <div className="section-header">
        <div className="section-eyebrow">Work</div>
        <h2 className="section-title">Projects</h2>
      </div>
      <div className="project-grid">
        {projects.map((project, i) => (
          <div key={project.name + i} className="project-card" data-reveal="">
            <div className="project-number">{String(i + 1).padStart(2, '0')}</div>
            <div>
              <div className="project-name">{project.name}</div>
              {project.description && <div className="project-desc">{project.description}</div>}
              {project.tech && project.tech.length > 0 && (
                <div className="project-meta">
                  {project.tech.map((t) => (
                    <span key={t} className="tech-pill">{t}</span>
                  ))}
                </div>
              )}
              {(project.url || project.repoUrl) && (
                <div className="project-links">
                  {project.url && (
                    <a href={project.url} className="project-link" target="_blank" rel="noopener noreferrer">
                      Live site &#8599;
                    </a>
                  )}
                  {project.repoUrl && (
                    <a href={project.repoUrl} className="project-link" target="_blank" rel="noopener noreferrer">
                      Source &#8599;
                    </a>
                  )}
                </div>
              )}
              {project.highlights && project.highlights.length > 0 && (
                <ul className="entry-highlights">
                  {project.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ExperienceSection({ entries }: { entries: ResumeWork[] }) {
  return (
    <section id="experience" className="portfolio-section" data-reveal="">
      <div className="section-header">
        <div className="section-eyebrow">Career</div>
        <h2 className="section-title">Experience</h2>
      </div>
      <div className="entry-list">
        {entries.map((entry, i) => (
          <div key={entry.name + i} className="entry">
            <div className="entry-header">
              <div>
                <div className="entry-title">{entry.position}</div>
                <div className="entry-subtitle">{entry.name}{entry.location ? ` — ${entry.location}` : ''}</div>
              </div>
              <div className="entry-date">{dateRange(entry.startDate, entry.endDate)}</div>
            </div>
            {entry.summary && <p className="entry-summary">{entry.summary}</p>}
            {entry.highlights && entry.highlights.length > 0 && (
              <ul className="entry-highlights">
                {entry.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function EducationSection({ entries }: { entries: ResumeEducation[] }) {
  return (
    <section id="education" className="portfolio-section" data-reveal="">
      <div className="section-header">
        <div className="section-eyebrow">Education</div>
        <h2 className="section-title">Academic Background</h2>
      </div>
      <div className="entry-list">
        {entries.map((entry, i) => (
          <div key={entry.institution + i} className="entry">
            <div className="entry-header">
              <div>
                <div className="entry-title">
                  {[entry.studyType, entry.area].filter(Boolean).join(' in ') || entry.institution}
                </div>
                <div className="entry-subtitle">{entry.institution}</div>
              </div>
              <div className="entry-date">{dateRange(entry.startDate, entry.endDate)}</div>
            </div>
            {entry.score && <p className="entry-summary">GPA: {entry.score}</p>}
            {entry.highlights && entry.highlights.length > 0 && (
              <ul className="entry-highlights">
                {entry.highlights.map((h, j) => <li key={j}>{h}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function SkillsSection({ skills }: { skills: ResumeSkill[] }) {
  return (
    <section id="skills" className="portfolio-section" data-reveal="">
      <div className="section-header">
        <div className="section-eyebrow">Capabilities</div>
        <h2 className="section-title">Skills</h2>
      </div>
      <div className="skill-groups">
        {skills.map((group, i) => (
          <div key={group.name + i}>
            <div className="skill-group-name">{group.name}</div>
            {group.keywords && group.keywords.length > 0 && (
              <div className="skill-keywords">
                {group.keywords.map((kw) => (
                  <span key={kw} className="skill-keyword">{kw}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function PublicationsSection({ publications }: { publications: ResumePublication[] }) {
  return (
    <section id="publications" className="portfolio-section" data-reveal="">
      <div className="section-header">
        <div className="section-eyebrow">Research</div>
        <h2 className="section-title">Publications</h2>
      </div>
      <div className="pub-list">
        {publications.map((pub, i) => (
          <div key={pub.name + i} className="pub">
            <div className="pub-title">{pub.name}</div>
            {pub.publisher && (
              <div className="pub-journal">
                {pub.publisher}
                {pub.releaseDate ? ` — ${formatDate(pub.releaseDate)}` : ''}
              </div>
            )}
            {pub.url && (
              <div className="pub-link">
                <a href={pub.url} target="_blank" rel="noopener noreferrer">View publication &#8599;</a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
