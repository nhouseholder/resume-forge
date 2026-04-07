// AI slop detection for rendered resume HTML.
// Scans for 10 common AI-generated design fingerprints.

export interface SlopViolation {
  id: number;
  name: string;
  description: string;
  detected: boolean;
  severity: 'low' | 'medium' | 'high';
  fix: string;
}

export interface SlopCheckResult {
  score: number; // 0–10
  violations: SlopViolation[];
  passed: boolean; // true if score <= 1
}

const SLOP_CHECKS: Omit<SlopViolation, 'detected'>[] = [
  {
    id: 1,
    name: 'Generic Fonts',
    description: 'Uses Inter, Roboto, Open Sans, Lato, or Montserrat as primary body font.',
    severity: 'medium',
    fix: 'Switch to a distinctive font pairing from the template system.',
  },
  {
    id: 2,
    name: 'Purple Gradient Hero',
    description: 'Hero section uses purple-to-blue gradient on a white/light background.',
    severity: 'high',
    fix: 'Replace with a solid color or a gradient using the selected palette.',
  },
  {
    id: 3,
    name: 'Cards-in-Cards',
    description: 'Nested rounded containers creating a card-within-card effect.',
    severity: 'medium',
    fix: 'Flatten the nesting — use spacing and borders instead of nested containers.',
  },
  {
    id: 4,
    name: 'Gray Text on Color',
    description: 'Gray text (rgb hex with low saturation) placed on a colored background.',
    severity: 'low',
    fix: 'Use white or near-white text on colored backgrounds for contrast.',
  },
  {
    id: 5,
    name: 'Glassmorphism Everywhere',
    description: 'Multiple backdrop-filter:blur elements creating excessive glass effects.',
    severity: 'medium',
    fix: 'Reserve glassmorphism for at most one accent element, or remove entirely.',
  },
  {
    id: 6,
    name: 'Hero Metrics Row',
    description: '3–4 stat cards in a row with large numbers (classic AI landing page pattern).',
    severity: 'high',
    fix: 'Remove the metrics row or present stats inline within content sections.',
  },
  {
    id: 7,
    name: 'Generic Gradient Buttons',
    description: 'Buttons use gradient-from-purple-to-blue or similar generic AI gradient.',
    severity: 'medium',
    fix: 'Use solid color buttons from the selected palette accent color.',
  },
  {
    id: 8,
    name: 'Identical Section Rhythm',
    description: 'Repeating heading + subtitle + 3-column grid pattern across all sections.',
    severity: 'medium',
    fix: 'Vary layout density — some sections full-width, some 2-col, some asymmetric.',
  },
  {
    id: 9,
    name: 'Stock Testimonials',
    description: 'Contains "Changed my life", "game-changer", or similar stock testimonial phrases.',
    severity: 'high',
    fix: 'Remove testimonials or replace with genuine references from the resume data.',
  },
  {
    id: 10,
    name: 'Blob Backgrounds',
    description: 'Decorative SVG circles, blobs, or organic shapes as background elements.',
    severity: 'low',
    fix: 'Remove decorative blobs — use clean typography and spacing for visual interest.',
  },
];

