import type React from 'react'
import type { TemplateProps } from '../templateUtils'
import { formatDate } from '../templateUtils'

export const TEMPLATE_ID = 'canvas'

/**
 * Canvas — Creative Expression
 * Target: Creative, Design, Arts
 * Asymmetric layout with full-width header, large display name,
 * pull-quote summary, varied section header styles.
 * Bold, expressive, design-forward.
 */
export default function CanvasTemplate({ data }: TemplateProps) {
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
            <span key={i} style={styles.contactItem}>{p.network}: {p.username}</span>
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
        <Section title="Experience" variant="underline">
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
        <Section title="Education" variant="bg">
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
        <Section title="Skills" variant="accent">
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
        <Section title="Projects" variant="underline">
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
        <Section title="Publications" variant="underline">
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
        <Section title="Certifications" variant="bg">
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
        <Section title="Awards" variant="accent">
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
        <Section title="Languages" variant="bg">
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
        <Section title="Interests" variant="underline">
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
        <Section title="Volunteer" variant="underline">
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
        <Section title="Leadership" variant="bg">
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
        <Section title="Research" variant="accent">
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
        <Section title="Presentations" variant="underline">
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

// ── Section with variant styles ──

function Section({ title, variant, children }: { title: string; variant: 'underline' | 'bg' | 'accent'; children: React.ReactNode }) {
  const variantStyle = variant === 'bg'
    ? { backgroundColor: 'var(--color-surface-el)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }
    : variant === 'accent'
    ? { borderLeft: '3px solid var(--color-accent)', paddingLeft: 'var(--space-4)' }
    : {}

  const titleStyle = variant === 'accent'
    ? { ...styles.sectionTitle, color: 'var(--color-accent)' }
    : variant === 'bg'
    ? { ...styles.sectionTitle, color: 'var(--color-heading)' }
    : styles.sectionTitle

  return (
    <section style={{ ...styles.section, ...variantStyle }}>
      <h2 style={titleStyle}>{title}</h2>
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
    padding: 'var(--space-12) var(--space-10)',
    maxWidth: '820px',
  },
  header: {
    marginBottom: 'var(--space-10)',
    paddingBottom: 'var(--space-8)',
    borderBottom: '3px solid var(--color-accent)',
  },
  name: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--font-size-h1)',
    fontWeight: 900,
    color: 'var(--color-heading)',
    lineHeight: 'var(--line-height-h1)',
    letterSpacing: '-0.03em',
    margin: 0,
  },
  label: {
    fontSize: 'var(--font-size-h3)',
    color: 'var(--color-accent)',
    marginTop: 'var(--space-2)',
    marginBottom: 'var(--space-4)',
    fontWeight: 400,
    fontStyle: 'italic' as const,
  },
  contactRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 'var(--space-4)',
    fontSize: 'var(--font-size-body-sm)',
    color: 'var(--color-text-muted)',
  },
  contactItem: {},
  summaryBlock: {
    display: 'flex',
    gap: 'var(--space-4)',
    marginBottom: 'var(--space-10)',
  },
  summaryAccent: {
    width: '3px',
    backgroundColor: 'var(--color-accent)',
    borderRadius: 'var(--radius-sm)',
    flexShrink: 0,
  },
  summary: {
    fontSize: 'var(--font-size-body)',
    lineHeight: 'var(--line-height-body)',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic' as const,
    margin: 0,
  },
  section: {
    marginTop: 'var(--space-10)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--font-size-h2)',
    fontWeight: 700,
    color: 'var(--color-heading)',
    letterSpacing: 'var(--letter-spacing-h2)',
    textTransform: 'uppercase' as const,
    marginBottom: 'var(--space-5)',
    lineHeight: 'var(--line-height-h2)',
    borderBottom: '2px solid var(--color-accent)',
    paddingBottom: 'var(--space-2)',
  },
  entry: {
    marginBottom: 'var(--space-6)',
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
    lineHeight: 'var(--line-height-h3)',
  },
  entryCompany: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--color-accent)',
    lineHeight: 'var(--line-height-body)',
  },
  entryOrg: {
    fontSize: 'var(--font-size-body)',
    color: 'var(--color-text-muted)',
    fontWeight: 400,
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
    marginTop: 'var(--space-2)',
    lineHeight: 'var(--line-height-body-sm)',
  },
  highlights: {
    listStyle: 'none',
    padding: 0,
    margin: 'var(--space-2) 0 0 0',
  },
  highlightItem: {
    paddingLeft: 'var(--space-4)',
    fontSize: 'var(--font-size-body-sm)',
    lineHeight: 'var(--line-height-body-sm)',
    marginBottom: 'var(--space-2)',
  },
  skillsLayout: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-4)',
  },
  skillCategory: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
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
    backgroundColor: 'var(--color-surface-el)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-0) var(--space-2)',
  },
  skillChipAccent: {
    fontSize: 'var(--font-size-caption)',
    color: 'var(--color-accent)',
    backgroundColor: 'var(--color-primary-light)',
    border: '1px solid var(--color-accent)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-0) var(--space-2)',
  },
  projectCard: {
    padding: 'var(--space-4)',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: 'var(--space-4)',
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flexWrap: 'wrap' as const,
    gap: 'var(--space-2)',
  },
  langRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    fontSize: 'var(--font-size-body-sm)',
  },
  langLevel: {
    color: 'var(--color-text-muted)',
    fontSize: 'var(--font-size-caption)',
  },
}
