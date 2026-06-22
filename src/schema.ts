import { z } from 'zod'

const cssVariableMapSchema = z.record(z.string().min(1), z.string().min(1))

const cssVariablesSchema = z.object({
  light: cssVariableMapSchema.optional(),
  dark: cssVariableMapSchema.optional()
}).refine(value => Boolean(value.light || value.dark), {
  message: 'At least one cssVariables mode is required'
})

const typographySchema = z.object({
  sans: z.string().min(1).optional(),
  mono: z.string().min(1).optional(),
  display: z.string().min(1).optional()
})

const assetSchema = z.object({
  name: z.string().min(1),
  src: z.string().min(1),
  role: z.string().min(1),
  media: z.enum(['light', 'dark', 'any']).optional(),
  alt: z.string().optional()
})

const logoSetSchema = z.record(z.string().min(1), assetSchema)

const colorScaleSchema = z.object({
  50: z.string().min(1).optional(),
  100: z.string().min(1).optional(),
  200: z.string().min(1).optional(),
  300: z.string().min(1).optional(),
  400: z.string().min(1).optional(),
  500: z.string().min(1).optional(),
  600: z.string().min(1).optional(),
  700: z.string().min(1).optional(),
  800: z.string().min(1).optional(),
  900: z.string().min(1).optional(),
  950: z.string().min(1).optional()
}).partial()

const paletteSchema = z.record(z.string().min(1), z.union([z.string().min(1), colorScaleSchema]))

const semanticColorsSchema = z.record(z.string().min(1), z.string().min(1))

const voiceSchema = z.object({
  attributes: z.array(z.string().min(1)).optional(),
  dos: z.array(z.string().min(1)).optional(),
  donts: z.array(z.string().min(1)).optional(),
  examples: z.array(z.object({
    label: z.string().min(1),
    text: z.string().min(1)
  })).optional()
})

const componentCoverageSchema = z.object({
  family: z.string().min(1),
  components: z.array(z.string().min(1)).min(1),
  status: z.enum(['planned', 'tokenized', 'documented', 'verified']),
  notes: z.string().optional()
})

const usageSchema = z.object({
  useFor: z.array(z.string().min(1)).optional(),
  avoid: z.array(z.string().min(1)).optional(),
  runtimeLimits: z.array(z.string().min(1)).optional()
})

const docsSchema = z.object({
  sections: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    to: z.string().min(1)
  })).optional()
})

export const brandThemeSchema = z.object({
  name: z.string().min(1).regex(/^[a-z0-9][a-z0-9-]*$/, 'Theme names must be kebab-case'),
  label: z.string().min(1),
  description: z.string().optional(),
  semanticColors: semanticColorsSchema.optional(),
  cssVariables: cssVariablesSchema.optional(),
  typography: typographySchema.optional(),
  ui: z.record(z.string().min(1), z.unknown()).optional()
}).refine(value => Boolean(value.semanticColors || value.cssVariables || value.typography || value.ui), {
  message: 'A theme must define semanticColors, cssVariables, typography, or ui'
})

export const brandGuideSchema = z.object({
  name: z.string().min(1).regex(/^[a-z0-9][a-z0-9-]*$/, 'Brand guide names must be kebab-case'),
  packageName: z.string().min(1).optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  homepage: z.string().url().optional(),
  repository: z.string().url().optional(),
  assets: z.object({
    logos: logoSetSchema.optional(),
    files: z.array(assetSchema).optional()
  }).optional(),
  palette: paletteSchema.optional(),
  semanticColors: semanticColorsSchema.optional(),
  cssVariables: cssVariablesSchema.optional(),
  typography: typographySchema.optional(),
  voice: voiceSchema.optional(),
  componentCoverage: z.array(componentCoverageSchema).optional(),
  usage: usageSchema.optional(),
  docs: docsSchema.optional(),
  ui: z.record(z.string().min(1), z.unknown()).optional()
})

export type BrandThemeSchema = z.infer<typeof brandThemeSchema>
export type BrandGuideSchema = z.infer<typeof brandGuideSchema>
