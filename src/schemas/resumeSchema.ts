import { z } from 'zod';

// ── Section schemas ──

const LocationSchema = z.object({
  city: z.string().optional(),
  region: z.string().optional(),
  countryCode: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
});

const SocialProfileSchema = z.object({
  network: z.string(),
  username: z.string().optional(),
  url: z.string().optional(),
  icon: z.string().optional(),
});

const ResumeBasicsSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  url: z.string().optional(),
  summary: z.string().optional(),
  location: LocationSchema.optional(),
  profiles: z.array(SocialProfileSchema).optional(),
  photo: z.string().optional(),
});

const ResumeWorkSchema = z.object({
  name: z.string(),
  position: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  url: z.string().optional(),
  location: z.string().optional(),
});

const ResumeEducationSchema = z.object({
  institution: z.string(),
  area: z.string().optional(),
  studyType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  score: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  url: z.string().optional(),
});

const ResumeSkillSchema = z.object({
  name: z.string(),
  level: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

const ResumePublicationSchema = z.object({
  name: z.string(),
  publisher: z.string().optional(),
  releaseDate: z.string().optional(),
  url: z.string().optional(),
  summary: z.string().optional(),
  doi: z.string().optional(),
  pmid: z.string().optional(),
  volume: z.string().optional(),
  pages: z.string().optional(),
  type: z.string().optional(),
});

const ResumePresentationSchema = z.object({
  name: z.string(),
  conference: z.string(),
  date: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  summary: z.string().optional(),
  url: z.string().optional(),
});

const ResumeProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  url: z.string().optional(),
  tech: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

const ResumeResearchThreadSchema = z.object({
  name: z.string(),
  summary: z.string(),
  keywords: z.array(z.string()),
  publications: z.array(z.string()).optional(),
  presentations: z.array(z.string()).optional(),
});

const ResumeLeadershipSchema = z.object({
  organization: z.string(),
  role: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  url: z.string().optional(),
});

const ResumeVolunteerSchema = z.object({
  organization: z.string(),
  position: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  url: z.string().optional(),
});

const ResumeAwardSchema = z.object({
  title: z.string(),
  date: z.string().optional(),
  awarder: z.string().optional(),
  summary: z.string().optional(),
  url: z.string().optional(),
});

const ResumeInterestSchema = z.object({
  name: z.string(),
  keywords: z.array(z.string()).optional(),
});

const ResumeReferenceSchema = z.object({
  name: z.string(),
  reference: z.string().optional(),
});

export const ResumeMetaSchema = z.object({
  templateId: z.string(),
  palette: z.string(),
  fontPairing: z.string(),
  layoutDensity: z.enum(['compact', 'balanced', 'spacious']),
  darkMode: z.boolean(),
  sectionVisibility: z.record(z.string(), z.boolean()),
});

// ── Full resume schema ──

export const ResumeDataSchema = z.object({
  basics: ResumeBasicsSchema,
  work: z.array(ResumeWorkSchema),
  education: z.array(ResumeEducationSchema),
  skills: z.array(ResumeSkillSchema),
  publications: z.array(ResumePublicationSchema),
  presentations: z.array(ResumePresentationSchema),
  projects: z.array(ResumeProjectSchema),
  researchThreads: z.array(ResumeResearchThreadSchema).optional(),
  leadership: z.array(ResumeLeadershipSchema).optional(),
  volunteer: z.array(ResumeVolunteerSchema).optional(),
  awards: z.array(ResumeAwardSchema).optional(),
  interests: z.array(ResumeInterestSchema).optional(),
  references: z.array(ResumeReferenceSchema).optional(),
  meta: ResumeMetaSchema.optional(),
});

export type InferredResumeData = z.infer<typeof ResumeDataSchema>;

// ── AI parsing response schema ──

export const AIParseResponseSchema = z.object({
  success: z.boolean(),
  resume: ResumeDataSchema.optional(),
  error: z.string().optional(),
  detectedField: z.enum(['academic', 'tech', 'business', 'creative']).optional(),
  warnings: z.array(z.string()).optional(),
});

export type AIParseResponse = z.infer<typeof AIParseResponseSchema>;
