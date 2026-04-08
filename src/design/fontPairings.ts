// 12 font pairings for resume templates.
// Each pairing defines heading + body fonts from Google Fonts.

export interface FontPairing {
  id: string;
  name: string;
  heading: string;
  body: string;
  headingWeight: number;
  bodyWeight: number;
  description: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: 'editorial-classic',
    name: 'Editorial Classic',
    heading: 'Newsreader',
    body: 'Source Serif 4',
    headingWeight: 600,
    bodyWeight: 400,
    description: 'Quiet authority — literary headline contrast with formal long-form body copy.',
  },
  {
    id: 'swiss-modern',
    name: 'Swiss Modern',
    heading: 'IBM Plex Sans Condensed',
    body: 'Source Sans 3',
    headingWeight: 600,
    bodyWeight: 400,
    description: 'Compressed structure — sharper, cleaner, and less startup-coded than geometric defaults.',
  },
  {
    id: 'neo-grotesque',
    name: 'Neo Grotesque',
    heading: 'Archivo',
    body: 'Public Sans',
    headingWeight: 600,
    bodyWeight: 400,
    description: 'Editorial utility — neutral enough for technical work, strong enough for document hierarchy.',
  },
  {
    id: 'humanist',
    name: 'Humanist',
    heading: 'Fraunces',
    body: 'Lora',
    headingWeight: 700,
    bodyWeight: 400,
    description: 'Warm readable — organic shapes with excellent readability.',
  },
  {
    id: 'technical',
    name: 'Technical',
    heading: 'JetBrains Mono',
    body: 'IBM Plex Sans',
    headingWeight: 600,
    bodyWeight: 400,
    description: 'Systems-forward — monospaced cues with a humane engineering body text.',
  },
  {
    id: 'bold-display',
    name: 'Bold Display',
    heading: 'Bricolage Grotesque',
    body: 'Libre Franklin',
    headingWeight: 700,
    bodyWeight: 400,
    description: 'Punchy but not generic — a sharper headline voice for high-contrast documents.',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    heading: 'Cormorant Garamond',
    body: 'Spectral',
    headingWeight: 400,
    bodyWeight: 400,
    description: 'Restrained editorial — low-noise serif tone with clear reading texture.',
  },
  {
    id: 'academic',
    name: 'Academic',
    heading: 'EB Garamond',
    body: 'Source Sans 3',
    headingWeight: 700,
    bodyWeight: 400,
    description: 'Scholarly — classical Garamond headings with modern sans body.',
  },
  {
    id: 'creative',
    name: 'Creative',
    heading: 'Bodoni Moda',
    body: 'Assistant',
    headingWeight: 700,
    bodyWeight: 400,
    description: 'Portfolio-led — fashion-editorial contrast without tipping into novelty.',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    heading: 'Plus Jakarta Sans',
    body: 'Public Sans',
    headingWeight: 600,
    bodyWeight: 400,
    description: 'Boardroom clean — professional, current, and far less templated than default UI stacks.',
  },
  {
    id: 'magazine',
    name: 'Magazine',
    heading: 'Literata',
    body: 'Source Sans 3',
    headingWeight: 700,
    bodyWeight: 400,
    description: 'Feature spread — softer literary headlines with crisp editorial body rhythm.',
  },
  {
    id: 'avant-garde',
    name: 'Avant-Garde',
    heading: 'Syne',
    body: 'IBM Plex Sans',
    headingWeight: 600,
    bodyWeight: 400,
    description: 'Sharp and unconventional — enough tension to stand apart without hurting readability.',
  },
];

export const FONT_PAIRING_MAP: Record<string, FontPairing> = Object.fromEntries(
  FONT_PAIRINGS.map((f) => [f.id, f])
);
