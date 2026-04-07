// Resume data types based on JSON Resume schema (https://jsonresume.org/)
// with extensions for research, presentations, leadership, and template metadata.

export interface ResumeData {
  basics: ResumeBasics;
  work: ResumeWork[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  publications: ResumePublication[];
  presentations: ResumePresentation[];
  projects: ResumeProject[];
  researchThreads?: ResumeResearchThread[];
  leadership?: ResumeLeadership[];
  volunteer?: ResumeVolunteer[];
  awards?: ResumeAward[];
  interests?: ResumeInterest[];
  references?: ResumeReference[];
  certifications?: ResumeCertification[];
  languages?: ResumeLanguage[];
  meta?: ResumeMeta;
}

export interface ResumeBasics {
  name: string;
  label?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: {
    city?: string;
    region?: string;
    countryCode?: string;
    address?: string;
    postalCode?: string;
  };
  profiles?: SocialProfile[];
  photo?: string;
}

export interface SocialProfile {
  network: string;
  username?: string;
  url?: string;
  icon?: string;
}

export interface ResumeWork {
  name: string;
  position: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
  url?: string;
  location?: string;
}

export interface ResumeEducation {
  institution: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  highlights?: string[];
  url?: string;
}

export interface ResumeSkill {
  name: string;
  level?: string;
  keywords?: string[];
}

export interface ResumePublication {
  name: string;
  publisher?: string;
  releaseDate?: string;
  url?: string;
  summary?: string;
  doi?: string;
  pmid?: string;
  volume?: string;
  pages?: string;
  type?: string;
}

export interface ResumePresentation {
  name: string;
  conference: string;
  date?: string;
  location?: string;
  type?: string;
  summary?: string;
  url?: string;
}

export interface ResumeProject {
  name: string;
  description?: string;
  url?: string;
  tech?: string[];
  startDate?: string;
  endDate?: string;
  highlights?: string[];
  images?: string[];
}

export interface ResumeResearchThread {
  name: string;
  summary: string;
  keywords: string[];
  publications?: string[];
  presentations?: string[];
}

export interface ResumeLeadership {
  organization: string;
  role: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
  url?: string;
}

export interface ResumeVolunteer {
  organization: string;
  position: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
  url?: string;
}

export interface ResumeAward {
  title: string;
  date?: string;
  awarder?: string;
  summary?: string;
  url?: string;
}

export interface ResumeInterest {
  name: string;
  keywords?: string[];
}

export interface ResumeReference {
  name: string;
  reference?: string;
}

export interface ResumeMeta {
  templateId: string;
  palette: string;
  fontPairing: string;
  layoutDensity: 'compact' | 'balanced' | 'spacious';
  darkMode: boolean;
  sectionVisibility: Record<string, boolean>;
}

export interface ResumeCertification {
  name: string;
  date?: string;
  issuer?: string;
  url?: string;
}

export interface ResumeLanguage {
  language: string;
  fluency?: string;
}

export type FieldCategory = 'academic' | 'tech' | 'business' | 'creative';
export type ExportFormat = 'html' | 'pdf' | 'jsx' | 'link';
