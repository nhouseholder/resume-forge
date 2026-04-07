// Design tokens — spacing, typography, breakpoints, motion, z-index.

// ── Spacing Scale (4pt base grid) ──

export const SPACING_SCALE = {
  0: '0rem',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  64: '16rem',    // 256px
} as const;

export type SpacingKey = keyof typeof SPACING_SCALE;

// ── Typography Scale ──

export interface TypographyStep {
  size: string;
  lineHeight: string;
  letterSpacing: string;
  weight: number;
}

export const TYPOGRAPHY_SCALE = {
  display: {
    size: '3.5rem',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
    weight: 700,
  },
  h1: {
    size: '2.25rem',
    lineHeight: '1.2',
    letterSpacing: '-0.01em',
    weight: 700,
  },
  h2: {
    size: '1.75rem',
    lineHeight: '1.25',
    letterSpacing: '-0.01em',
    weight: 600,
  },
  h3: {
    size: '1.375rem',
    lineHeight: '1.3',
    letterSpacing: '0',
    weight: 600,
  },
  h4: {
    size: '1.125rem',
    lineHeight: '1.4',
    letterSpacing: '0',
    weight: 600,
  },
  body: {
    size: '1rem',
    lineHeight: '1.6',
    letterSpacing: '0',
    weight: 400,
  },
  bodySm: {
    size: '0.875rem',
    lineHeight: '1.5',
    letterSpacing: '0',
    weight: 400,
  },
  caption: {
    size: '0.75rem',
    lineHeight: '1.5',
    letterSpacing: '0.01em',
    weight: 400,
  },
  overline: {
    size: '0.6875rem',
    lineHeight: '1.5',
    letterSpacing: '0.08em',
    weight: 600,
  },
} as const;

export type TypographyKey = keyof typeof TYPOGRAPHY_SCALE;

// ── Breakpoints (px) ──

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ── Motion ──

export const MOTION = {
  duration: {
    fast: 100,
    normal: 200,
    slow: 500,
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

// ── Z-Index ──

export const Z_INDEX = {
  dropdown: 10,
  sticky: 20,
  modal: 30,
  toast: 40,
  tooltip: 50,
} as const;
