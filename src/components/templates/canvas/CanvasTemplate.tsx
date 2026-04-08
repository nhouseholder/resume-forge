import type React from 'react'
import type { TemplateLayoutMode, TemplateProps } from '../templateUtils'
import { formatDate } from '../templateUtils'

export const TEMPLATE_ID = 'canvas'

/**
 * Canvas — Creative Expression
 * Target: Creative, Design, Arts
 * Asymmetric layout with full-width header, large display name,
 * pull-quote summary, varied section header styles.
 * Bold, expressive, design-forward.
 */
export default function CanvasTemplate({ data, layoutMode }: TemplateProps) {
  const styles = getStyles(layoutMode)
  const { basics, work, education, skills, projects, publications, certifications, awards, interests, languages, volunteer, leadership, researchThreads, presentations } = data

  return (
    <div style={styles.root}>
      {/* ── Hero Header ── */}
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
            <span key={i} style={styles.contactItem}>{p.network}: {p.username ?? p.url ?? ''}</span>
          ))}
        </div>
      </header>

      {/* ── Summary as Pull Quote ── */}
      {basics.summary && (
        <div style={styles.summaryBlock}>
          <div style={styles.summaryAccent} />
          <p style={styles.summary}>{basics.summary}</p>
        </div>
      )}

      {/* ── Work Experience ── */}
      {work.length > 0 && (
        <Section styles={styles} title="Experience" variant="underline">
          {work.map((w, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <div>
                  <div style={styles.entryCompany}>{w.name}</div>
                  <div style={styles.entryTitle}>{w.position}</div>
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

      {/* ── Education ── */}
      {education.length > 0 && (
        <Section styles={styles} title="Education" variant="bg">
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

      {/* ── Skills ── */}
      {skills.length > 0 && (
        <Section styles={styles} title="Skills" variant="accent">
          <div style={styles.skillsLayout}>
            {skills.map((s, i) => (
              <div key={i} style={styles.skillCategory}>
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
          </div>
        </Section>
      )}

      {/* ── Projects ── */}
      {projects.length > 0 && (
        <Section styles={styles} title="Projects" variant="underline">
          {projects.map((p, i) => (
            <div key={i} style={styles.projectCard}>
              <div style={styles.projectHeader}>
                <span style={styles.entryTitle}>{p.name}</span>
                {(p.startDate || p.endDate) && (
                  <span style={styles.entryDates}>
                    {formatDate(p.startDate)} – {formatDate(p.endDate)}
                  </span>
                )}
              </div>
              {p.description && <p style={styles.entrySummary}>{p.description}</p>}
              {p.tech && p.tech.length > 0 && (
                <div style={styles.skillChips}>
                  {p.tech.map((t, ti) => (
                    <span key={ti} style={styles.skillChipAccent}>{t}</span>
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
        <Section styles={styles} title="Publications" variant="underline">
          {publications.map((pub, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryTitle}>{pub.name}</div>
              <div style={styles.entryMeta}>
                {pub.publisher && <span>{pub.publisher}</span>}
                {pub.releaseDate && <span style={styles.entryDates}>{formatDate(pub.releaseDate)}</span>}
              </div>
              {pub.summary && <p style={styles.entrySummary}>{pub.summary}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* ── Certifications ── */}
      {certifications && certifications.length > 0 && (
        <Section styles={styles} title="Certifications" variant="bg">
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
        <Section styles={styles} title="Awards" variant="accent">
          {awards.map((a, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <span style={styles.entryTitle}>{a.title}</span>
                <div style={styles.entryMeta}>
                  {a.awarder && <span>{a.awarder}</span>}
                  {a.date && <span style={styles.entryDates}>{formatDate(a.date)}</span>}
                </div>
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* ── Languages ── */}
      {languages && languages.length > 0 && (
        <Section styles={styles} title="Languages" variant="bg">
          <div style={styles.skillsLayout}>
            {languages.map((l, i) => (
              <div key={i} style={styles.langRow}>
                <span style={styles.skillName}>{l.language}</span>
                {l.fluency && <span style={styles.langLevel}>{l.fluency}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Interests ── */}
      {interests && interests.length > 0 && (
        <Section styles={styles} title="Interests" variant="underline">
          <div style={styles.skillsLayout}>
            {interests.map((int, i) => (
              <div key={i} style={styles.skillCategory}>
                <span style={styles.skillName}>{int.name}</span>
                {int.keywords && (
                  <span style={styles.entryDates}>{int.keywords.join(' · ')}</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Volunteer ── */}
      {volunteer && volunteer.length > 0 && (
        <Section styles={styles} title="Volunteer" variant="underline">
          {volunteer.map((v, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <div>
                  <span style={styles.entryTitle}>{v.position}</span>
                  {v.organization && <span style={styles.entryOrg}> at {v.organization}</span>}
                </div>
                <div style={styles.entryDates}>
                  {formatDate(v.startDate)} – {formatDate(v.endDate)}
                </div>
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* ── Leadership ── */}
      {leadership && leadership.length > 0 && (
        <Section styles={styles} title="Leadership" variant="bg">
          {leadership.map((l, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHeader}>
                <div>
                  <span style={styles.entryTitle}>{l.role}</span>
                  {l.organization && <span style={styles.entryOrg}> — {l.organization}</span>}
                </div>
                <div style={styles.entryDates}>
                  {formatDate(l.startDate)} – {formatDate(l.endDate)}
                </div>
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* ── Research ── */}
      {researchThreads && researchThreads.length > 0 && (
        <Section styles={styles} title="Research" variant="accent">
          {researchThreads.map((r, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryTitle}>{r.name}</div>
              {r.summary && <p style={styles.entrySummary}>{r.summary}</p>}
              {r.keywords && r.keywords.length > 0 && (
                <div style={styles.skillChips}>
                  {r.keywords.map((k, ki) => (
                    <span key={ki} style={styles.skillChipAccent}>{k}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* ── Presentations ── */}
      {presentations && presentations.length > 0 && (
        <Section styles={styles} title="Presentations" variant="underline">
          {presentations.map((p, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryTitle}>{p.name}</div>
              <div style={styles.entryMeta}>
                {p.conference && <span>{p.conference}</span>}
                {p.date && <span style={styles.entryDates}>{formatDate(p.date)}</span>}
              </div>
              {p.summary && <p style={styles.entrySummary}>{p.summary}</p>}
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}

function Section({
  title,
  variant,
  children,
  styles,
}: {
  title: string
  variant: 'underline' | 'bg' | 'accent'
  children: React.ReactNode
  styles: Record<string, React.CSSProperties>
}) {
  const variantStyle = variant === 'bg'
    ? styles.sectionPanel
    : variant === 'accent'
      ? styles.sectionAccent
      : undefined

  const titleStyle = variant === 'accent'
    ? styles.sectionTitleAccent
    : variant === 'bg'
      ? styles.sectionTitleSoft
      : styles.sectionTitle

  return (
    <section style={{ ...styles.section, ...variantStyle }}>
      <h2 style={titleStyle}>{title}</h2>
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
          ? 'var(--space-8) var(--space-6)'
          : 'var(--space-12) var(--space-10)',
      maxWidth: '100%',
      boxSizing: 'border-box',
    },
    header: {
      display: 'grid',
      gridTemplateColumns: full ? 'minmax(0, 1.1fr) minmax(14rem, 0.9fr)' : '1fr',
      gap: compact ? 'var(--space-4)' : 'var(--space-6)',
      marginBottom: 'var(--space-8)',
      padding: compact ? 'var(--space-5)' : 'var(--space-6)',
      backgroundColor: 'var(--color-surface-el)',
      border: '1px solid var(--color-border)',
    },
    name: {
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '2.35rem' : medium ? '3rem' : '4rem',
      fontWeight: 900,
      color: 'var(--color-heading)',
      lineHeight: compact ? 0.98 : 0.95,
      letterSpacing: '-0.04em',
      margin: 0,
      maxWidth: '10ch',
    },
    label: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      color: 'var(--color-accent)',
      marginTop: 'var(--space-3)',
      marginBottom: 'var(--space-4)',
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
    },
    contactRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      color: 'var(--color-text-muted)',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
    },
    contactItem: {
      display: 'inline-flex',
      alignItems: 'center',
    },
    summaryBlock: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : '6px minmax(0, 1fr)',
      gap: compact ? 'var(--space-3)' : 'var(--space-4)',
      marginBottom: 'var(--space-8)',
      padding: compact ? 'var(--space-4)' : 'var(--space-5)',
      background: 'linear-gradient(180deg, rgba(251,247,240,0.94), rgba(255,255,255,0.98))',
      border: '1px solid var(--color-border)',
    },
    summaryAccent: {
      width: compact ? '100%' : '6px',
      height: compact ? '3px' : 'auto',
      backgroundColor: 'var(--color-accent)',
      flexShrink: 0,
    },
    summary: {
      fontSize: compact ? '1rem' : '1.1rem',
      lineHeight: compact ? 1.7 : 1.8,
      color: 'var(--color-text)',
      margin: 0,
      fontStyle: 'italic',
      maxWidth: '54ch',
    },
    section: {
      marginTop: compact ? 'var(--space-7)' : 'var(--space-8)',
    },
    sectionPanel: {
      backgroundColor: 'var(--color-surface-el)',
      border: '1px solid var(--color-border)',
      padding: compact ? 'var(--space-4)' : 'var(--space-5)',
    },
    sectionAccent: {
      borderLeft: '4px solid var(--color-accent)',
      paddingLeft: compact ? 'var(--space-3)' : 'var(--space-4)',
    },
    sectionTitle: {
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '1.02rem' : '1.18rem',
      fontWeight: 700,
      color: 'var(--color-heading)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: 'var(--space-4)',
      lineHeight: 1.15,
      borderBottom: '2px solid var(--color-accent)',
      paddingBottom: 'var(--space-2)',
    },
    sectionTitleSoft: {
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '1.02rem' : '1.18rem',
      fontWeight: 700,
      color: 'var(--color-heading)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: 'var(--space-4)',
      lineHeight: 1.15,
      borderBottom: '1px solid var(--color-border)',
      paddingBottom: 'var(--space-2)',
    },
    sectionTitleAccent: {
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '1.02rem' : '1.18rem',
      fontWeight: 700,
      color: 'var(--color-accent)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: 'var(--space-4)',
      lineHeight: 1.15,
      borderBottom: '2px solid var(--color-accent)',
      paddingBottom: 'var(--space-2)',
    },
    entry: {
      marginBottom: compact ? 'var(--space-5)' : 'var(--space-6)',
      paddingTop: 'var(--space-2)',
      borderTop: '1px solid var(--color-border)',
    },
    entryHeader: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'minmax(0, 1fr) auto',
      gap: 'var(--space-2) var(--space-4)',
      alignItems: 'baseline',
    },
    entryTitle: {
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '1.02rem' : 'var(--font-size-h3)',
      fontWeight: 600,
      color: 'var(--color-text)',
      lineHeight: 'var(--line-height-h3)',
    },
    entryCompany: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      fontWeight: 600,
      color: 'var(--color-accent)',
      lineHeight: 'var(--line-height-caption)',
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      marginBottom: 'var(--space-1)',
    },
    entryOrg: {
      fontSize: 'var(--font-size-body)',
      color: 'var(--color-text-muted)',
      fontWeight: 400,
    },
    entryMeta: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      color: 'var(--color-text-muted)',
      textAlign: compact ? 'left' : 'right',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
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
      maxWidth: '62ch',
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
    skillsLayout: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'repeat(auto-fit, minmax(12rem, 1fr))',
      gap: 'var(--space-3)',
    },
    skillCategory: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'var(--space-2)',
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
      backgroundColor: 'var(--color-surface-el)',
      border: '1px solid var(--color-border)',
      borderRadius: '2px',
      padding: '2px 6px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    skillChipAccent: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      color: 'var(--color-accent)',
      backgroundColor: 'rgba(214, 164, 116, 0.12)',
      border: '1px solid var(--color-accent)',
      borderRadius: '2px',
      padding: '2px 6px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    projectCard: {
      padding: compact ? 'var(--space-4)' : 'var(--space-5)',
      backgroundColor: 'var(--color-surface-el)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      marginBottom: 'var(--space-4)',
      boxShadow: '0 18px 28px -24px rgba(23,23,23,0.18)',
    },
    projectHeader: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'minmax(0, 1fr) auto',
      gap: 'var(--space-2)',
      alignItems: 'baseline',
    },
    langRow: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 'var(--space-2)',
      alignItems: 'baseline',
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
  }
}
