import type { ComponentExampleMessages } from './component-example-messages'
export { componentExampleMessages, resolveComponentExampleMessage } from './component-example-messages'
export type { ComponentExampleMessages, ComponentExampleMessageKey } from './component-example-messages'

export type ComponentExampleFrame = 'default' | 'none'

export type ComponentExampleFamily =
  | 'actions'
  | 'forms'
  | 'feedback'
  | 'data'
  | 'navigation'
  | 'overlays'
  | 'page'
  | 'system'
  | 'dashboard'
  | 'publishing'
  | 'chat'
  | 'editor'

export type ComponentExampleDefinition = {
  name: string
  family: ComponentExampleFamily
  title: string
  description?: string
  ownsSurface?: boolean
}

export type ComponentExampleGroup = {
  family: ComponentExampleFamily
  title: string
  description: string
  examples: readonly ComponentExampleDefinition[]
}

export type ComponentExampleAssets = {
  symbol?: string
  wordmark?: string
  wordmarkInverse?: string
}

export type ComponentExamplePaths = {
  docs: string
  components: string
  colors: string
  typography: string
}

export type ComponentExampleCopy = {
  brandLabel: string
  heroTitle: string
  heroDescription: string
  pageTitle: string
  pageDescription: string
  ctaTitle: string
  ctaDescription: string
  packageDescription: string
  projectTitle: string
  projectDescription: string
  releaseTitle: string
  releaseDescription: string
}

export type ComponentExampleContext = {
  messages?: ComponentExampleMessages
  brandName: string
  packageName: string
  accentColor: string
  logoAlt: string
  assets: ComponentExampleAssets
  assetPreviewSurfaces: ComponentExampleAssetPreviewSurfaces
  paths: ComponentExamplePaths
  copy: ComponentExampleCopy
}

export type ComponentExamplePreviewSurface = {
  background: string
  color: string
  border: string
}

export type ComponentExampleAssetPreviewSurfaces = {
  light: ComponentExamplePreviewSurface
  dark: ComponentExamplePreviewSurface
}

export type ComponentExampleAssetPreviewSurfaceInput = {
  light?: Partial<ComponentExamplePreviewSurface>
  dark?: Partial<ComponentExamplePreviewSurface>
}

export type ComponentExampleContextInput = Partial<Omit<ComponentExampleContext, 'assets' | 'assetPreviewSurfaces' | 'paths' | 'copy'>> & {
  assets?: Partial<ComponentExampleAssets>
  assetPreviewSurfaces?: ComponentExampleAssetPreviewSurfaceInput
  paths?: Partial<ComponentExamplePaths>
  copy?: Partial<ComponentExampleCopy>
}

const defaultAssetPreviewSurfaces: ComponentExampleAssetPreviewSurfaces = {
  light: {
    background: '#ffffff',
    color: '#111827',
    border: 'rgba(17, 24, 39, 0.14)'
  },
  dark: {
    background: '#111827',
    color: '#ffffff',
    border: 'rgba(255, 255, 255, 0.16)'
  }
}

function defineGroup(
  family: ComponentExampleFamily,
  title: string,
  description: string,
  names: readonly (string | readonly [name: string, title: string, ownsSurface?: boolean])[]
): ComponentExampleGroup {
  return {
    family,
    title,
    description,
    examples: names.map((entry) => {
      if (typeof entry === 'string') {
        return {
          name: entry,
          family,
          title: titleFromName(entry)
        }
      }

      return {
        name: entry[0],
        family,
        title: entry[1],
        ownsSurface: entry[2]
      }
    })
  }
}

