import type { CSSProperties, ReactNode } from 'react'
import type { TemplateProps, TemplateLayoutMode } from '../templateUtils'
import { formatDate } from '../templateUtils'

export const TEMPLATE_ID = 'archive'

interface SectionDefinition {
  key: string
  title: string
  lead: string
  content: ReactNode
}

interface MetricDefinition {
  label: string
  value: string
  note: string
}

interface FocusPanelDefinition {
  kicker: string
  title: string
  body: string
  links?: LinkDefinition[]
}

interface LinkDefinition {
  label: string
  href: string
}

const SECTION_LEADS: Record<string, string> = {
  experience: 'Clinical, research, and organizational appointments arranged with stronger context and hierarchy.',
  education: 'Institutional training, degrees, and academic formation.',
  research: 'Thematic research lanes that connect written work, presentations, and ongoing inquiry.',
  publications: 'Selected scholarship, indexed work, and formal written output.',
  presentations: 'Poster, podium, and conference-facing visibility.',
  projects: 'Builder work, product experiments, and shipped portfolio surfaces.',
  leadership: 'Teaching, representation, curriculum design, and program-building work.',
  volunteer: 'Direct service, community commitments, and mission-driven work.',
  skills: 'Tools, domains, and working fluencies.',
  certifications: 'Formal credentials and issued qualifications.',
  awards: 'Honors, awards, and institutional recognition.',
  languages: 'Languages and fluency.',
  interests: 'Personal curiosities and identity outside the formal CV.',
  references: 'Named references and testimonial context.',
}

