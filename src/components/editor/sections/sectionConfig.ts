import type { FieldDef } from './ListSectionEditor'

// Field definitions for each array-based section
export const SECTION_FIELDS: Record<string, FieldDef[]> = {
  work: [
    { key: 'name', label: 'Company', required: true },
    { key: 'position', label: 'Position', required: true },
    { key: 'location', label: 'Location', placeholder: 'City, State' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
    { key: 'url', label: 'Company URL', type: 'url' },
    { key: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Brief role description...' },
  ],
  education: [
    { key: 'institution', label: 'Institution', required: true },
    { key: 'area', label: 'Field of Study' },
    { key: 'studyType', label: 'Degree', placeholder: 'BS, MS, PhD, MD...' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
    { key: 'score', label: 'GPA / Score' },
    { key: 'url', label: 'URL', type: 'url' },
  ],
  publications: [
    { key: 'name', label: 'Title', required: true },
    { key: 'publisher', label: 'Journal / Publisher' },
    { key: 'releaseDate', label: 'Date', type: 'date' },
    { key: 'doi', label: 'DOI' },
    { key: 'pmid', label: 'PMID' },
    { key: 'url', label: 'URL', type: 'url' },
    { key: 'summary', label: 'Abstract / Summary', type: 'textarea' },
  ],
  presentations: [
    { key: 'name', label: 'Title', required: true },
    { key: 'conference', label: 'Conference / Event' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'location', label: 'Location', placeholder: 'City, State' },
    { key: 'type', label: 'Type', placeholder: 'poster, podium, talk, workshop' },
    { key: 'summary', label: 'Summary', type: 'textarea' },
    { key: 'url', label: 'URL', type: 'url' },
  ],
  projects: [
    { key: 'name', label: 'Project Name', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'url', label: 'Live URL', type: 'url', placeholder: 'https://myproject.com' },
    { key: 'repoUrl', label: 'Repository URL', type: 'url', placeholder: 'https://github.com/...' },
    { key: 'tech', label: 'Tech Stack', placeholder: 'React, TypeScript, Cloudflare' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
  ],
  volunteer: [
    { key: 'organization', label: 'Organization', required: true },
    { key: 'position', label: 'Role' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
    { key: 'url', label: 'URL', type: 'url' },
    { key: 'summary', label: 'Summary', type: 'textarea' },
  ],
  awards: [
    { key: 'title', label: 'Award', required: true },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'awarder', label: 'Awarded By' },
    { key: 'summary', label: 'Summary', type: 'textarea' },
  ],
  certifications: [
    { key: 'name', label: 'Certification', required: true },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'issuer', label: 'Issuer' },
    { key: 'url', label: 'URL', type: 'url' },
  ],
  languages: [
    { key: 'language', label: 'Language', required: true },
    { key: 'fluency', label: 'Fluency', placeholder: 'Native, Fluent, Intermediate, Basic' },
  ],
  interests: [
    { key: 'name', label: 'Interest', required: true },
  ],
  references: [
    { key: 'name', label: 'Name', required: true },
    { key: 'reference', label: 'Reference' },
  ],
  researchThreads: [
    { key: 'name', label: 'Research Theme', required: true },
    { key: 'summary', label: 'Summary', type: 'textarea' },
    { key: 'keywords', label: 'Keywords', placeholder: 'oncology, genomics, machine learning' },
    { key: 'publications', label: 'Publications', placeholder: 'Paper A; Paper B' },
    { key: 'presentations', label: 'Presentations', placeholder: 'Talk A; Poster B' },
  ],
  leadership: [
    { key: 'organization', label: 'Organization', required: true },
    { key: 'role', label: 'Role' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
    { key: 'summary', label: 'Summary', type: 'textarea' },
  ],
}

// Blank item creators for each section
export const SECTION_BLANKS: Record<string, () => Record<string, unknown>> = {
  work: () => ({ name: '', position: '', highlights: [] }),
  education: () => ({ institution: '', area: '', studyType: '' }),
  publications: () => ({ name: '', publisher: '' }),
  presentations: () => ({ name: '', conference: '', type: 'poster' }),
  projects: () => ({ name: '', description: '', tech: [] }),
  volunteer: () => ({ organization: '', position: '' }),
  awards: () => ({ title: '', awarder: '' }),
  certifications: () => ({ name: '', issuer: '' }),
  languages: () => ({ language: '', fluency: '' }),
  interests: () => ({ name: '' }),
  references: () => ({ name: '', reference: '' }),
  researchThreads: () => ({ name: '', summary: '', keywords: [], publications: [], presentations: [] }),
  leadership: () => ({ organization: '', role: '' }),
}

// Card title extractors
export const SECTION_TITLES: Record<string, (item: Record<string, unknown>) => string> = {
  work: (item) => `${item.position || 'Position'} at ${item.name || 'Company'}`,
  education: (item) => `${item.studyType || ''} ${item.area || ''} — ${item.institution || 'Institution'}`.trim(),
  publications: (item) => item.name as string,
  presentations: (item) => `${item.name || 'Presentation'} — ${item.conference || ''}`.trim(),
  projects: (item) => item.name as string,
  volunteer: (item) => `${item.position || 'Role'} at ${item.organization || 'Organization'}`,
  awards: (item) => item.title as string,
  certifications: (item) => item.name as string,
  languages: (item) => item.language as string,
  interests: (item) => item.name as string,
  references: (item) => item.name as string,
  researchThreads: (item) => item.name as string,
  leadership: (item) => `${item.role || 'Role'} at ${item.organization || 'Organization'}`,
}