function titleFromName(name: string) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const componentExampleGroups = [
  defineGroup('actions', 'Actions', 'Action hierarchy, badges, compact metadata, and hints.', [
    ['action-hierarchy-pattern', 'Action hierarchy'],
    ['compact-metadata-pattern', 'Compact metadata'],
    'button',
    'badge',
    'chip',
    'field-group',
    'kbd',
    'tooltip'
  ]),
  defineGroup('forms', 'Forms', 'Input, selection, choice, bounded, and advanced form controls.', [
    ['form-pattern', 'Form pattern'],
    ['text-entry-pattern', 'Text entry'],
    ['selection-pattern', 'Selection'],
    ['choice-pattern', 'Choice controls'],
    ['bounded-pattern', 'Bounded inputs'],
    ['advanced-inputs-pattern', 'Advanced inputs'],
    'form',
    'form-field',
    'input',
    'textarea',
    'select',
    'select-menu',
    'input-menu',
    'input-number',
    'input-tags',
    'input-date',
    'input-time',
    'checkbox',
    'checkbox-group',
    'radio-group',
    'switch',
    'slider',
    'pin-input',
    'file-upload',
    'color-picker',
    'calendar',
    'listbox'
  ]),
  defineGroup('feedback', 'Feedback', 'Inline feedback, progress, loading states, empty states, icons, and toasts.', [
    'alert',
    'banner',
    'progress',
    'skeleton',
    'toast',
    'empty',
    'icon',
    ['feedback-system-pattern', 'Feedback system']
  ]),
  defineGroup('data', 'Data and Structure', 'Tables, cards, identity objects, separators, timelines, and overflow.', [
    ['table', 'Table', true],
    ['data-comparison-pattern', 'Data comparison'],
    ['card', 'Card', true],
    ['page-card', 'Page card', true],
    'avatar',
    'avatar-group',
    'user',
    ['data-object-pattern', 'Object summary'],
    ['separator', 'Separator', true],
    ['collapsible', 'Collapsible', true],
    ['carousel', 'Carousel', true],
    ['timeline', 'Timeline', true],
    ['scroll-area', 'Scroll area', true],
    ['structure-sequence-pattern', 'Structure and sequence']
  ]),
  defineGroup('navigation', 'Navigation', 'Primary navigation, location, nested structure, and fast command surfaces.', [
    'navigation-menu',
    ['navigation-primary-pattern', 'Primary navigation'],
    'link',
    'breadcrumb',
    'tabs',
    ['navigation-location-pattern', 'Location navigation'],
    'stepper',
    'accordion',
    'pagination',
    'command-palette',
    'tree',
    ['navigation-structure-pattern', 'Structure navigation'],
    ['navigation-fast-pattern', 'Fast navigation']
  ]),
  defineGroup('overlays', 'Overlays', 'Focused overlays, attached context, and menu surfaces.', [
    'modal',
    'slideover',
    'drawer',
    ['overlay-focused-pattern', 'Focused overlays'],
    'popover',
    'dropdown-menu',
    'context-menu',
    ['overlay-context-pattern', 'Context overlays'],
    ['overlay-menu-pattern', 'Menu overlays']
  ]),
  defineGroup('page', 'Page and Docs', 'Page primitives, docs navigation, app shell, and content helpers.', [
    ['page-hero', 'Page hero', true],
    ['page-section', 'Page section', true],
    ['page-cta', 'Page CTA', true],
    ['page-grid', 'Page grid', true],
    ['page-feature', 'Page feature', true],
    ['page-links', 'Page links', true],
    ['page-header', 'Page header', true],
    ['page-body', 'Page body', true],
    ['page-columns', 'Page columns', true],
    ['page-list', 'Page list', true],
    ['page-logos', 'Page logos', true],
    ['page-anchors', 'Page anchors', true],
    ['content-navigation', 'Content navigation', true],
    ['content-system', 'Content system', true],
    ['content-toc', 'Content table of contents', true],
    ['content-surround', 'Content surround', true],
    ['content-search', 'Content search', true],
    ['header', 'Header', true],
    ['main', 'Main', true],
    ['container', 'Container', true],
    ['footer', 'Footer', true],
    ['footer-columns', 'Footer columns', true],
    ['page-opening-pattern', 'Page opening'],
    ['section-system-pattern', 'Section system'],
    ['page-support-pattern', 'Page support'],
    ['page-shell-pattern', 'Page shell', true]
  ]),
  defineGroup('system', 'System Helpers', 'Color mode, locale, auth, scoped themes, errors, and assets.', [
    'color-mode-button',
    'color-mode-switch',
    'color-mode-select',
    'color-mode-avatar',
    ['color-mode-image', 'Color mode image', true],
    'locale-select',
    'auth-form',
    ['error', 'Error', true],
    ['theme', 'Theme', true],
    ['system-appearance-pattern', 'System appearance'],
    ['system-assets-pattern', 'System assets'],
    ['system-access-pattern', 'System access']
  ]),
  defineGroup('dashboard', 'Dashboard', 'Dashboard group, sidebar, panel, toolbar, and scrollable work surfaces.', [
    ['dashboard-shell', 'Dashboard shell', true],
    ['dashboard-group', 'Dashboard group', true],
    ['sidebar', 'Sidebar', true]
  ]),
  defineGroup('publishing', 'Publishing', 'Blog, changelog, pricing, marquee, and package explanation surfaces.', [
    ['publishing-editorial-pattern', 'Editorial publishing'],
    ['publishing-package-pattern', 'Package publishing'],
    ['blog-posts', 'Blog posts', true],
    ['blog-post', 'Blog post', true],
    ['changelog-versions', 'Changelog versions', true],
    ['changelog-version', 'Changelog version', true],
    ['pricing-plans', 'Pricing plans', true],
    ['pricing-plan', 'Pricing plan', true],
    ['pricing-table', 'Pricing table', true],
    ['marquee', 'Marquee', true]
  ]),
  defineGroup('chat', 'Chat', 'Chat palette, messages, prompts, reasoning, shimmer, and tool state.', [
    ['chat-palette', 'Chat palette', true],
    ['chat-messages', 'Chat messages', true],
    ['chat-message', 'Chat message'],
    'chat-prompt',
    'chat-prompt-submit',
    'chat-reasoning',
    'chat-shimmer',
    'chat-tool',
    ['chat-activity-pattern', 'Chat activity']
  ]),
  defineGroup('editor', 'Editor', 'Editor surface and companion toolbar menus.', [
    ['editor', 'Editor', true],
    'editor-toolbar',
    'editor-drag-handle',
    'editor-emoji-menu',
    'editor-mention-menu',
    'editor-suggestion-menu'
  ])
] as const satisfies readonly ComponentExampleGroup[]

