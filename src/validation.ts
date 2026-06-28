import { brandGuideSchema, brandIdentitySchema, brandThemeSchema } from './schema'
import type { BrandGuide, BrandIdentity, BrandTheme } from './types'

export class BrandValidationError extends Error {
  constructor(message: string, readonly issues: string[]) {
    super(message)
    this.name = 'BrandValidationError'
  }
}

function formatIssues(issues: { path: PropertyKey[], message: string }[]) {
  return issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join('.') : 'root'
    return `${path}: ${issue.message}`
  })
}

export function validateBrandTheme(theme: unknown): BrandTheme {
  const result = brandThemeSchema.safeParse(theme)

  if (!result.success) {
    const issues = formatIssues(result.error.issues)
    throw new BrandValidationError('Invalid brand theme', issues)
  }

  return result.data as BrandTheme
}

export function validateBrandIdentity(identity: unknown): BrandIdentity {
  const result = brandIdentitySchema.safeParse(identity)

  if (!result.success) {
    const issues = formatIssues(result.error.issues)
    throw new BrandValidationError('Invalid brand identity', issues)
  }

  return result.data as BrandIdentity
}

export function validateBrandGuide(guide: unknown): BrandGuide {
  const result = brandGuideSchema.safeParse(guide)

  if (!result.success) {
    const issues = formatIssues(result.error.issues)
    throw new BrandValidationError('Invalid brand guide', issues)
  }

  return result.data as BrandGuide
}

export function defineBrandTheme<const T extends BrandTheme>(theme: T): T {
  validateBrandTheme(theme)
  return theme
}

export function defineBrandIdentity<const T extends BrandIdentity>(identity: T): T {
  validateBrandIdentity(identity)
  return identity
}

export function defineBrandGuide<const T extends BrandGuide>(guide: T): T {
  validateBrandGuide(guide)
  return guide
}
