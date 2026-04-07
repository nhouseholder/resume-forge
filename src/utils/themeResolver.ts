/**
 * themeResolver.ts — Design bridge layer
 * Converts palette + font + density + darkMode into CSS custom properties
 * that templates consume via `var(--*)`.
 */

import type { Palette } from '../design/palettes'
import type { FontPairing } from '../design/fontPairings'
import type { ResumeMeta } from '../types/resume'
import { PALETTES } from '../design/palettes'
import { FONT_PAIRINGS } from '../design/fontPairings'

// ── Density multipliers ──

const DENSITY_SCALE: Record<ResumeMeta['layoutDensity'], { spacing: number; fontSize: number; lineHeight: number }> = {
  compact:  { spacing: 0.75, fontSize: 0.9,  lineHeight: 1.4 },
  balanced: { spacing: 1.0,  fontSize: 1.0,  lineHeight: 1.55 },
  spacious: { spacing: 1.25, fontSize: 1.05, lineHeight: 1.65 },
}

// ── Shade selectors for semantic tokens ──

type ShadeKey = string

interface ShadeSelectors {
  bg: ShadeKey
  surface: ShadeKey
  surfaceEl: ShadeKey
  text: ShadeKey
  textMuted: ShadeKey
  heading: ShadeKey
  accent: ShadeKey
  accentText: ShadeKey
  border: ShadeKey
}

const LIGHT_SHADES: ShadeSelectors = {
  bg: '50', surface: '50', surfaceEl: '100',
  text: '900', textMuted: '600', heading: '800',
  accent: '500', accentText: '50', border: '200',
}

const DARK_SHADES: ShadeSelectors = {
  bg: '950', surface: '900', surfaceEl: '800',
  text: '100', textMuted: '600', heading: '50',
  accent: '400', accentText: '950', border: '700',
}

// ── Base typography (px for PDF rendering) ──

const BASE_TYPOGRAPHY = {
  h1:      { size: 22,    weight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 },
  h2:      { size: 14,    weight: 600, letterSpacing: '0.06em',  lineHeight: 1.3 },
  h3:      { size: 11.5,  weight: 600, letterSpacing: '0',       lineHeight: 1.35 },
  h4:      { size: 10.5,  weight: 600, letterSpacing: '0',       lineHeight: 1.4 },
  body:    { size: 9.5,   weight: 400, letterSpacing: '0',       lineHeight: 1.55 },
  bodySm:  { size: 8.5,   weight: 400, letterSpacing: '0',       lineHeight: 1.5 },
  caption: { size: 7.5,   weight: 400, letterSpacing: '0.02em',  lineHeight: 1.45 },
  overline: { size: 7,    weight: 600, letterSpacing: '0.08em',  lineHeight: 1.5 },
} as const

// ── Public API ──

export interface ResolvedTheme {
  cssProperties: Record<string, string>
  fontUrls: string[]
  palette: Palette
  font: FontPairing
}

/**
 * Resolve a ResumeMeta into concrete CSS custom properties + font URLs.
 * Used by TemplateRenderer to inject into the resume container's style.
 */
export function resolveTheme(meta: ResumeMeta): ResolvedTheme {
  const palette = PALETTES.find((p: Palette) => p.id === meta.palette) ?? PALETTES[0]
  const font = FONT_PAIRINGS.find((f: FontPairing) => f.id === meta.fontPairing) ?? FONT_PAIRINGS[0]
  const density = DENSITY_SCALE[meta.layoutDensity]
  const shades = meta.darkMode ? DARK_SHADES : LIGHT_SHADES

  const props: Record<string, string> = {}

  // ── Color tokens ──
  const neutralShade = palette.neutral as unknown as Record<string, string>
  props['--color-bg']         = neutralShade[shades.bg]
  props['--color-surface']    = neutralShade[shades.surface]
  props['--color-surface-el'] = neutralShade[shades.surfaceEl]
  props['--color-text']       = neutralShade[shades.text]
  props['--color-text-muted'] = neutralShade[shades.textMuted]
  props['--color-heading']    = neutralShade[shades.heading]
  props['--color-border']     = neutralShade[shades.border]

  // Accent
  const accentShade = palette.accent as unknown as Record<string, string>
  props['--color-accent']       = accentShade[shades.accent]
  props['--color-accent-text']  = accentShade[shades.accentText]
  props['--color-accent-hover'] = accentShade[shades.accent === '400' ? '300' : '400']

  // Primary color (for template-specific highlights)
  const primaryShade = palette.primary as unknown as Record<string, string>
  props['--color-primary']       = primaryShade['600']
  props['--color-primary-light'] = primaryShade['100']
  props['--color-primary-dark']  = primaryShade['800']

  // ── Typography tokens ──
  props['--font-heading']        = font.heading
  props['--font-body']           = font.body
  props['--font-heading-weight'] = String(font.headingWeight)
  props['--font-body-weight']    = String(font.bodyWeight)

  for (const step of Object.keys(BASE_TYPOGRAPHY)) {
    const base = BASE_TYPOGRAPHY[step as keyof typeof BASE_TYPOGRAPHY]
    const scaledSize = base.size * density.fontSize
    props[`--font-size-${step}`]       = `${scaledSize}px`
    props[`--font-weight-${step}`]     = String(base.weight)
    props[`--letter-spacing-${step}`]  = base.letterSpacing
    props[`--line-height-${step}`]     = String(base.lineHeight * density.lineHeight / density.fontSize).replace(/^1\./, '1.')
  }

  // ── Spacing tokens ──
  const baseSpacing = 4 * density.spacing
  const spacings: Record<string, number> = {
    1: baseSpacing * 0.5,
    2: baseSpacing * 1,
    3: baseSpacing * 1.5,
    4: baseSpacing * 2,
    5: baseSpacing * 2.5,
    6: baseSpacing * 3,
    8: baseSpacing * 4,
    10: baseSpacing * 5,
    12: baseSpacing * 6,
    16: baseSpacing * 8,
    20: baseSpacing * 10,
    24: baseSpacing * 12,
  }
  for (const [key, val] of Object.entries(spacings)) {
    props[`--space-${key}`] = `${val}px`
  }

  // ── Radius tokens ──
  props['--radius-sm'] = '2px'
  props['--radius-md'] = '4px'
  props['--radius-lg'] = '6px'

  // ── Google Fonts URLs ──
  const fontUrls = buildFontUrls(font)

  return { cssProperties: props, fontUrls, palette, font }
}

/**
 * Convert resolved theme to an inline style string for the resume container.
 */
export function themeToStyleString(theme: ResolvedTheme): string {
  return Object.entries(theme.cssProperties)
    .map(([key, val]) => `${key}: ${val}`)
    .join('; ')
}

/**
 * Build Google Fonts CSS import URLs for a font pairing.
 */
function buildFontUrls(font: FontPairing): string[] {
  const headingWeights = [font.headingWeight]
  const bodyWeights = [...new Set([font.bodyWeight, 400, 700])].sort((a, b) => a - b)

  if (font.heading === font.body) {
    const allWeights = [...new Set([...headingWeights, ...bodyWeights])].sort((a, b) => a - b)
    return [`https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.heading)}:wght@${allWeights.join(';')}&display=swap`]
  }

  const headingUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.heading)}:wght@${headingWeights.join(';')}&display=swap`
  const bodyUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.body)}:wght@${bodyWeights.join(';')}&display=swap`

  return [headingUrl, bodyUrl]
}
