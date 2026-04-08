import type React from 'react'
import type { TemplateProps } from '../templateUtils'
import { formatDate } from '../templateUtils'

export const TEMPLATE_ID = 'signal'

/**
 * Signal — Technical Precision
 * Target: Tech, Engineering, Developer
 * Two-column layout (65/35). Left: work + education + projects.
 * Right: skills + languages + certs + interests.
 * Accent section headers with extending horizontal line.
 */
export default function SignalTemplate({ data }: TemplateProps) {
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
            <ContactItem text={[basics.location.city, basics.location.region].filter(Boolean).join(', ')} />
          )}
          {basics.email && <ContactItem text={basics.email} />}
          {basics.phone && <ContactItem text={basics.phone} />}
          {basics.url && <ContactItem text={basics.url} />}
          {basics.profiles?.map((p, i) => (
            <ContactItem key={i} text={`${p.network}: ${p.username ?? p.url ?? ''}`} />
          ))}
        </div>
      </header>

      {/* ── Two-column layout ── */}
      <div style={styles.columns}>
        {/* ── Left Column ── */}
        <div style={styles.leftCol}>
          {/* Summary */}
          {basics.summary && (
            <Section title="Summary">
              <p style={styles.summary}>{basics.summary}</p>
            </Section>
          )}

          {/* Work */}
          {work.length > 0 && (
            <Section title="Experience">
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
            <Section title="Education">
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
            <Section title="Projects">
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
            <Section title="Publications">
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
            <Section title="Volunteer">
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
            <Section title="Leadership">
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
            <Section title="Research">
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
            <Section title="Presentations">
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
            <Section title="Skills">
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
            <Section title="Languages">
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
            <Section title="Certifications">
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
            <Section title="Awards">
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
            <Section title="Interests">
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

// ── Helpers ──

function ContactItem({ text }: { text: string }) {
  return <span style={styles.contactItem}>{text}</span>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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

// ── Styles ──

const styles: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: 'var(--font-body)',
    color: 'var(--color-text)',
    lineHeight: 'var(--line-height-body)',
    padding: 'var(--space-8) var(--space-8)',
    maxWidth: '900px',
  },
  header: {
    marginBottom: 'var(--space-6)',
    paddingBottom: 'var(--space-5)',
    borderBottom: '2px solid var(--color-accent)',
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
    marginBottom: 'var(--space-2)',
  },
  contactRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'var(--space-4)',
    fontSize: 'var(--font-size-body-sm)',
    color: 'var(--color-text-muted)',
  },
  contactItem: {},
  columns: {
    display: 'flex',
    gap: 'var(--space-8)',
  },
  leftCol: {
    flex: '2',
    minWidth: 0,
  },
  rightCol: {
    flex: '1',
    minWidth: '200px',
  },
  section: {
    marginTop: 'var(--space-6)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--font-size-h2)',
    fontWeight: 'var(--font-heading-weight)' as unknown as number,
    color: 'var(--color-accent)',
    letterSpacing: 'var(--letter-spacing-h2)',
    textTransform: 'uppercase' as const,
    marginBottom: 'var(--space-3)',
    lineHeight: 'var(--line-height-h2)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
  },
  sectionLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'var(--color-border)',
    minWidth: 'var(--space-4)',
  },
  entry: {
    marginBottom: 'var(--space-4)',
  },
  entryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flexWrap: 'wrap' as const,
    gap: 'var(--space-1)',
  },
  entryTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--font-size-h3)',
    fontWeight: 600,
    color: 'var(--color-text)',
    lineHeight: 'var(--line-height-h3)',
  },
  entryOrg: {
    fontSize: 'var(--font-size-body-sm)',
    color: 'var(--color-text-muted)',
    marginTop: 'var(--space-0)',
  },
  entryMeta: {
    fontSize: 'var(--font-size-body-sm)',
    color: 'var(--color-text-muted)',
    textAlign: 'right' as const,
  },
  entryDates: {
    fontSize: 'var(--font-size-caption)',
    color: 'var(--color-text-muted)',
  },
  entrySummary: {
    fontSize: 'var(--font-size-body-sm)',
    color: 'var(--color-text-muted)',
    marginTop: 'var(--space-1)',
    lineHeight: 'var(--line-height-body-sm)',
  },
  summary: {
    fontSize: 'var(--font-size-body-sm)',
    lineHeight: 'var(--line-height-body-sm)',
    color: 'var(--color-text-muted)',
  },
  highlights: {
    listStyle: 'none',
    padding: 0,
    margin: 'var(--space-1) 0 0 0',
  },
  highlightItem: {
    paddingLeft: 'var(--space-3)',
    fontSize: 'var(--font-size-body-sm)',
    lineHeight: 'var(--line-height-body-sm)',
    marginBottom: 'var(--space-1)',
  },
  skillGroup: {
    marginBottom: 'var(--space-3)',
  },
  skillName: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--font-size-body-sm)',
    fontWeight: 600,
    color: 'var(--color-text)',
    display: 'block',
  },
  skillChips: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'var(--space-1)',
    marginTop: 'var(--space-1)',
  },
  skillChip: {
    fontSize: 'var(--font-size-caption)',
    color: 'var(--color-text-muted)',
    backgroundColor: 'var(--color-surface-el)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    padding: 'var(--space-0) var(--space-2)',
    lineHeight: 'var(--line-height-caption)',
  },
  langRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 'var(--space-1)',
    fontSize: 'var(--font-size-body-sm)',
  },
  langLevel: {
    color: 'var(--color-text-muted)',
    fontSize: 'var(--font-size-caption)',
  },
  certEntry: {
    marginBottom: 'var(--space-3)',
  },
}
