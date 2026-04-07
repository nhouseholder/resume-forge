import type { ResumeData, FieldCategory } from '../types/resume';

// Tech skill keywords that strongly signal a tech field
const TECH_KEYWORDS = [
  'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt',
  'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'rust', 'go', 'swift', 'kotlin',
  'node.js', 'express', 'django', 'flask', 'rails', 'spring',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
  'postgresql', 'mongodb', 'redis', 'mysql', 'elasticsearch',
  'tensorflow', 'pytorch', 'machine learning', 'deep learning',
  'graphql', 'rest', 'api', 'git', 'ci/cd', 'devops',
  'html', 'css', 'tailwind', 'sass', 'webpack', 'vite',
];

// Business title keywords
const BUSINESS_TITLES = [
  'ceo', 'cto', 'cfo', 'coo', 'vp', 'vice president',
  'director', 'manager', 'head of', 'chief', 'president',
  'founder', 'co-founder', 'partner', 'principal',
  'executive', 'leader', 'superintendent',
];

// Creative keywords
const CREATIVE_KEYWORDS = [
  'design', 'brand', 'creative', 'art', 'photography', 'illustration',
  'ux', 'ui', 'graphic', 'motion', 'animation', 'video',
  'advertising', 'copywriting', 'content creation', 'film',
  'editorial', 'typography', 'layout', 'visual',
];

// Academic degree keywords
const ACADEMIC_KEYWORDS = ['md', 'phd', 'ph.d', 'dr.', 'doctor', 'professor', 'sc.d', 'd.sc'];

/**
 * Analyzes resume data to determine the best field category for template selection.
 * Returns 'academic' as default if no strong signal is found.
 */
export function detectFieldCategory(resume: ResumeData): FieldCategory {
  const scores: Record<FieldCategory, number> = {
    academic: 0,
    tech: 0,
    business: 0,
    creative: 0,
  };

  // ── Academic signals ──

  if (resume.publications.length > 0) {
    scores.academic += 3;
  }
  if (resume.researchThreads && resume.researchThreads.length > 0) {
    scores.academic += 4;
  }
  if (resume.presentations.length > 2) {
    scores.academic += 2;
  }

  // Check education for academic degrees
  for (const edu of resume.education) {
    const text = `${edu.studyType ?? ''} ${edu.area ?? ''}`.toLowerCase();
    if (ACADEMIC_KEYWORDS.some((k) => text.includes(k))) {
      scores.academic += 3;
    }
  }

  // ── Tech signals ──

  if (resume.projects.length > 0) {
    scores.tech += 1;
  }

  // Check skills for tech keywords
  for (const skill of resume.skills) {
    const text = `${skill.name} ${(skill.keywords ?? []).join(' ')}`.toLowerCase();
    const techHits = TECH_KEYWORDS.filter((k) => text.includes(k));
    scores.tech += techHits.length * 0.5;
  }

  // Check work for tech titles
  for (const work of resume.work) {
    const text = `${work.position ?? ''} ${work.name ?? ''}`.toLowerCase();
    if (
      text.includes('engineer') ||
      text.includes('developer') ||
      text.includes('architect') ||
      text.includes('programmer') ||
      text.includes('scientist') ||
      text.includes('analyst')
    ) {
      scores.tech += 2;
    }
  }

  // ── Business signals ──

  for (const work of resume.work) {
    const position = (work.position ?? '').toLowerCase();
    if (BUSINESS_TITLES.some((t) => position.includes(t))) {
      scores.business += 2;
    }
  }

  if (resume.awards && resume.awards.length > 3) {
    scores.business += 1;
  }

  if (resume.leadership && resume.leadership.length > 0) {
    scores.business += 1;
  }

  // ── Creative signals ──

  for (const project of resume.projects) {
    const text = `${project.name ?? ''} ${project.description ?? ''} ${(project.tech ?? []).join(' ')}`.toLowerCase();
    if (CREATIVE_KEYWORDS.some((k) => text.includes(k))) {
      scores.creative += 2;
    }
  }

  for (const work of resume.work) {
    const text = `${work.position ?? ''} ${(work.highlights ?? []).join(' ')}`.toLowerCase();
    if (CREATIVE_KEYWORDS.some((k) => text.includes(k))) {
      scores.creative += 2;
    }
  }

  if (resume.interests) {
    for (const interest of resume.interests) {
      const text = `${interest.name} ${(interest.keywords ?? []).join(' ')}`.toLowerCase();
      if (CREATIVE_KEYWORDS.some((k) => text.includes(k))) {
        scores.creative += 1;
      }
    }
  }

  // ── Pick the highest score ──

  const entries = Object.entries(scores) as [FieldCategory, number][];
  entries.sort(([, a], [, b]) => b - a);

  const [topField, topScore] = entries[0];
  const [, secondScore] = entries[1];

  // Only pick non-academic if it has a clear lead (>= 2 points over second)
  if (topField !== 'academic' && topScore >= 2 && topScore - secondScore >= 1) {
    return topField;
  }

  // Default to academic
  return 'academic';
}
