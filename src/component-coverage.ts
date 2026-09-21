import type { BrandComponentCoverage } from './types'

export const componentCoverageStatuses = ['planned', 'tokenized', 'documented', 'verified'] as const

export type ComponentCoverageStatus = typeof componentCoverageStatuses[number]

export type ComponentCoverageStatusMeta = {
  label: string
  description: string
  color: 'neutral' | 'info' | 'primary' | 'success'
}

export type ComponentCoverageSummary = {
  families: number
  components: number
  byStatus: Record<ComponentCoverageStatus, number>
}

export const componentCoverageStatusMeta: Record<ComponentCoverageStatus, ComponentCoverageStatusMeta> = {
  planned: {
    label: 'Planned',
    description: 'The family is identified but not styled or documented.',
    color: 'neutral',
  },
  tokenized: {
    label: 'Tokenized',
    description: 'The family uses shared tokens and Nuxt UI defaults.',
    color: 'info',
  },
  documented: {
    label: 'Documented',
    description: 'The family has visible usage guidance.',
    color: 'primary',
  },
  verified: {
    label: 'Verified',
    description: 'The family passed visual QA across light, dark, desktop, and mobile.',
    color: 'success',
  },
}

export function normalizeComponentCoverage(items?: readonly BrandComponentCoverage[] | null): BrandComponentCoverage[] {
  return (items ?? [])
    .map(item => ({
      ...item,
      family: item.family.trim(),
      components: item.components.map(component => component.trim()).filter(Boolean),
      notes: item.notes?.trim(),
    }))
    .filter(item => item.family && item.components.length > 0)
}

export function summarizeComponentCoverage(items?: readonly BrandComponentCoverage[] | null): ComponentCoverageSummary {
  const normalized = normalizeComponentCoverage(items)
  const byStatus = Object.fromEntries(
    componentCoverageStatuses.map(status => [status, 0]),
  ) as Record<ComponentCoverageStatus, number>
  for (const item of normalized) {
    byStatus[item.status] += 1
  }
  return {
    families: normalized.length,
    components: normalized.reduce((total, item) => total + item.components.length, 0),
    byStatus,
  }
}

/** Optional presentation overrides; coverage status values remain stable. */
export type ComponentCoverageLabels = {
  family?: string
  components?: string
  status?: string
  notes?: string
  statuses?: Partial<Record<ComponentCoverageStatus, { label?: string, description?: string }>>
}

export function resolveComponentCoverageStatus(status: ComponentCoverageStatus, labels?: ComponentCoverageLabels): ComponentCoverageStatusMeta {
  const fallback = componentCoverageStatusMeta[status]
  return {
    ...fallback,
    label: labels?.statuses?.[status]?.label ?? fallback.label,
    description: labels?.statuses?.[status]?.description ?? fallback.description,
  }
}