function checkGenericFonts(html: string): boolean {
  const genericFonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat'];
  const fontPattern = /font-family:\s*['"]?([^'";,]+)/gi;
  let match: RegExpExecArray | null;
  while ((match = fontPattern.exec(html)) !== null) {
    const font = match[1].trim();
    if (genericFonts.some((g) => font.toLowerCase().includes(g.toLowerCase()))) {
      return true;
    }
  }
  return false;
}

function checkPurpleGradientHero(html: string): boolean {
  // Look for gradients containing purple/blue hues
  const gradientPatterns = [
    /linear-gradient\s*\([^)]*(?:#[89ab]4[a-f0-9]|purple|indigo|violet)[^)]*to[^)]*(?:#[2689]3[a-f0-9]|blue)[^)]*\)/i,
    /background:\s*linear-gradient\s*\([^)]*purple[^)]*\)/i,
    /bg-gradient-to-r[^"]*from-purple/i,
  ];
  return gradientPatterns.some((p) => p.test(html));
}

function checkCardsInCards(html: string): boolean {
  // Look for nested rounded containers with shadows
  const outerCards = (html.match(/rounded[^>]*>/gi) || []).length;
  return outerCards > 8;
}

function checkGrayTextOnColor(html: string): boolean {
  // Gray hex values (696969 range) used with colored backgrounds
  const grayPattern = /(?:color|text-\w+):\s*(?:#[89abcdef]{3,6}|rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\))/gi;
  let match: RegExpExecArray | null;
  while ((match = grayPattern.exec(html)) !== null) {
    const val = match[1];
    // Check if it's grayish (r≈g≈b)
    const rgbMatch = val.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch.map((x) => parseInt(x, 16));
      const avg = (r + g + b) / 3;
      if (Math.max(r, g, b) - Math.min(r, g, b) < 30 && avg > 80 && avg < 200) {
        return true;
      }
    }
  }
  return false;
}

function checkGlassmorphism(html: string): boolean {
  const blurCount = (html.match(/backdrop-filter:\s*blur/gi) || []).length;
  return blurCount >= 3;
}

function checkHeroMetricsRow(html: string): boolean {
  // 3-4 stat cards with large numbers in a grid row
  const metricsPattern = /(?:class="[^"]*(?:grid|flex)[^"]*"[^>]*>){1,3}[^<]*(?:\d{2,}|[\d.]+%)[^<]*<\/(?:div|p|span)>/gi;
  return metricsPattern.test(html);
}

function checkGenericGradientButtons(html: string): boolean {
  const gradientBtnPatterns = [
    /button[^>]*(?:from-purple|gradient-from-purple)/i,
    /<button[^>]*style="[^"]*linear-gradient[^"]*purple/i,
  ];
  return gradientBtnPatterns.some((p) => p.test(html));
}

function checkIdenticalSectionRhythm(html: string): boolean {
  // Count repeated heading+subtitle+grid patterns
  const sectionPattern = /<h[23][^>]*>.*?<\/h[23]>.*?(?:<p|<div)[^>]*class="[^"]*subtitle[^"]*"[^>]*>.*?(?:<div|<ul)[^>]*class="[^"]*(?:grid|flex).{0,20}col-3/i;
  const matches = html.match(new RegExp(sectionPattern.source, 'gis')) || [];
  return matches.length >= 3;
}

function checkStockTestimonials(html: string): boolean {
  const stockPhrases = [
    'changed my life',
    'game-changer',
    'revolutionary',
    'transformed the way',
    'best investment',
    'absolutely love',
    'highly recommend',
    'world-class',
  ];
  return stockPhrases.some((phrase) => html.toLowerCase().includes(phrase));
}

function checkBlobBackgrounds(html: string): boolean {
  const blobPatterns = [
    /<svg[^>]*class="[^"]*blob/i,
    /<svg[^>]*class="[^"]*circle[^"]*absolute/i,
    /border-radius:\s*50%[^}]*position:\s*absolute/i,
    /<div[^>]*class="[^"]*(?:blob|orb|circle-decoration)/i,
  ];
  return blobPatterns.some((p) => p.test(html));
}

const DETECTION_FNS = [
  checkGenericFonts,
  checkPurpleGradientHero,
  checkCardsInCards,
  checkGrayTextOnColor,
  checkGlassmorphism,
  checkHeroMetricsRow,
  checkGenericGradientButtons,
  checkIdenticalSectionRhythm,
  checkStockTestimonials,
  checkBlobBackgrounds,
];

const SEVERITY_SCORE: Record<string, number> = {
  low: 0.5,
  medium: 1,
  high: 2,
};

export function runSlopCheck(renderedHTML: string): SlopCheckResult {
  const violations: SlopViolation[] = SLOP_CHECKS.map((check, i) => ({
    ...check,
    detected: DETECTION_FNS[i](renderedHTML),
  }));

  const score = violations.reduce(
    (sum, v) => sum + (v.detected ? SEVERITY_SCORE[v.severity] : 0),
    0
  );

  return {
    score: Math.min(score, 10),
    violations,
    passed: score <= 1,
  };
}