export default function ArchiveTemplate({ data, layoutMode }: TemplateProps) {
  const styles = getStyles(layoutMode)
  const {
    basics,
    work,
    education,
    skills,
    publications,
    presentations,
    projects,
    researchThreads = [],
    leadership = [],
    volunteer = [],
    awards = [],
    interests = [],
    references = [],
    certifications = [],
    languages = [],
  } = data

  const locationLabel = [basics.location?.city, basics.location?.region].filter(Boolean).join(', ')

  const reachItems = [
    locationLabel ? { label: 'Location', value: locationLabel } : null,
    basics.email ? { label: 'Email', value: basics.email } : null,
    basics.phone ? { label: 'Phone', value: basics.phone } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item))

  const linkItems = [
    basics.url ? { label: 'Website', href: basics.url } : null,
    ...(basics.profiles ?? [])
      .filter((profile) => profile.url)
      .map((profile) => ({
        label: profile.network,
        href: profile.url!,
      })),
  ].filter((item): item is LinkDefinition => Boolean(item))

  const metrics: MetricDefinition[] = [
    work.length > 0 ? { label: 'Appointments', value: String(work.length).padStart(2, '0'), note: 'experience entries' } : null,
    publications.length > 0 ? { label: 'Publications', value: String(publications.length).padStart(2, '0'), note: 'listed papers' } : null,
    presentations.length > 0 ? { label: 'Presentations', value: String(presentations.length).padStart(2, '0'), note: 'conference records' } : null,
    projects.length > 0 ? { label: 'Projects', value: String(projects.length).padStart(2, '0'), note: 'builder work' } : null,
  ].filter((metric): metric is MetricDefinition => Boolean(metric))

  const focusPanels = buildFocusPanels({
    basics,
    education,
    work,
    researchThreads,
    publications,
    projects,
    leadership,
  })

  const sections: SectionDefinition[] = []

  if (work.length > 0) {
    sections.push({
      key: 'experience',
      title: 'Experience',
      lead: SECTION_LEADS.experience,
      content: work.map((entry, index) => (
        <DetailEntry
          key={`work-${index}`}
          styles={styles}
          title={entry.position}
          subtitle={entry.name}
          meta={[entry.location, formatDateRange(entry.startDate, entry.endDate)]}
          summary={entry.summary}
          highlights={entry.highlights}
          links={entry.url ? [{ label: 'View', href: entry.url }] : []}
        />
      )),
    })
  }

  if (education.length > 0) {
    sections.push({
      key: 'education',
      title: 'Education',
      lead: SECTION_LEADS.education,
      content: education.map((entry, index) => (
        <DetailEntry
          key={`education-${index}`}
          styles={styles}
          title={entry.institution}
          subtitle={joinParts([entry.studyType, entry.area], ' · ')}
          meta={[entry.score, formatDateRange(entry.startDate, entry.endDate)]}
          summary={entry.highlights?.length ? undefined : undefined}
          highlights={entry.highlights}
          links={entry.url ? [{ label: 'Program', href: entry.url }] : []}
          note={entry.score}
        />
      )),
    })
  }

  if (researchThreads.length > 0) {
    sections.push({
      key: 'research',
      title: 'Research Threads',
      lead: SECTION_LEADS.research,
      content: (
        <div style={styles.gridCards}>
          {researchThreads.map((thread, index) => (
            <article key={`thread-${index}`} style={styles.featureCard}>
              <p style={styles.cardKicker}>Research thread</p>
              <h3 style={styles.cardTitle}>{thread.name}</h3>
              <p style={styles.cardSummary}>{thread.summary}</p>
              {thread.keywords.length > 0 && (
                <div style={styles.chipRow}>
                  {thread.keywords.map((keyword) => (
                    <span key={keyword} style={styles.chip}>{keyword}</span>
                  ))}
                </div>
              )}
              {(thread.publications?.length || thread.presentations?.length) ? (
                <p style={styles.cardFootnote}>
                  {thread.publications?.length ? `${thread.publications.length} linked publication${thread.publications.length === 1 ? '' : 's'}` : null}
                  {thread.publications?.length && thread.presentations?.length ? ' · ' : null}
                  {thread.presentations?.length ? `${thread.presentations.length} linked presentation${thread.presentations.length === 1 ? '' : 's'}` : null}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ),
    })
  }

  if (publications.length > 0) {
    sections.push({
      key: 'publications',
      title: 'Publications',
      lead: SECTION_LEADS.publications,
      content: publications.map((publication, index) => (
        <article key={`publication-${index}`} style={styles.citationCard}>
          <div style={styles.entryHeader}>
            <div style={styles.entryIdentity}>
              {publication.releaseDate ? <p style={styles.cardKicker}>{formatYear(publication.releaseDate)}</p> : null}
              <h3 style={styles.citationTitle}>{publication.name}</h3>
            </div>
            <div style={styles.entryMetaBlock}>
              {publication.type ? <span style={styles.metaChip}>{publication.type}</span> : null}
              {publication.pmid ? <span style={styles.metaChip}>PMID {publication.pmid}</span> : null}
            </div>
          </div>

          {buildPublicationLine(publication) ? <p style={styles.citationMeta}>{buildPublicationLine(publication)}</p> : null}
          {publication.summary ? <p style={styles.cardSummary}>{publication.summary}</p> : null}

          {buildPublicationLinks(publication).length > 0 ? (
            <div style={styles.linkRow}>
              {buildPublicationLinks(publication).map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" style={styles.inlineLink}>
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </article>
      )),
    })
  }

  if (presentations.length > 0) {
    sections.push({
      key: 'presentations',
      title: 'Presentations',
      lead: SECTION_LEADS.presentations,
      content: (
        <div style={styles.gridCards}>
          {presentations.map((presentation, index) => (
            <article key={`presentation-${index}`} style={styles.featureCard}>
              {presentation.date ? <p style={styles.cardKicker}>{formatDate(presentation.date)}</p> : null}
              <h3 style={styles.cardTitle}>{presentation.name}</h3>
              <p style={styles.cardSummary}>{joinParts([presentation.conference, presentation.location, presentation.type], ' · ')}</p>
              {presentation.summary ? <p style={styles.cardBody}>{presentation.summary}</p> : null}
              {presentation.url ? (
                <div style={styles.linkRow}>
                  <a href={presentation.url} target="_blank" rel="noreferrer" style={styles.inlineLink}>
                    View reference
                  </a>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ),
    })
  }

  if (projects.length > 0) {
    sections.push({
      key: 'projects',
      title: 'Builder Lab',
      lead: SECTION_LEADS.projects,
      content: (
        <div style={styles.gridCards}>
          {projects.map((project, index) => (
            <article key={`project-${index}`} style={styles.featureCard}>
              <p style={styles.cardKicker}>{formatDateRange(project.startDate, project.endDate) || 'Project'}</p>
              <h3 style={styles.cardTitle}>{project.name}</h3>
              {project.description ? <p style={styles.cardSummary}>{project.description}</p> : null}
              {project.highlights?.length ? <BulletList styles={styles} items={project.highlights} /> : null}
              {project.tech?.length ? (
                <div style={styles.chipRow}>
                  {project.tech.map((item) => (
                    <span key={item} style={styles.chip}>{item}</span>
                  ))}
                </div>
              ) : null}
              {project.url ? (
                <div style={styles.linkRow}>
                  <a href={project.url} target="_blank" rel="noreferrer" style={styles.inlineLink}>
                    Open project
                  </a>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ),
    })
  }

  if (leadership.length > 0) {
    sections.push({
      key: 'leadership',
      title: 'Leadership',
      lead: SECTION_LEADS.leadership,
      content: leadership.map((entry, index) => (
        <DetailEntry
          key={`leadership-${index}`}
          styles={styles}
          title={entry.role}
          subtitle={entry.organization}
          meta={[formatDateRange(entry.startDate, entry.endDate)]}
          summary={entry.summary}
          highlights={entry.highlights}
          links={entry.url ? [{ label: 'Reference', href: entry.url }] : []}
        />
      )),
    })
  }

  if (volunteer.length > 0) {
    sections.push({
      key: 'volunteer',
      title: 'Volunteer',
      lead: SECTION_LEADS.volunteer,
      content: volunteer.map((entry, index) => (
        <DetailEntry
          key={`volunteer-${index}`}
          styles={styles}
          title={entry.position}
          subtitle={entry.organization}
          meta={[formatDateRange(entry.startDate, entry.endDate)]}
          summary={entry.summary}
          highlights={entry.highlights}
          links={entry.url ? [{ label: 'Reference', href: entry.url }] : []}
        />
      )),
    })
  }

  if (skills.length > 0) {
    sections.push({
      key: 'skills',
      title: 'Skills',
      lead: SECTION_LEADS.skills,
      content: (
        <div style={styles.gridCards}>
          {skills.map((skill, index) => (
            <article key={`skill-${index}`} style={styles.featureCard}>
              <p style={styles.cardKicker}>{skill.level ?? 'Working domain'}</p>
              <h3 style={styles.cardTitle}>{skill.name}</h3>
              {skill.keywords?.length ? (
                <div style={styles.chipRow}>
                  {skill.keywords.map((keyword) => (
                    <span key={keyword} style={styles.chip}>{keyword}</span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ),
    })
  }

  if (certifications.length > 0) {
    sections.push({
      key: 'certifications',
      title: 'Certifications',
      lead: SECTION_LEADS.certifications,
      content: certifications.map((entry, index) => (
        <DetailEntry
          key={`certification-${index}`}
          styles={styles}
          title={entry.name}
          subtitle={entry.issuer}
          meta={[entry.date ? formatDate(entry.date) : '']}
          links={entry.url ? [{ label: 'Verify', href: entry.url }] : []}
        />
      )),
    })
  }

  if (awards.length > 0) {
    sections.push({
      key: 'awards',
      title: 'Awards',
      lead: SECTION_LEADS.awards,
      content: awards.map((entry, index) => (
        <DetailEntry
          key={`award-${index}`}
          styles={styles}
          title={entry.title}
          subtitle={entry.awarder}
          meta={[entry.date ? formatDate(entry.date) : '']}
          summary={entry.summary}
          links={entry.url ? [{ label: 'Reference', href: entry.url }] : []}
        />
      )),
    })
  }

  if (languages.length > 0) {
    sections.push({
      key: 'languages',
      title: 'Languages',
      lead: SECTION_LEADS.languages,
      content: (
        <div style={styles.inlineGrid}>
          {languages.map((entry, index) => (
            <div key={`language-${index}`} style={styles.inlineCard}>
              <span style={styles.inlineCardTitle}>{entry.language}</span>
              {entry.fluency ? <span style={styles.inlineCardMeta}>{entry.fluency}</span> : null}
            </div>
          ))}
        </div>
      ),
    })
  }

  if (interests.length > 0) {
    sections.push({
      key: 'interests',
      title: 'Interests',
      lead: SECTION_LEADS.interests,
      content: (
        <div style={styles.inlineGrid}>
          {interests.map((entry, index) => (
            <div key={`interest-${index}`} style={styles.inlineCard}>
              <span style={styles.inlineCardTitle}>{entry.name}</span>
              {entry.keywords?.length ? <span style={styles.inlineCardMeta}>{entry.keywords.join(', ')}</span> : null}
            </div>
          ))}
        </div>
      ),
    })
  }

  if (references.length > 0) {
    sections.push({
      key: 'references',
      title: 'References',
      lead: SECTION_LEADS.references,
      content: references.map((entry, index) => (
        <article key={`reference-${index}`} style={styles.referenceCard}>
          <h3 style={styles.cardTitle}>{entry.name}</h3>
          {entry.reference ? <p style={styles.referenceText}>“{entry.reference}”</p> : null}
        </article>
      )),
    })
  }

  return (
    <div style={styles.root}>
      <div style={styles.topRail}>
        <span style={styles.topKicker}>Academic portfolio resume</span>
        <span style={styles.topMeta}>{basics.label ?? 'Reader-ready dossier'}</span>
      </div>

      <header style={styles.hero}>
        <div style={styles.heroMain}>
          {basics.label ? <p style={styles.heroLabel}>{basics.label}</p> : null}
          {basics.name ? <h1 style={styles.name}>{basics.name}</h1> : null}
          {basics.summary ? <p style={styles.heroSummary}>{basics.summary}</p> : null}
        </div>

        {(reachItems.length > 0 || linkItems.length > 0) ? (
          <aside style={styles.heroAside}>
            {reachItems.length > 0 ? (
              <div style={styles.infoBlock}>
                <p style={styles.infoHeading}>Reach</p>
                <div style={styles.infoList}>
                  {reachItems.map((item) => (
                    <div key={`${item.label}-${item.value}`} style={styles.infoRow}>
                      <span style={styles.infoLabel}>{item.label}</span>
                      <span style={styles.infoValue}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {linkItems.length > 0 ? (
              <div style={styles.infoBlock}>
                <p style={styles.infoHeading}>Links</p>
                <div style={styles.linkStack}>
                  {linkItems.map((item) => (
                    <a key={`${item.label}-${item.href}`} href={item.href} target="_blank" rel="noreferrer" style={styles.infoLink}>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        ) : null}
      </header>

      {metrics.length > 0 ? (
        <section style={styles.metricGrid}>
          {metrics.map((metric) => (
            <article key={metric.label} style={styles.metricCard}>
              <p style={styles.metricLabel}>{metric.label}</p>
              <p style={styles.metricValue}>{metric.value}</p>
              <p style={styles.metricNote}>{metric.note}</p>
            </article>
          ))}
        </section>
      ) : null}

      {focusPanels.length > 0 ? (
        <section style={styles.focusGrid}>
          {focusPanels.map((panel) => (
            <article key={`${panel.kicker}-${panel.title}`} style={styles.focusPanel}>
              <p style={styles.focusKicker}>{panel.kicker}</p>
              <h2 style={styles.focusTitle}>{panel.title}</h2>
              <p style={styles.focusBody}>{panel.body}</p>
              {panel.links?.length ? (
                <div style={styles.linkRow}>
                  {panel.links.map((link) => (
                    <a key={`${link.label}-${link.href}`} href={link.href} target="_blank" rel="noreferrer" style={styles.inlineLink}>
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      {sections.map((section, index) => (
        <DocumentSection
          key={section.key}
          styles={styles}
          index={index + 1}
          title={section.title}
          lead={section.lead}
        >
          {section.content}
        </DocumentSection>
      ))}
    </div>
  )
}

function DocumentSection({
  styles,
  index,
  title,
  lead,
  children,
}: {
  styles: ReturnType<typeof getStyles>
  index: number
  title: string
  lead: string
  children: ReactNode
}) {
  return (
    <section style={styles.section}>
      <div style={styles.sectionHeading}>
        <div style={styles.sectionMarker}>
          <span style={styles.sectionNumber}>{String(index).padStart(2, '0')}</span>
        </div>
        <div style={styles.sectionTitleBlock}>
          <p style={styles.sectionKicker}>Section</p>
          <h2 style={styles.sectionTitle}>{title}</h2>
          <p style={styles.sectionLead}>{lead}</p>
        </div>
      </div>
      <div style={styles.sectionBody}>{children}</div>
    </section>
  )
}

function DetailEntry({
  styles,
  title,
  subtitle,
  meta,
  summary,
  highlights,
  links = [],
  note,
}: {
  styles: ReturnType<typeof getStyles>
  title: string
  subtitle?: string
  meta: Array<string | undefined>
  summary?: string
  highlights?: string[]
  links?: LinkDefinition[]
  note?: string
}) {
  const metaItems = meta.filter(Boolean)

  return (
    <article style={styles.entryCard}>
      <div style={styles.entryHeader}>
        <div style={styles.entryIdentity}>
          <h3 style={styles.entryTitle}>{title}</h3>
          {subtitle ? <p style={styles.entrySubtitle}>{subtitle}</p> : null}
        </div>
        {metaItems.length > 0 ? (
          <div style={styles.entryMetaBlock}>
            {metaItems.map((item) => (
              <span key={item} style={styles.metaChip}>{item}</span>
            ))}
          </div>
        ) : null}
      </div>

      {note && !summary ? <p style={styles.cardSummary}>{note}</p> : null}
      {summary ? <p style={styles.cardSummary}>{summary}</p> : null}
      {highlights?.length ? <BulletList styles={styles} items={highlights} /> : null}

      {links.length > 0 ? (
        <div style={styles.linkRow}>
          {links.map((link) => (
            <a key={`${link.label}-${link.href}`} href={link.href} target="_blank" rel="noreferrer" style={styles.inlineLink}>
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  )
}

function BulletList({ styles, items }: { styles: ReturnType<typeof getStyles>; items: string[] }) {
  return (
    <ul style={styles.bulletList}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`} style={styles.bulletItem}>
          <span style={styles.bulletMark}>—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function formatDateRange(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) return ''

  const start = formatDate(startDate)
  const end = endDate === 'present' ? 'Present' : formatDate(endDate) || 'Present'

  if (!start) return end
  return `${start} - ${end}`
}

function formatYear(date?: string) {
  return date?.split('-')[0] ?? ''
}

function joinParts(parts: Array<string | undefined>, separator: string) {
  return parts.filter(Boolean).join(separator)
}

function buildPublicationLine(publication: {
  publisher?: string
  volume?: string
  pages?: string
}) {
  return [publication.publisher, publication.volume, publication.pages].filter(Boolean).join(' · ')
}

function buildPublicationLinks(publication: {
  url?: string
  doi?: string
  pmid?: string
}) {
  const links: LinkDefinition[] = []

  if (publication.url) {
    links.push({ label: 'Source', href: publication.url })
  }

  if (publication.doi) {
    const href = publication.doi.startsWith('http') ? publication.doi : `https://doi.org/${publication.doi}`
    links.push({ label: 'DOI', href })
  }

  if (publication.pmid) {
    links.push({ label: 'PubMed', href: `https://pubmed.ncbi.nlm.nih.gov/${publication.pmid}/` })
  }

  return links
}

function buildFocusPanels({
  basics,
  education,
  work,
  researchThreads,
  publications,
  projects,
  leadership,
}: {
  basics: TemplateProps['data']['basics']
  education: TemplateProps['data']['education']
  work: TemplateProps['data']['work']
  researchThreads: NonNullable<TemplateProps['data']['researchThreads']>
  publications: TemplateProps['data']['publications']
  projects: TemplateProps['data']['projects']
  leadership: NonNullable<TemplateProps['data']['leadership']>
}) {
  const panels: FocusPanelDefinition[] = []

  const firstEducation = education[0]
  const firstWork = work[0]
  const firstResearchThread = researchThreads[0]
  const firstPublication = publications[0]
  const firstProject = projects[0]
  const firstLeadership = leadership[0]

  const profileTitle = basics.label
    ?? joinParts([firstEducation?.studyType, firstEducation?.area], ' · ')
    ?? firstWork?.position
    ?? 'Candidate profile'

  const profileBody = firstEducation?.highlights?.[0]
    ?? firstWork?.summary
    ?? basics.summary
    ?? 'A reader-facing profile that balances training, credibility, and high-signal narrative context.'

  panels.push({
    kicker: 'Current lane',
    title: profileTitle,
    body: profileBody,
    links: basics.url ? [{ label: 'Website', href: basics.url }] : [],
  })

  if (firstResearchThread || firstPublication) {
    panels.push({
      kicker: 'Research lineage',
      title: firstResearchThread?.name ?? firstPublication?.name ?? 'Research profile',
      body: firstResearchThread?.summary
        ?? firstPublication?.summary
        ?? 'Publication-aware work arranged to feel closer to a research atlas than a conventional CV dump.',
      links: firstPublication ? buildPublicationLinks(firstPublication).slice(0, 2) : [],
    })
  }

  if (firstProject || firstLeadership) {
    panels.push({
      kicker: firstProject ? 'Parallel craft' : 'Leadership lane',
      title: firstProject?.name ?? firstLeadership?.role ?? 'Additional work',
      body: firstProject?.description
        ?? firstProject?.highlights?.[0]
        ?? firstLeadership?.summary
        ?? firstLeadership?.highlights?.[0]
        ?? 'A second signal lane that shows range beyond the main professional track.',
      links: firstProject?.url ? [{ label: 'View work', href: firstProject.url }] : [],
    })
  }

  return panels.slice(0, 3)
}

function getStyles(layoutMode: TemplateLayoutMode) {
  const compact = layoutMode === 'compact'
  const medium = layoutMode === 'medium'

  const rootPadding = compact
    ? 'var(--space-5) var(--space-4)'
    : medium
      ? 'var(--space-8) var(--space-7)'
      : 'var(--space-12) var(--space-10)'

  const sectionColumns = compact ? '1fr' : '72px minmax(0, 1fr)'

  return {
    root: {
      padding: rootPadding,
      color: 'var(--color-text)',
      fontFamily: 'var(--font-body)',
      lineHeight: 'var(--line-height-body)',
      background:
        'linear-gradient(180deg, color-mix(in oklab, var(--color-surface-el) 78%, white 22%) 0%, #ffffff 16rem)',
      minHeight: '100%',
      boxSizing: 'border-box',
    } satisfies CSSProperties,
    topRail: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      alignItems: 'center',
      paddingBottom: 'var(--space-4)',
      borderBottom: '1px solid var(--color-border)',
    } satisfies CSSProperties,
    topKicker: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--color-accent)',
    } satisfies CSSProperties,
    topMeta: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--color-text-muted)',
      textAlign: 'right',
    } satisfies CSSProperties,
    hero: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'minmax(0, 1.4fr) minmax(15rem, 0.85fr)',
      gap: compact ? 'var(--space-6)' : 'var(--space-8)',
      alignItems: 'start',
      paddingTop: compact ? 'var(--space-5)' : 'var(--space-7)',
      paddingBottom: compact ? 'var(--space-6)' : 'var(--space-8)',
      borderBottom: '1px solid var(--color-border)',
    } satisfies CSSProperties,
    heroMain: {
      minWidth: 0,
    } satisfies CSSProperties,
    heroLabel: {
      margin: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'var(--color-accent)',
    } satisfies CSSProperties,
    name: {
      margin: 'var(--space-3) 0 0 0',
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '2.35rem' : medium ? '3rem' : '3.7rem',
      lineHeight: compact ? 0.96 : 0.92,
      letterSpacing: '-0.035em',
      fontWeight: 'var(--font-heading-weight)',
      color: 'var(--color-heading)',
      maxWidth: '10ch',
      textWrap: 'balance',
    } satisfies CSSProperties,
    heroSummary: {
      margin: 'var(--space-4) 0 0 0',
      maxWidth: compact ? 'none' : '58ch',
      fontSize: compact ? '0.98rem' : '1.08rem',
      lineHeight: compact ? 1.72 : 1.82,
      color: 'var(--color-text)',
    } satisfies CSSProperties,
    heroAside: {
      display: 'grid',
      gap: 'var(--space-4)',
      padding: compact ? 'var(--space-4)' : 'var(--space-5)',
      border: '1px solid var(--color-border)',
      borderRadius: '18px',
      background: 'color-mix(in oklab, var(--color-surface-el) 76%, white 24%)',
      boxShadow: '0 18px 32px -28px color-mix(in oklab, var(--color-primary-dark) 38%, transparent)',
      breakInside: 'avoid',
    } satisfies CSSProperties,
    infoBlock: {
      display: 'grid',
      gap: 'var(--space-2)',
    } satisfies CSSProperties,
    infoHeading: {
      margin: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--color-text-muted)',
    } satisfies CSSProperties,
    infoList: {
      display: 'grid',
      gap: 'var(--space-2)',
    } satisfies CSSProperties,
    infoRow: {
      display: 'grid',
      gap: 'var(--space-1)',
    } satisfies CSSProperties,
    infoLabel: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--color-text-muted)',
    } satisfies CSSProperties,
    infoValue: {
      fontSize: 'var(--font-size-body-sm)',
      lineHeight: 'var(--line-height-body-sm)',
      color: 'var(--color-text)',
      wordBreak: 'break-word',
    } satisfies CSSProperties,
    linkStack: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2)',
    } satisfies CSSProperties,
    infoLink: {
      display: 'inline-flex',
      alignItems: 'center',
      border: '1px solid var(--color-border)',
      borderRadius: '999px',
      padding: '0.35rem 0.7rem',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      color: 'var(--color-text)',
      textDecoration: 'none',
      background: 'rgba(255, 255, 255, 0.7)',
    } satisfies CSSProperties,
    metricGrid: {
      display: 'grid',
      gridTemplateColumns: compact ? 'repeat(2, minmax(0, 1fr))' : 'repeat(auto-fit, minmax(9rem, 1fr))',
      gap: 'var(--space-3)',
      paddingTop: compact ? 'var(--space-5)' : 'var(--space-6)',
    } satisfies CSSProperties,
    metricCard: {
      padding: compact ? 'var(--space-3) 0 0 0' : 'var(--space-4) 0 0 0',
      borderTop: '1px solid color-mix(in oklab, var(--color-accent) 28%, var(--color-border) 72%)',
      borderRadius: 0,
      borderRight: 0,
      borderBottom: 0,
      borderLeft: 0,
      background: 'transparent',
      breakInside: 'avoid',
    } satisfies CSSProperties,
    metricLabel: {
      margin: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--color-text-muted)',
    } satisfies CSSProperties,
    metricValue: {
      margin: 'var(--space-2) 0 0 0',
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '1.7rem' : '2rem',
      lineHeight: 1,
      letterSpacing: '-0.04em',
      color: 'var(--color-heading)',
    } satisfies CSSProperties,
    metricNote: {
      margin: 'var(--space-2) 0 0 0',
      fontSize: 'var(--font-size-body-sm)',
      color: 'var(--color-text-muted)',
    } satisfies CSSProperties,
    focusGrid: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'repeat(3, minmax(0, 1fr))',
      gap: 'var(--space-4)',
      paddingTop: compact ? 'var(--space-6)' : 'var(--space-8)',
    } satisfies CSSProperties,
    focusPanel: {
      display: 'grid',
      gap: 'var(--space-2)',
      alignContent: 'start',
      padding: compact ? 'var(--space-4)' : 'var(--space-5)',
      borderTop: '1px solid color-mix(in oklab, var(--color-accent) 36%, var(--color-border) 64%)',
      background: 'linear-gradient(180deg, color-mix(in oklab, var(--color-surface-el) 58%, white 42%), transparent 78%)',
      minHeight: compact ? 'auto' : '13rem',
      breakInside: 'avoid',
      pageBreakInside: 'avoid',
    } satisfies CSSProperties,
    focusKicker: {
      margin: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--color-accent)',
    } satisfies CSSProperties,
    focusTitle: {
      margin: 'var(--space-1) 0 0 0',
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '1.14rem' : '1.35rem',
      lineHeight: 1.12,
      letterSpacing: '-0.03em',
      color: 'var(--color-heading)',
    } satisfies CSSProperties,
    focusBody: {
      margin: 'var(--space-2) 0 0 0',
      fontSize: compact ? 'var(--font-size-body-sm)' : 'var(--font-size-body)',
      lineHeight: 1.78,
      color: 'var(--color-text)',
    } satisfies CSSProperties,
    section: {
      display: 'grid',
      gridTemplateColumns: sectionColumns,
      gap: compact ? 'var(--space-4)' : 'var(--space-6)',
      paddingTop: compact ? 'var(--space-6)' : 'var(--space-8)',
      marginTop: compact ? 'var(--space-6)' : 'var(--space-8)',
      borderTop: '1px solid var(--color-border)',
    } satisfies CSSProperties,
    sectionHeading: {
      display: compact ? 'flex' : 'contents',
      flexDirection: 'column',
      gap: compact ? 'var(--space-3)' : undefined,
    } satisfies CSSProperties,
    sectionMarker: {
      display: 'flex',
      alignItems: compact ? 'center' : 'flex-start',
      justifyContent: compact ? 'space-between' : 'flex-start',
      minWidth: 0,
    } satisfies CSSProperties,
    sectionNumber: {
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '1.1rem' : '1.35rem',
      lineHeight: 1,
      color: 'var(--color-accent)',
      opacity: 0.95,
    } satisfies CSSProperties,
    sectionTitleBlock: {
      display: 'grid',
      gap: 'var(--space-2)',
      minWidth: 0,
    } satisfies CSSProperties,
    sectionKicker: {
      margin: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--color-text-muted)',
    } satisfies CSSProperties,
    sectionTitle: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '1.35rem' : '1.7rem',
      lineHeight: 1.05,
      letterSpacing: '-0.03em',
      color: 'var(--color-heading)',
    } satisfies CSSProperties,
    sectionLead: {
      margin: 0,
      fontSize: 'var(--font-size-body-sm)',
      lineHeight: 1.7,
      color: 'var(--color-text-muted)',
      maxWidth: compact ? 'none' : '30ch',
    } satisfies CSSProperties,
    sectionBody: {
      display: 'grid',
      gap: 'var(--space-3)',
      minWidth: 0,
    } satisfies CSSProperties,
    entryCard: {
      display: 'grid',
      gap: 'var(--space-3)',
      padding: compact ? 'var(--space-4) 0 0 0' : 'var(--space-5) 0 0 0',
      borderTop: '1px solid var(--color-border)',
      borderRadius: 0,
      borderRight: 0,
      borderBottom: 0,
      borderLeft: 0,
      background: 'transparent',
      boxShadow: 'none',
      breakInside: 'avoid',
      pageBreakInside: 'avoid',
    } satisfies CSSProperties,
    entryHeader: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'minmax(0, 1fr) auto',
      gap: 'var(--space-3)',
      alignItems: 'start',
    } satisfies CSSProperties,
    entryIdentity: {
      minWidth: 0,
    } satisfies CSSProperties,
    entryTitle: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '1.06rem' : '1.22rem',
      lineHeight: 1.12,
      color: 'var(--color-heading)',
    } satisfies CSSProperties,
    entrySubtitle: {
      margin: 'var(--space-1) 0 0 0',
      fontSize: compact ? 'var(--font-size-body-sm)' : 'var(--font-size-body)',
      lineHeight: compact ? 'var(--line-height-body-sm)' : 'var(--line-height-body)',
      color: 'var(--color-text-muted)',
    } satisfies CSSProperties,
    entryMetaBlock: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: compact ? 'flex-start' : 'flex-end',
      gap: 'var(--space-2)',
    } satisfies CSSProperties,
    metaChip: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '999px',
      border: '1px solid var(--color-border)',
      padding: '0.26rem 0.6rem',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'var(--color-text-muted)',
      background: 'color-mix(in oklab, white 78%, var(--color-surface-el) 22%)',
    } satisfies CSSProperties,
    cardKicker: {
      margin: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      fontWeight: 600,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--color-accent)',
    } satisfies CSSProperties,
    cardTitle: {
      margin: 'var(--space-2) 0 0 0',
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '1.04rem' : '1.18rem',
      lineHeight: 1.16,
      color: 'var(--color-heading)',
    } satisfies CSSProperties,
    cardSummary: {
      margin: 'var(--space-2) 0 0 0',
      fontSize: compact ? 'var(--font-size-body-sm)' : 'var(--font-size-body)',
      lineHeight: compact ? 'var(--line-height-body-sm)' : 1.72,
      color: 'var(--color-text)',
    } satisfies CSSProperties,
    cardBody: {
      margin: 'var(--space-2) 0 0 0',
      fontSize: 'var(--font-size-body-sm)',
      lineHeight: 1.72,
      color: 'var(--color-text-muted)',
    } satisfies CSSProperties,
    cardFootnote: {
      margin: 'var(--space-3) 0 0 0',
      fontSize: 'var(--font-size-caption)',
      lineHeight: 1.7,
      color: 'var(--color-text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    } satisfies CSSProperties,
    citationCard: {
      display: 'grid',
      gap: 'var(--space-2)',
      padding: compact ? 'var(--space-4) 0 0 0' : 'var(--space-5) 0 0 0',
      borderTop: '1px solid color-mix(in oklab, var(--color-accent) 18%, var(--color-border) 82%)',
      borderRadius: 0,
      borderRight: 0,
      borderBottom: 0,
      borderLeft: 0,
      background:
        'linear-gradient(180deg, color-mix(in oklab, var(--color-surface-el) 48%, white 52%), transparent 72%)',
      breakInside: 'avoid',
      pageBreakInside: 'avoid',
    } satisfies CSSProperties,
    citationTitle: {
      margin: 'var(--space-1) 0 0 0',
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '1.08rem' : '1.24rem',
      lineHeight: 1.18,
      color: 'var(--color-heading)',
    } satisfies CSSProperties,
    citationMeta: {
      margin: 0,
      fontSize: 'var(--font-size-body-sm)',
      lineHeight: 1.7,
      color: 'var(--color-text-muted)',
      fontStyle: 'italic',
    } satisfies CSSProperties,
    gridCards: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'repeat(auto-fit, minmax(15rem, 1fr))',
      gap: 'var(--space-3)',
    } satisfies CSSProperties,
    featureCard: {
      padding: compact ? 'var(--space-4)' : 'var(--space-5)',
      borderTop: '1px solid color-mix(in oklab, var(--color-accent) 28%, var(--color-border) 72%)',
      borderRadius: 0,
      borderRight: 0,
      borderBottom: 0,
      borderLeft: 0,
      background: 'linear-gradient(180deg, color-mix(in oklab, var(--color-surface-el) 48%, white 52%), transparent 82%)',
      breakInside: 'avoid',
      pageBreakInside: 'avoid',
    } satisfies CSSProperties,
    chipRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-3)',
    } satisfies CSSProperties,
    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '999px',
      padding: '0.28rem 0.66rem',
      background: 'color-mix(in oklab, var(--color-accent) 14%, white 86%)',
      border: '1px solid color-mix(in oklab, var(--color-accent) 22%, var(--color-border) 78%)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'var(--color-text)',
    } satisfies CSSProperties,
    bulletList: {
      listStyle: 'none',
      display: 'grid',
      gap: 'var(--space-2)',
      margin: 'var(--space-3) 0 0 0',
      padding: 0,
    } satisfies CSSProperties,
    bulletItem: {
      display: 'grid',
      gridTemplateColumns: '0.8rem minmax(0, 1fr)',
      gap: 'var(--space-2)',
      alignItems: 'start',
      fontSize: 'var(--font-size-body-sm)',
      lineHeight: 1.72,
      color: 'var(--color-text)',
    } satisfies CSSProperties,
    bulletMark: {
      color: 'var(--color-accent)',
      fontWeight: 600,
    } satisfies CSSProperties,
    linkRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-3)',
    } satisfies CSSProperties,
    inlineLink: {
      display: 'inline-flex',
      alignItems: 'center',
      borderBottom: '1px solid color-mix(in oklab, var(--color-accent) 58%, transparent)',
      paddingBottom: '0.12rem',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-caption)',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--color-accent)',
      textDecoration: 'none',
    } satisfies CSSProperties,
    inlineGrid: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'repeat(auto-fit, minmax(12rem, 1fr))',
      gap: 'var(--space-3)',
    } satisfies CSSProperties,
    inlineCard: {
      display: 'grid',
      gap: 'var(--space-1)',
      padding: compact ? 'var(--space-3) 0 0 0' : 'var(--space-4) 0 0 0',
      borderTop: '1px solid var(--color-border)',
      borderRadius: 0,
      borderRight: 0,
      borderBottom: 0,
      borderLeft: 0,
      background: 'transparent',
    } satisfies CSSProperties,
    inlineCardTitle: {
      fontFamily: 'var(--font-heading)',
      fontSize: compact ? '1rem' : '1.08rem',
      color: 'var(--color-heading)',
    } satisfies CSSProperties,
    inlineCardMeta: {
      fontSize: 'var(--font-size-body-sm)',
      lineHeight: 1.7,
      color: 'var(--color-text-muted)',
    } satisfies CSSProperties,
    referenceCard: {
      padding: compact ? 'var(--space-4) 0 0 0' : 'var(--space-5) 0 0 0',
      borderTop: '1px solid var(--color-border)',
      borderRadius: 0,
      borderRight: 0,
      borderBottom: 0,
      borderLeft: 0,
      background: 'transparent',
      breakInside: 'avoid',
      pageBreakInside: 'avoid',
    } satisfies CSSProperties,
    referenceText: {
      margin: 'var(--space-3) 0 0 0',
      fontSize: compact ? 'var(--font-size-body-sm)' : 'var(--font-size-body)',
      lineHeight: 1.78,
      color: 'var(--color-text)',
      fontStyle: 'italic',
    } satisfies CSSProperties,
  }
}