export const componentExampleFamilies = componentExampleGroups.map(group => group.family)

export const componentExampleNames = componentExampleGroups.flatMap(group =>
  group.examples.map(example => example.name)
)

export const componentExampleOwnSurfaceNames = componentExampleGroups.flatMap(group =>
  group.examples.filter(example => example.ownsSurface).map(example => example.name)
)

const componentExampleDefinitionByName = new Map(
  componentExampleGroups.flatMap(group => group.examples.map(example => [example.name, example] as const))
)

export function getComponentExampleDefinition(name: string): ComponentExampleDefinition | undefined {
  return componentExampleDefinitionByName.get(name)
}

export function isComponentExampleName(name: string): boolean {
  return componentExampleDefinitionByName.has(name)
}

export function createComponentExampleContext(input: ComponentExampleContextInput = {}): ComponentExampleContext {
  const brandName = input.brandName ?? 'brand'
  const packageName = input.packageName ?? '@example/brand'

  return {
    brandName,
    packageName,
    messages: input.messages,
    accentColor: input.accentColor ?? '#3B82F6',
    logoAlt: input.logoAlt ?? `${brandName} symbol`,
    assets: {
      ...input.assets
    },
    assetPreviewSurfaces: {
      light: {
        ...defaultAssetPreviewSurfaces.light,
        ...input.assetPreviewSurfaces?.light
      },
      dark: {
        ...defaultAssetPreviewSurfaces.dark,
        ...input.assetPreviewSurfaces?.dark
      }
    },
    paths: {
      docs: '/docs',
      components: '/docs/components',
      colors: '/docs/colors',
      typography: '/docs/typography',
      ...input.paths
    },
    copy: {
      brandLabel: brandName,
      heroTitle: 'Build a useful brand system.',
      heroDescription: 'A compact page opening with visible structure and clear action hierarchy.',
      pageTitle: 'Component docs',
      pageDescription: 'Structured pages stay easier to scan and maintain.',
      ctaTitle: 'Use the brand system in real projects.',
      ctaDescription: 'Read the guide, then install the Nuxt layer when a project should carry this system.',
      packageDescription: 'Reusable Nuxt UI theme behavior for projects.',
      projectTitle: 'Website refresh',
      projectDescription: 'Review component behavior before release.',
      releaseTitle: 'Component coverage expanded',
      releaseDescription: 'Dashboard, publishing, chat, and editor families now have brand guidance.',
      ...input.copy
    }
  }
}

export function defineComponentExampleContext<const T extends ComponentExampleContextInput>(context: T): T {
  return context
}
