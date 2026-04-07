import type React from 'react'
import type { TemplateProps } from '../templateUtils'
import { formatDate } from '../templateUtils'

export const TEMPLATE_ID = 'meridian'

/**
 * Meridian — Editorial Authority
 * Target: Academic, Business, Professional
 * Single-column with accent left-border section headers, small caps tracking,
 * clean hierarchy like a well-typeset academic journal.
 */
export default function MeridianTemplate({ data }: TemplateProps) {
  const { basics, work, education, skills, projects, publications, certifications, awards, interests, languages, volunteer, leadership, researchThreads, presentations } = data

  return (
    <div style={styles.root}>
      {/* ── Header ── */}
      <header style={styles.header}>
        {basics.name && (
          <h1 style={styles.name}>{basics.name}</h1>
        )}
        {basics.label && (
          <p style={styles.label}>{basics.label}</p>
        )}
        <div style={styles.contactRow}>
          {basics.location && (
            <span style={styles.contactItem}>
              {[basics.location.city, basics.location.region].filter(Boolean).join(', ')}
            </span>
          )}
          {basics.email && <span style={styles.contactItem}>{basics.email}</span>}
          {basics.phone && <span style={styles.contactItem}>{basics.phone}</span>}
          {basics.url && <span style={styles.contactItem}>{basics.url}</span>}
          {basics.profiles?.map((p, i) => (
            <span key={i} style={styles.contactItem}>{p.network}: {p.username}</span>
          ))}
        </div>
      </header>

      {/* ── Summary ── */}
      {basics.summary && (
        <Section title="Summary">
          <p style={styles.summary}>{basics.summary}</p>
        </Section>
      )}

      {/* ── Work Experience ── */}
      {work.length > 0 && (
        <Section title="Experience">
          {work.map((w, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <div>
                  <span style={styles.entryTitle}>{w.position}</span>
                  {w.name && <span style={styles.entryOrg}> at {w.name}</span>}
                </div>
                <div style={styles.entryMeta}>
                  {w.location && <span>{w.location}</span>}
                  {(w.startDate || w.endDate) && (
                    <span style={styles.entryDates}>
                      {formatDate(w.startDate)} – {w.endDate === 'present' ? 'Present' : formatDate(w.endDate) || 'Present'}
                    </span>
                  )}
                </div>
              </div>
              {w.summary && <p style={styles.entrySummary}>{w.summary}</p>}
              {w.highlights && w.highlights.length > 0 && (
                <ul style={styles.highlights}>
                  {w.highlights.map((h, hi) => (
                    <li key={hi} style={styles.highlightItem}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* ── Education ── */}
      {education.length > 0 && (
        <Section title="Education">
          {education.map((e, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <div>
                  <span style={styles.entryTitle}>{e.area}</span>
                  {e.institution && <span style={styles.entryOrg}> — {e.institution}</span>}
                </div>
                <div style={styles.entryMeta}>
                  {e.studyType && <span>{e.studyType}</span>}
                  {(e.startDate || e.endDate) && (
                    <span style={styles.entryDates}>
                      {formatDate(e.startDate)} – {formatDate(e.endDate)}
                    </span>
                  )}
                </div>
              </div>
              {e.score && <p style={styles.entrySummary}>{e.score}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* ── Skills ── */}
      {skills.length > 0 && (
        <Section title="Skills">
          <div style={styles.skillsGrid}>
            {skills.map((s, i) => (
              <div key={i} style={styles.skillGroup}>
                <span style={styles.skillName}>{s.name}</span>
                {s.keywords && s.keywords.length > 0 && (
                  <div style={styles.skillChips}>
                    {s.keywords.map((k, ki) => (
                      <span key={ki} style={styles.skillChip}>{k}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Projects ── */}
      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <div>
                  <span style={styles.entryTitle}>{p.name}</span>
                  {(p.startDate || p.endDate) && (
                    <span style={styles.entryDates}>
                      {formatDate(p.startDate)} – {formatDate(p.endDate)}
                    </span>
                  )}
                </div>
              </div>
              {p.description && <p style={styles.entrySummary}>{p.description}</p>}
              {p.tech && p.tech.length > 0 && (
                <div style={styles.skillChips}>
                  {p.tech.map((t, ti) => (
                    <span key={ti} style={styles.skillChip}>{t}</span>
                  ))}
                </div>
              )}
              {p.highlights && p.highlights.length > 0 && (
                <ul style={styles.highlights}>
                  {p.highlights.map((h, hi) => (
                    <li key={hi} style={styles.highlightItem}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* ── Publications ── */}
      {publications.length > 0 && (
        <Section title="Publications">
          {publications.map((pub, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <span style={styles.entryTitle}>{pub.name}</span>
                {pub.releaseDate && <span style={styles.entryDates}>{formatDate(pub.releaseDate)}</span>}
              </div>
              {pub.publisher && <p style={styles.entrySummary}>{pub.publisher}</p>}
              {pub.summary && <p style={styles.entrySummary}>{pub.summary}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* ── Certifications ── */}
      {certifications && certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((c, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <span style={styles.entryTitle}>{c.name}</span>
                <div style={styles.entryMeta}>
                  {c.issuer && <span>{c.issuer}</span>}
                  {c.date && <span style={styles.entryDates}>{formatDate(c.date)}</span>}
                </div>
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* ── Awards ── */}
      {awards && awards.length > 0 && (
        <Section title="Awards">
          {awards.map((a, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <span style={styles.entryTitle}>{a.title}</span>
                <div style={styles.entryMeta}>
                  {a.awarder && <span>{a.awarder}</span>}
                  {a.date && <span style={styles.entryDates}>{formatDate(a.date)}</span>}
                </div>
              </div>
              {a.summary && <p style={styles.entrySummary}>{a.summary}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* ── Languages ── */}
      {languages && languages.length > 0 && (
        <Section title="Languages">
          <div style={styles.skillsGrid}>
            {languages.map((l, i) => (
              <div key={i} style={styles.skillGroup}>
                <span style={styles.skillName}>{l.language}</span>
                {l.fluency && <span style={styles.skillChip}>{l.fluency}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Interests ── */}
      {interests && interests.length > 0 && (
        <Section title="Interests">
          <div style={styles.skillsGrid}>
            {interests.map((int, i) => (
              <div key={i} style={styles.skillGroup}>
                <span style={styles.skillName}>{int.name}</span>
                {int.keywords && int.keywords.length > 0 && (
                  <span style={styles.skillChip}>{int.keywords.join(', ')}</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Volunteer ── */}
      {volunteer && volunteer.length > 0 && (
        <Section title="Volunteer">
          {volunteer.map((v, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <div>
                  <span style={styles.entryTitle}>{v.position}</span>
                  {v.organization && <span style={styles.entryOrg}> at {v.organization}</span>}
                </div>
                <div style={styles.entryMeta}>
                  {(v.startDate || v.endDate) && (
                    <span style={styles.entryDates}>
                      {formatDate(v.startDate)} – {formatDate(v.endDate)}
                    </span>
                  )}
                </div>
              </div>
              {v.summary && <p style={styles.entrySummary}>{v.summary}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* ── Leadership ── */}
      {leadership && leadership.length > 0 && (
        <Section title="Leadership">
          {leadership.map((l, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <div>
                  <span style={styles.entryTitle}>{l.role}</span>
                  {l.organization && <span style={styles.entryOrg}> — {l.organization}</span>}
                </div>
                <div style={styles.entryMeta}>
                  {(l.startDate || l.endDate) && (
                    <span style={styles.entryDates}>
                      {formatDate(l.startDate)} – {formatDate(l.endDate)}
                    </span>
                  )}
                </div>
              </div>
              {l.summary && <p style={styles.entrySummary}>{l.summary}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* ── Research ── */}
      {researchThreads && researchThreads.length > 0 && (
        <Section title="Research">
          {researchThreads.map((r, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryTitle}>{r.name}</div>
              {r.summary && <p style={styles.entrySummary}>{r.summary}</p>}
              {r.keywords && r.keywords.length > 0 && (
                <p style={styles.entrySummary}>Keywords: {r.keywords.join(', ')}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* ── Presentations ── */}
      {presentations && presentations.length > 0 && (
        <Section title="Presentations">
          {presentations.map((p, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <span style={styles.entryTitle}>{p.name}</span>
                <div style={styles.entryMeta}>
                  {p.conference && <span>{p.conference}</span>}
                  {p.date && <span style={styles.entryDates}>{formatDate(p.date)}</span>}
                </div>
              </div>
              {p.summary && <p style={styles.entrySummary}>{p.summary}</p>}
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}

// ── Section wrapper with accent left-border ──

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div>{children}</div>
    </section>
  )
}

// ── Styles (all CSS custom properties) ──

const styles: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: 'var(--font-body)',
    color: 'var(--color-text)',
    lineHeight: 'var(--line-height-body)',
    padding: 'var(--space-12) var(--space-10)',
    maxWidth: '800px',
  },
  header: {
    marginBottom: 'var(--space-8)',
    paddingBottom: 'var(--space-6)',
    borderBottom: '1px solid var(--color-border)',
  },
  name: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--font-size-h1)',
    fontWeight: 'var(--font-heading-weight)' as unknown as number,
    color: 'var(--color-heading)',
    lineHeight: 'var(--line-height-h1)',
    letterSpacing: 'var(--letter-spacing-h1)',
    margin: 0,
  },
  label: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--color-accent)',
    marginTop: 'var(--space-1)',
    marginBottom: 'var(--space-3)',
  },
  contactRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'var(--space-3)',
    fontSize: 'var(--font-size-body-sm)',
    color: 'var(--color-text-muted)',
  },
  contactItem: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  section: {
    marginTop: 'var(--space-8)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--font-size-h2)',
    fontWeight: 'var(--font-heading-weight)' as unknown as number,
    color: 'var(--color-heading)',
    letterSpacing: 'var(--letter-spacing-h2)',
    textTransform: 'uppercase' as const,
    borderLeft: '2px solid var(--color-accent)',
    paddingLeft: 'var(--space-3)',
    marginBottom: 'var(--space-4)',
    lineHeight: 'var(--line-height-h2)',
  },
  entry: {
    marginBottom: 'var(--space-5)',
  },
  entryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flexWrap: 'wrap' as const,
    gap: 'var(--space-2)',
  },
  entryTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--font-size-h3)',
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  entryOrg: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--color-text-muted)',
    fontWeight: 400,
  },
  entryMeta: {
    fontSize: 'var(--font-size-body-sm)',
    color: 'var(--color-text-muted)',
    display: 'flex',
    gap: 'var(--space-3)',
    flexWrap: 'wrap' as const,
  },
  entryDates: {
    fontSize: 'var(--font-size-body-sm)',
    color: 'var(--color-text-muted)',
  },
  entrySummary: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--color-text-muted)',
    marginTop: 'var(--space-1)',
    marginBottom: 'var(--space-1)',
    lineHeight: 'var(--line-height-body)',
  },
  summary: {
    fontSize: 'var(--font-size-body)',
    lineHeight: 'var(--line-height-body)',
    color: 'var(--color-text-muted)',
    marginTop: 'var(--space-1)',
  },
  highlights: {
    listStyle: 'none',
    padding: 0,
    margin: 'var(--space-2) 0 0 0',
  },
  highlightItem: {
    position: 'relative' as const,
    paddingLeft: 'var(--space-4)',
    fontSize: 'var(--font-size-body-sm)',
    lineHeight: 'var(--line-height-body-sm)',
    marginBottom: 'var(--space-1)',
  },
  skillsGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'var(--space-4)',
  },
  skillGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    flexWrap: 'wrap' as const,
  },
  skillName: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--font-size-body-sm)',
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  skillChips: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'var(--space-1)',
  },
  skillChip: {
    fontSize: 'var(--font-size-caption)',
    color: 'var(--color-text-muted)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-1) var(--space-2)',
  },
}
