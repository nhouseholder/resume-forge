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
    heading: 'Playfair Display',
    body: 'Source Serif 4',
    headingWeight: 700,
    bodyWeight: 400,
    description: 'Serif elegance — timeless editorial feel with high contrast.',
  },
  {
    id: 'swiss-modern',
    name: 'Swiss Modern',
    heading: 'Space Grotesk',
    body: 'DM Sans',
    headingWeight: 600,
    bodyWeight: 400,
    description: 'Clean geometric — Swiss design tradition, precise and readable.',
  },
  {
    id: 'neo-grotesque',
    name: 'Neo Grotesque',
    heading: 'General Sans',
    body: 'Satoshi',
    headingWeight: 600,
    bodyWeight: 400,
    description: 'Modern geometric — contemporary sans-serif with personality.',
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
    body: 'Inter',
    headingWeight: 600,
    bodyWeight: 400,
    description: 'Dev-focused — monospace headings with clean body text for engineers.',
  },
  {
    id: 'bold-display',
    name: 'Bold Display',
    heading: 'Cabinet Grotesk',
    body: 'Work Sans',
    headingWeight: 700,
    bodyWeight: 400,
    description: 'Punchy — bold display headings that command attention.',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    heading: 'Instrument Serif',
    body: 'Inter',
    headingWeight: 400,
    bodyWeight: 400,
    description: 'Quiet luxury — refined serif headings with neutral body.',
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
    heading: 'Clash Display',
    body: 'Manrope',
    headingWeight: 700,
    bodyWeight: 400,
    description: 'Statement — distinctive display font for creative professionals.',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    heading: 'Plus Jakarta Sans',
    body: 'Outfit',
    headingWeight: 600,
    bodyWeight: 400,
    description: 'Professional — polished corporate identity with modern warmth.',
  },
  {
    id: 'magazine',
    name: 'Magazine',
    heading: 'Newsreader',
    body: 'Graphik',
    headingWeight: 700,
    bodyWeight: 400,
    description: 'Editorial — magazine-quality typography with character.',
  },
  {
    id: 'avant-garde',
    name: 'Avant-Garde',
    heading: 'Basis Grotesque',
    body: 'Nunito Sans',
    headingWeight: 600,
    bodyWeight: 400,
    description: 'Distinctive — unconventional pairing that stands out.',
  },
];

export const FONT_PAIRING_MAP: Record<string, FontPairing> = Object.fromEntries(
  FONT_PAIRINGS.map((f) => [f.id, f])
);
