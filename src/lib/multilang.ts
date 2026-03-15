import { z } from 'zod'

/**
 * Zod schema for a required multilang field.
 * Validates that the Vietnamese value is non-empty.
 */
export function multilangRequired(message: string) {
  return z.object({
    vi: z.string().min(1, message),
    en: z.string(),
  })
}

/**
 * Zod schema for an optional multilang field.
 */
export function multilangOptional() {
  return z.object({
    vi: z.string(),
    en: z.string(),
  })
}

/** Default empty multilang value */
export const emptyMultilang = { vi: '', en: '' }

/**
 * Extract multilang value from API response object.
 * API returns `{ [key: string]: string }` — we extract `vi` and `en` keys.
 */
export function fromMultilang(
  value: { [key: string]: string } | string | undefined
): { vi: string; en: string } {
  if (!value) return { vi: '', en: '' }
  if (typeof value === 'string') return { vi: value, en: '' }
  return {
    vi: value.vi || '',
    en: value.en || '',
  }
}

/**
 * Convert multilang form value to API payload format.
 * Returns the object as-is (compatible with `{ [key: string]: string }`).
 */
export function toMultilang(value: { vi: string; en: string }): {
  [key: string]: string
} {
  return { vi: value.vi, en: value.en }
}

/**
 * Display a multilang value as a string.
 * Prefers Vietnamese, falls back to English, then first available value.
 * Handles both object `{ vi: "...", en: "..." }` and legacy string values.
 */
export function displayMultilang(
  value: { [key: string]: string } | string | undefined | null
): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value.vi || value.en || Object.values(value)[0] || ''
}
