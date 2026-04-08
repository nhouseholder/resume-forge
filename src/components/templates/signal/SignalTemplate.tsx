import type React from 'react'
import type { TemplateLayoutMode, TemplateProps } from '../templateUtils'
import { formatDate } from '../templateUtils'

export const TEMPLATE_ID = 'signal'

/**
 * Signal — Technical Precision
 * Target: Tech, Engineering, Developer
 * Two-column layout (65/35). Left: work + education + projects.
 * Right: skills + languages + certs + interests.
 * Accent section headers with extending horizontal line.
 */
export default function SignalTemplate({ data, layoutMode }: TemplateProps) {
  const styles = getStyles(layoutMode)
  const { basics, work, education, skills, projects, certifications, awards, interests, languages, publications, volunteer, leadership, researchThreads, presentations } = data

  return (
    <div style={styles.root}>
      {/* ── Header (full-width) ── */}
      <header style={styles.header}>
        {basics.name && (
          <h1 style={styles.name}>{basics.name}</h1>
        )}
        {basics.label && (
          <p style={styles.label}>{basics.label}</p>
        )}
        <div style={styles.contactRow}>
          {basics.location && (
            <ContactItem text={[basics.location.city, basics.location.region].filter(Boolean).join(', ')} style={styles.contactItem} />
          )}
          {basics.email && <ContactItem text={basics.email} style={styles.contactItem} />}
          {basics.phone && <ContactItem text={basics.phone} style={styles.contactItem} />}
          {basics.url && <ContactItem text={basics.url} style={styles.contactItem} />}
          {basics.profiles?.map((p, i) => (
            <ContactItem key={i} text={`${p.network}: ${p.username ?? p.url ?? ''}`} style={styles.contactItem} />
          ))}
        </div>
      </header>

      {/* ── Two-column layout ── */}
      <div style={styles.columns}>
        {/* ── Left Column ── */}
        <div style={styles.leftCol}>
          {/* Summary */}
          {basics.summary && (
            <Section styles={styles} title="Summary">
              <p style={styles.summary}>{basics.summary}</p>
            </Section>
          )}

          {/* Work */}
          {work.length > 0 && (
            <Section styles={styles} title="Experience">
              {work.map((w, i) => (
                <div key={i} style={styles.entry}>
                  <div style={styles.entryHeader}>
                    <div>
                      <div style={styles.entryTitle}>{w.position}</div>
                      {w.name && <div style={styles.entryOrg}>{w.name}</div>}
                    </div>
                    <div style={styles.entryMeta}>
                      {w.location && <div>{w.location}</div>}
                      <div style={styles.entryDates}>
                        {formatDate(w.startDate)} – {w.endDate === 'present' ? 'Present' : formatDate(w.endDate) || 'Present'}
                      </div>
                    </div>
                  </div>
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

          {/* Education */}
          {education.length > 0 && (
            <Section styles={styles} title="Education">
              {education.map((e, i) => (
                <div key={i} style={styles.entry}>
                  <div style={styles.entryHeader}>
                    <div>
                      <div style={styles.entryTitle}>{e.area}</div>
                      {e.institution && <div style={styles.entryOrg}>{e.institution}</div>}
                    </div>
                    <div style={styles.entryMeta}>
                      {e.studyType && <div>{e.studyType}</div>}
                      <div style={styles.entryDates}>
                        {formatDate(e.startDate)} – {formatDate(e.endDate)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <Section styles={styles} title="Projects">
              {projects.map((p, i) => (
                <div key={i} style={styles.entry}>
                  <div style={styles.entryHeader}>
                    <div>
                      <div style={styles.entryTitle}>{p.name}</div>
                      {(p.startDate || p.endDate) && (
                        <div style={styles.entryDates}>
                          {formatDate(p.startDate)} – {formatDate(p.endDate)}
                        </div>
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
                </div>
              ))}
            </Section>
          )}

          {/* Publications */}
          {publications.length > 0 && (
            <Section styles={styles} title="Publications">
              {publications.map((pub, i) => (
                <div key={i} style={styles.entry}>
                  <div style={styles.entryTitle}>{pub.name}</div>
                  <div style={styles.entryMeta}>
                    {pub.publisher && <span>{pub.publisher}</span>}
                    {pub.releaseDate && <span style={styles.entryDates}>{formatDate(pub.releaseDate)}</span>}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Volunteer */}
          {volunteer && volunteer.length > 0 && (
            <Section styles={styles} title="Volunteer">
              {volunteer.map((v, i) => (
                <div key={i} style={styles.entry}>
                  <div style={styles.entryHeader}>
                    <div>
                      <div style={styles.entryTitle}>{v.position}</div>
                      {v.organization && <div style={styles.entryOrg}>{v.organization}</div>}
                    </div>
                    <div style={styles.entryDates}>
                      {formatDate(v.startDate)} – {formatDate(v.endDate)}
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Leadership */}
          {leadership && leadership.length > 0 && (
            <Section styles={styles} title="Leadership">
              {leadership.map((l, i) => (
                <div key={i} style={styles.entry}>
                  <div style={styles.entryHeader}>
                    <div>
                      <div style={styles.entryTitle}>{l.role}</div>
                      {l.organization && <div style={styles.entryOrg}>{l.organization}</div>}
                    </div>
                    <div style={styles.entryDates}>
                      {formatDate(l.startDate)} – {formatDate(l.endDate)}
                    </div>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Research */}
          {researchThreads && researchThreads.length > 0 && (
            <Section styles={styles} title="Research">
              {researchThreads.map((r, i) => (
                <div key={i} style={styles.entry}>
                  <div style={styles.entryTitle}>{r.name}</div>
                  {r.summary && <div style={styles.entrySummary}>{r.summary}</div>}
                </div>
              ))}
            </Section>
          )}

          {/* Presentations */}
          {presentations && presentations.length > 0 && (
            <Section styles={styles} title="Presentations">
              {presentations.map((p, i) => (
                <div key={i} style={styles.entry}>
                  <div style={styles.entryTitle}>{p.name}</div>
                  <div style={styles.entryMeta}>
                    {p.conference && <span>{p.conference}</span>}
                    {p.date && <span style={styles.entryDates}>{formatDate(p.date)}</span>}
                  </div>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* ── Right Column ── */}
        <div style={styles.rightCol}>
          {/* Skills */}
          {skills.length > 0 && (
            <Section styles={styles} title="Skills">
              {skills.map((s, i) => (
                <div key={i} style={styles.skillGroup}>
                  <div style={styles.skillName}>{s.name}</div>
                  {s.keywords && s.keywords.length > 0 && (
                    <div style={styles.skillChips}>
                      {s.keywords.map((k, ki) => (
                        <span key={ki} style={styles.skillChip}>{k}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <Section styles={styles} title="Languages">
              {languages.map((l, i) => (
                <div key={i} style={styles.langRow}>
                  <span style={styles.skillName}>{l.language}</span>
                  {l.fluency && <span style={styles.langLevel}>{l.fluency}</span>}
                </div>
              ))}
            </Section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <Section styles={styles} title="Certifications">
              {certifications.map((c, i) => (
                <div key={i} style={styles.certEntry}>
                  <div style={styles.entryTitle}>{c.name}</div>
                  <div style={styles.entryMeta}>
                    {c.issuer && <span>{c.issuer}</span>}
                    {c.date && <span style={styles.entryDates}>{formatDate(c.date)}</span>}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Awards */}
          {awards && awards.length > 0 && (
            <Section styles={styles} title="Awards">
              {awards.map((a, i) => (
                <div key={i} style={styles.certEntry}>
                  <div style={styles.entryTitle}>{a.title}</div>
                  <div style={styles.entryMeta}>
                    {a.awarder && <span>{a.awarder}</span>}
                    {a.date && <span style={styles.entryDates}>{formatDate(a.date)}</span>}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Interests */}
          {interests && interests.length > 0 && (
            <Section styles={styles} title="Interests">
              {interests.map((int, i) => (
                <div key={i} style={styles.skillGroup}>
                  <span style={styles.skillName}>{int.name}</span>
                  {int.keywords && (
                    <span style={styles.entryDates}>{int.keywords.join(', ')}</span>
                  )}
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}

function ContactItem({ text, style }: { text: string; style: React.CSSProperties }) {
  return <span style={style}>{text}</span>
}

function Section({ title, children, styles }: { title: string; children: React.ReactNode; styles: Record<string, React.CSSProperties> }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>
        {title}
        <span style={styles.sectionLine} />
      </h2>
      <div>{children}</div>
    </section>
  )
}

function getStyles(layoutMode: TemplateLayoutMode): Record<string, React.CSSProperties> {
  const compact = layoutMode === 'compact'
  const medium = layoutMode === 'medium'
  const full = layoutMode === 'full'

  return {
    root: {
      fontFamily: 'var(--font-body)',
      color: 'var(--color-text)',
      lineHeight: 'var(--line-height-body)',
      padding: compact
        ? 'var(--space-5) var(--space-4)'
        : medium
          ? 'var(--space-7) var(--space-6)'
          : 'var(--space-10) var(--space-8)',
      maxWidth: '100%',
      boxSizing: 'border-box',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(247,250,255,0.98))',
    },
    header: {
      marginBottom: 'var(--space-6)',
      padding: 'var(--space-4) 0 var(--space-5)',
      borderTop: '3px solid var(--color-accent)',
      borderBottom: '1px solid var(--color-border)',
    },
    name: {
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '2rem' : medium ? '2.6rem' : 'var(--font-size-h1)',
      fontWeight: 'var(--font-heading-weight)',
      color: 'var(--color-heading)',
      lineHeight: compact ? 1.04 : 'var(--line-height-h1)',
      letterSpacing: 'var(--letter-spacing-h1)',
      margin: 0,
    },
    label: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--color-accent)',
      marginTop: 'var(--space-2)',
      marginBottom: 'var(--space-3)',
    },
    contactRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--color-text-muted)',
    },
    contactItem: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 0',
    },
    columns: {
      display: 'grid',
      gridTemplateColumns: full ? 'minmax(0, 1.65fr) minmax(13rem, 0.95fr)' : '1fr',
      gap: compact ? 'var(--space-5)' : 'var(--space-7)',
    },
    leftCol: {
      minWidth: 0,
    },
    rightCol: {
      minWidth: 0,
      borderLeft: full ? '1px solid var(--color-border)' : 'none',
      paddingLeft: full ? 'var(--space-5)' : 0,
      borderTop: full ? 'none' : '1px solid var(--color-border)',
      paddingTop: full ? 0 : 'var(--space-4)',
    },
    section: {
      marginTop: 'var(--space-6)',
    },
    sectionTitle: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      fontWeight: 600,
      color: 'var(--color-accent)',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      marginBottom: 'var(--space-3)',
      lineHeight: 'var(--line-height-caption)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
    },
    sectionLine: {
      flex: 1,
      height: '1px',
      backgroundColor: 'var(--color-accent)',
      minWidth: 'var(--space-4)',
      opacity: 0.35,
    },
    entry: {
      marginBottom: 'var(--space-4)',
      paddingBottom: 'var(--space-4)',
      borderBottom: '1px solid var(--color-border)',
    },
    entryHeader: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'minmax(0, 1fr) auto',
      gap: 'var(--space-1) var(--space-4)',
      alignItems: 'start',
    },
    entryTitle: {
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '1rem' : 'var(--font-size-h3)',
      fontWeight: 600,
      color: 'var(--color-text)',
      lineHeight: 'var(--line-height-h3)',
    },
    entryOrg: {
      fontSize: 'var(--font-size-body-sm)',
      color: 'var(--color-text-muted)',
      marginTop: 'var(--space-1)',
    },
    entryMeta: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--color-text-muted)',
      textAlign: compact ? 'left' : 'right',
    },
    entryDates: {
      fontSize: 'var(--font-size-caption)',
      color: 'var(--color-text-muted)',
    },
    entrySummary: {
      fontSize: 'var(--font-size-body-sm)',
      color: 'var(--color-text)',
      marginTop: 'var(--space-2)',
      lineHeight: 'var(--line-height-body-sm)',
      padding: 'var(--space-3)',
      backgroundColor: 'var(--color-surface-el)',
      borderLeft: '2px solid var(--color-accent)',
    },
    summary: {
      fontSize: 'var(--font-size-body-sm)',
      lineHeight: 'var(--line-height-body-sm)',
      color: 'var(--color-text)',
      padding: 'var(--space-3)',
      backgroundColor: 'var(--color-surface-el)',
      borderLeft: '2px solid var(--color-accent)',
    },
    highlights: {
      listStyle: 'none',
      padding: 0,
      margin: 'var(--space-2) 0 0 0',
    },
    highlightItem: {
      paddingLeft: 'var(--space-3)',
      borderLeft: '1px solid var(--color-border)',
      fontSize: 'var(--font-size-body-sm)',
      lineHeight: 'var(--line-height-body-sm)',
      marginBottom: 'var(--space-2)',
    },
    skillGroup: {
      marginBottom: 'var(--space-3)',
      paddingBottom: 'var(--space-3)',
      borderBottom: '1px solid var(--color-border)',
    },
    skillName: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--color-text)',
      display: 'block',
    },
    skillChips: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-1)',
      marginTop: 'var(--space-2)',
    },
    skillChip: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      color: 'var(--color-text-muted)',
      backgroundColor: 'transparent',
      border: '1px solid var(--color-border)',
      borderRadius: '2px',
      padding: '2px 6px',
      lineHeight: 'var(--line-height-caption)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    langRow: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 'var(--space-2)',
      alignItems: 'baseline',
      marginBottom: 'var(--space-2)',
      fontSize: 'var(--font-size-body-sm)',
      paddingBottom: 'var(--space-2)',
      borderBottom: '1px solid var(--color-border)',
    },
    langLevel: {
      color: 'var(--color-text-muted)',
      fontSize: 'var(--font-size-caption)',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    certEntry: {
      marginBottom: 'var(--space-3)',
      paddingBottom: 'var(--space-3)',
      borderBottom: '1px solid var(--color-border)',
    },
  }
}
