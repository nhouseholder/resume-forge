import type React from 'react'
import type { TemplateLayoutMode, TemplateProps } from '../templateUtils'
import { formatDate } from '../templateUtils'

export const TEMPLATE_ID = 'meridian'

/**
 * Meridian — Editorial Authority
 * Target: Academic, Business, Professional
 * Single-column with accent left-border section headers, small caps tracking,
 * clean hierarchy like a well-typeset academic journal.
 */
export default function MeridianTemplate({ data, layoutMode }: TemplateProps) {
  const styles = getStyles(layoutMode)
  const { basics, work, education, skills, projects, publications, certifications, awards, interests, languages, volunteer, leadership, researchThreads, presentations } = data

  return (
    <div style={styles.root}>
      {/* ── Header ── */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.identityBlock}>
            {basics.name && (
              <h1 style={styles.name}>{basics.name}</h1>
            )}
            {basics.label && (
              <p style={styles.label}>{basics.label}</p>
            )}
          </div>

          <div style={styles.headerAside}>
            {basics.location && (
              <span style={styles.asideItem}>
                {[basics.location.city, basics.location.region].filter(Boolean).join(', ')}
              </span>
            )}
            {basics.email && <span style={styles.asideItem}>{basics.email}</span>}
            {basics.phone && <span style={styles.asideItem}>{basics.phone}</span>}
          </div>
        </div>

        <div style={styles.contactRow}>
          {basics.url && <span style={styles.contactItem}>{basics.url}</span>}
          {basics.profiles?.map((p, i) => (
            <span key={i} style={styles.contactItem}>{p.network}: {p.username ?? p.url ?? ''}</span>
          ))}
        </div>
      </header>

      {/* ── Summary ── */}
      {basics.summary && (
        <section style={styles.summaryBlock}>
          <p style={styles.summaryEyebrow}>Executive summary</p>
          <p style={styles.summary}>{basics.summary}</p>
        </section>
      )}

      {/* ── Work Experience ── */}
      {work.length > 0 && (
        <Section styles={styles} title="Experience">
          {work.map((w, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <div style={styles.entryIdentity}>
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
        <Section styles={styles} title="Education">
          {education.map((e, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <div style={styles.entryIdentity}>
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
        <Section styles={styles} title="Skills">
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
        <Section styles={styles} title="Projects">
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
        <Section styles={styles} title="Publications">
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
        <Section styles={styles} title="Certifications">
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
        <Section styles={styles} title="Awards">
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
        <Section styles={styles} title="Languages">
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
        <Section styles={styles} title="Interests">
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
        <Section styles={styles} title="Volunteer">
          {volunteer.map((v, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <div style={styles.entryIdentity}>
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
        <Section styles={styles} title="Leadership">
          {leadership.map((l, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <div style={styles.entryIdentity}>
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
        <Section styles={styles} title="Research">
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
        <Section styles={styles} title="Presentations">
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

function Section({ title, children, styles }: { title: string; children: React.ReactNode; styles: Record<string, React.CSSProperties> }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div>{children}</div>
    </section>
  )
}

function getStyles(layoutMode: TemplateLayoutMode): Record<string, React.CSSProperties> {
  const compact = layoutMode === 'compact'
  const medium = layoutMode === 'medium'

  return {
    root: {
      fontFamily: 'var(--font-body)',
      color: 'var(--color-text)',
      lineHeight: 'var(--line-height-body)',
      padding: compact
        ? 'var(--space-5) var(--space-4)'
        : medium
          ? 'var(--space-8) var(--space-6)'
          : 'var(--space-12) var(--space-10)',
      maxWidth: '100%',
      boxSizing: 'border-box',
    },
    header: {
      marginBottom: 'var(--space-7)',
      paddingBottom: 'var(--space-5)',
      borderBottom: '1px solid var(--color-border)',
    },
    headerTop: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'minmax(0, 1fr) minmax(12rem, 0.7fr)',
      gap: compact ? 'var(--space-4)' : 'var(--space-6)',
      alignItems: 'end',
    },
    identityBlock: {
      minWidth: 0,
    },
    headerAside: {
      display: 'grid',
      gap: 'var(--space-2)',
      alignContent: 'start',
      justifyItems: compact ? 'start' : 'end',
      minWidth: 0,
    },
    asideItem: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--color-text-muted)',
    },
    name: {
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '2.2rem' : medium ? '2.8rem' : 'var(--font-size-h1)',
      fontWeight: 'var(--font-heading-weight)',
      color: 'var(--color-heading)',
      lineHeight: compact ? 1.02 : 'var(--line-height-h1)',
      letterSpacing: 'var(--letter-spacing-h1)',
      margin: 0,
      maxWidth: '14ch',
    },
    label: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--color-accent)',
      marginTop: 'var(--space-2)',
      marginBottom: 0,
    },
    contactRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: compact ? 'var(--space-2)' : 'var(--space-3)',
      marginTop: 'var(--space-4)',
      paddingTop: 'var(--space-3)',
      borderTop: '1px solid var(--color-border)',
    },
    contactItem: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--color-text-muted)',
    },
    summaryBlock: {
      marginTop: 'var(--space-6)',
      padding: compact ? 'var(--space-4)' : 'var(--space-5)',
      backgroundColor: 'var(--color-surface-el)',
      borderLeft: '3px solid var(--color-accent)',
    },
    summaryEyebrow: {
      margin: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--color-accent)',
    },
    section: {
      marginTop: compact ? 'var(--space-7)' : 'var(--space-8)',
    },
    sectionTitle: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      fontWeight: 600,
      color: 'var(--color-accent)',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      borderTop: '1px solid var(--color-border)',
      paddingTop: 'var(--space-2)',
      marginBottom: 'var(--space-4)',
      lineHeight: 'var(--line-height-caption)',
    },
    entry: {
      marginBottom: compact ? 'var(--space-4)' : 'var(--space-5)',
    },
    entryHeader: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'minmax(0, 1fr) auto',
      gap: 'var(--space-2) var(--space-4)',
      alignItems: 'baseline',
    },
    entryIdentity: {
      minWidth: 0,
    },
    entryTitle: {
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '1.02rem' : 'var(--font-size-h3)',
      fontWeight: 600,
      color: 'var(--color-text)',
    },
    entryOrg: {
      fontSize: compact ? 'var(--font-size-body-sm)' : 'var(--font-size-body)',
      color: 'var(--color-text-muted)',
      fontWeight: 400,
    },
    entryMeta: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--color-text-muted)',
      display: 'flex',
      flexDirection: compact ? 'row' : 'column',
      alignItems: compact ? 'flex-start' : 'flex-end',
      gap: 'var(--space-1)',
      textAlign: compact ? 'left' : 'right',
    },
    entryDates: {
      fontSize: 'var(--font-size-caption)',
      color: 'var(--color-text-muted)',
    },
    entrySummary: {
      fontSize: compact ? 'var(--font-size-body-sm)' : 'var(--font-size-body)',
      color: 'var(--color-text-muted)',
      marginTop: 'var(--space-2)',
      marginBottom: 'var(--space-1)',
      lineHeight: compact ? 'var(--line-height-body-sm)' : 'var(--line-height-body)',
      maxWidth: '65ch',
    },
    summary: {
      fontSize: compact ? '0.98rem' : '1.06rem',
      lineHeight: compact ? 1.7 : 1.75,
      color: 'var(--color-text)',
      margin: 'var(--space-2) 0 0 0',
      maxWidth: '65ch',
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
      color: 'var(--color-text)',
    },
    skillsGrid: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'repeat(auto-fit, minmax(12rem, 1fr))',
      gap: 'var(--space-3)',
    },
    skillGroup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'var(--space-2)',
      paddingTop: 'var(--space-2)',
      borderTop: '1px solid var(--color-border)',
    },
    skillName: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--font-size-body-sm)',
      fontWeight: 600,
      color: 'var(--color-text)',
    },
    skillChips: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-1)',
    },
    skillChip: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      color: 'var(--color-text-muted)',
      border: '1px solid var(--color-border)',
      borderRadius: '2px',
      padding: '2px 6px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  }
}
