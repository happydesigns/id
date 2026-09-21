import type {
  BrandGuideDocsSection,
  BrandGuideSection,
  BrandGuideSectionInput,
} from './types'

export type GuideSectionPathOptions = {
  basePath?: string
  indexSlug?: string
}

export function defineGuideSections<const T extends readonly BrandGuideSectionInput[]>(sections: T): T {
  return sections
}

export function normalizeGuideSections(sections?: readonly BrandGuideSectionInput[] | null): BrandGuideSection[] {
  return (sections ?? [])
    .map(section => ({
      slug: section.slug.trim(),
      title: section.title.trim(),
      description: section.description.trim(),
      summary: trimOptional(section.summary),
      eyebrow: trimOptional(section.eyebrow),
      icon: trimOptional(section.icon),
      to: trimOptional(section.to),
      anchors: section.anchors?.map(anchor => anchor.trim()).filter(Boolean),
    }))
    .filter(section => section.slug && section.title && section.description)
}

export function createGuideSectionPath(
  section: BrandGuideSectionInput,
  options: GuideSectionPathOptions = {},
): string {
  const explicitPath = trimOptional(section.to)
  if (explicitPath) {
    return explicitPath
  }
  const basePath = normalizeBasePath(options.basePath ?? '/docs')
  const indexSlug = options.indexSlug ?? 'overview'
  const slug = section.slug.trim()
  if (slug === indexSlug) {
    return basePath
  }
  return `${basePath}/${slug}`.replace(/\/{2,}/g, '/')
}

export function createGuideDocsSections(
  sections?: readonly BrandGuideSectionInput[] | null,
  options: GuideSectionPathOptions = {},
): BrandGuideDocsSection[] {
  return normalizeGuideSections(sections).map(section => ({
    title: section.title,
    description: section.summary ?? section.description,
    to: createGuideSectionPath(section, options),
  }))
}

export function findGuideSection(
  sections: readonly BrandGuideSectionInput[] | null | undefined,
  slug: string,
): BrandGuideSection | undefined {
  const normalizedSlug = slug.trim()
  return normalizeGuideSections(sections).find(section => section.slug === normalizedSlug)
}

function trimOptional(value?: string): string | undefined {
  const trimmed = value?.trim()
  return trimmed || undefined
}

function normalizeBasePath(basePath: string): string {
  const trimmed = basePath.trim() || '/'
  const withoutTrailingSlash = trimmed.length > 1 ? trimmed.replace(/\/+$/, '') : trimmed
  return withoutTrailingSlash.startsWith('/') ? withoutTrailingSlash : `/${withoutTrailingSlash}`
}
