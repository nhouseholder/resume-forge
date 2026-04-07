/**
 * fieldDefaults.ts — Auto-selects optimal template/palette/font based on field category.
 *
 * Each field category maps to a primary template + palette + font combo that
 * best represents that profession's visual language. Users can override
 * everything, but these defaults give a strong starting point.
 */

import type { FieldCategory, ResumeMeta } from '../types/resume'

// ── Field → design defaults ──

interface FieldDefaults {
  templateId: string
  palette: string
  fontPairing: string
  layoutDensity: ResumeMeta['layoutDensity']
}

const FIELD_DEFAULTS: Record<FieldCategory, FieldDefaults> = {
  academic: {
    templateId: 'meridian',
    palette: 'deep-navy',
    fontPairing: 'academic',
    layoutDensity: 'balanced',
  },
  tech: {
    templateId: 'signal',
    palette: 'obsidian',
    fontPairing: 'technical',
    layoutDensity: 'compact',
  },
  business: {
    templateId: 'meridian',
    palette: 'burgundy',
    fontPairing: 'corporate',
    layoutDensity: 'balanced',
  },
  creative: {
    templateId: 'canvas',
    palette: 'terracotta',
    fontPairing: 'creative',
    layoutDensity: 'spacious',
  },
}

/**
 * Get the recommended design defaults for a detected field category.
 */
export function getFieldDefaults(category: FieldCategory): FieldDefaults {
  return FIELD_DEFAULTS[category]
}

/**
 * Apply field-based defaults to a ResumeMeta, preserving any values
 * the user has explicitly changed from the defaults.
 *
 * Call this ONCE after parsing, before the user starts editing.
 * Uses the `detectedField` flag in meta to track whether defaults
 * were already applied.
 */
export function applyFieldDefaults(
  meta: ResumeMeta,
  category: FieldCategory,
  userHasCustomized: boolean = false,
): ResumeMeta {
  if (userHasCustomized) return meta

  const defaults = getFieldDefaults(category)
  return {
    ...meta,
    templateId: defaults.templateId,
    palette: defaults.palette,
    fontPairing: defaults.fontPairing,
    layoutDensity: defaults.layoutDensity,
  }
}

/**
 * Get a description of why these defaults were chosen (for the customizer UI).
 */
export function getFieldDefaultsRationale(category: FieldCategory): string {
  const rationales: Record<FieldCategory, string> = {
    academic: 'Academic resumes benefit from the Meridian template with classic typography and a balanced layout that accommodates publications and research.',
    tech: 'Tech resumes use the Signal template with a compact density to maximize content, paired with the Technical font pairing for a modern developer aesthetic.',
    business: 'Business resumes lean into the Meridian template with a corporate palette and professional font pairing that conveys authority.',
    creative: 'Creative resumes use the Canvas template with a spacious layout and distinctive font pairing that showcases visual sensibility.',
  }
  return rationales[category]
}
