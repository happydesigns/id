<script setup lang="ts">
import type { ComponentExampleContext } from '../../../src/component-examples'

const props = defineProps<{
  name: string
  context: ComponentExampleContext
}>()

const contentNavigationItems = [
  {
    title: 'Overview',
    path: props.context.paths.docs,
    icon: 'i-lucide-book-open'
  },
  {
    title: 'Components',
    path: props.context.paths.components,
    icon: 'i-lucide-component',
    children: [
      { title: 'Actions', path: `${props.context.paths.components}/actions` },
      { title: 'Forms', path: `${props.context.paths.components}/forms` },
      { title: 'Docs and prose', path: `${props.context.paths.components}/docs-prose` }
    ]
  },
  {
    title: 'Voice',
    path: `${props.context.paths.docs}/voice`,
    icon: 'i-lucide-message-square'
  }
]

const contentTocLinks = [
  { id: 'decision-notes', depth: 2, text: 'Decision notes' },
  { id: 'code-examples', depth: 2, text: 'Code examples' },
  { id: 'content-navigation', depth: 2, text: 'Content navigation' }
]

const contentSurroundItems = [
  {
    title: 'Layout',
    description: 'Page primitives.',
    path: `${props.context.paths.components}/layout-page`
  },
  {
    title: 'System',
    description: 'Theme helpers.',
    path: `${props.context.paths.components}/system-helpers`
  }
]

const footerColumns = [{
  label: 'Guide',
  children: [
    { label: 'Overview', to: props.context.paths.components },
    { label: 'Coverage', to: `${props.context.paths.components}/coverage` }
  ]
}, {
  label: 'Families',
  children: [
    { label: 'Actions', to: `${props.context.paths.components}/actions` },
    { label: 'Forms', to: `${props.context.paths.components}/forms` }
  ]
}]

const pageAnchors = [
  { label: 'Foundation', icon: 'i-lucide-palette', to: '#foundation', active: true },
  { label: 'Application', icon: 'i-lucide-component', to: '#application' }
]
</script>

<template>
  <div v-if="props.name === 'page-hero'" class="overflow-hidden rounded-sm border border-default">
    <UPageHero
      :title="props.context.copy.heroTitle"
      :description="props.context.copy.heroDescription"
      :links="[
        { label: 'Open guide', to: props.context.paths.docs, icon: 'i-lucide-arrow-right', trailing: true },
        { label: 'View components', to: props.context.paths.components, color: 'neutral', variant: 'outline', icon: 'i-lucide-component' }
      ]"
      :ui="{ container: 'py-6 sm:py-8 lg:py-8 gap-4', title: 'text-2xl sm:text-3xl max-w-2xl', description: 'text-sm sm:text-base max-w-2xl', footer: 'mt-6' }"
    />
  </div>

  <UPageSection
    v-else-if="props.name === 'page-section'"
    title="Component families"
    description="Use page structure to group related guidance without inventing one-off layouts."
    :features="[
      { title: 'Actions', description: 'Buttons and compact metadata.', icon: 'i-lucide-mouse-pointer-click' },
      { title: 'Forms', description: 'Labels, fields, and validation.', icon: 'i-lucide-text-cursor-input' }
    ]"
    :ui="{ container: 'py-0 sm:py-0 lg:py-0 gap-4', title: 'text-2xl sm:text-3xl', description: 'text-sm sm:text-base', features: 'mt-5' }"
  />

  <UPageCTA
    v-else-if="props.name === 'page-cta'"
    :title="props.context.copy.ctaTitle"
    :description="props.context.copy.ctaDescription"
    :links="[{ label: 'Open docs', to: props.context.paths.docs, icon: 'i-lucide-arrow-right', trailing: true }]"
    :ui="{ container: 'py-6 sm:py-6 lg:py-6' }"
  />

  <UPageGrid
    v-else-if="props.name === 'page-grid'"
    class="sm:grid-cols-2"
  >
    <UPageCard title="Feedback" description="State messages stay close to the task." icon="i-lucide-circle-check" />
    <UPageCard title="Overlays" description="Contextual surfaces support the current flow." icon="i-lucide-panel-top-open" />
  </UPageGrid>

  <UPageFeature
    v-else-if="props.name === 'page-feature'"
    title="Useful before branded"
    description="Every component needs a clear job before it carries brand character."
    icon="i-lucide-circle-check"
  />

  <UPageLinks
    v-else-if="props.name === 'page-links'"
    :links="[
      { label: 'Colors', description: 'Palette roles and token behavior.', icon: 'i-lucide-palette', to: props.context.paths.colors },
      { label: 'Typography', description: 'Hierarchy and technical type.', icon: 'i-lucide-type', to: props.context.paths.typography }
    ]"
  />

  <UPageHeader
    v-else-if="props.name === 'page-header'"
    headline="Component docs"
    :title="props.context.copy.pageTitle"
    :description="props.context.copy.pageDescription"
    :links="[{ label: 'Open docs', to: props.context.paths.components, color: 'neutral', variant: 'outline', trailingIcon: 'i-lucide-arrow-right' }]"
    :ui="{ root: '!mx-0 !px-0 py-0 sm:!px-0 lg:!mx-0 lg:!px-0', wrapper: '!flex-col !items-start gap-3', title: 'text-2xl sm:text-3xl', description: 'text-sm sm:text-base max-w-xl' }"
  />

  <UPageBody
    v-else-if="props.name === 'page-body'"
    class="p-0"
  >
    <p class="text-sm text-muted">
      Page bodies keep content spacing predictable after the header.
    </p>
  </UPageBody>

  <UPageColumns
    v-else-if="props.name === 'page-columns'"
    class="!columns-1 gap-4 space-y-4"
  >
    <UCard variant="outline">
      <p class="text-sm text-muted">
        Foundation guidance
      </p>
    </UCard>
    <UCard variant="outline">
      <p class="text-sm text-muted">
        Application guidance
      </p>
    </UCard>
  </UPageColumns>

  <UPageList
    v-else-if="props.name === 'page-list'"
    divide
  >
    <UPageCard title="Foundations" description="Color and type create the calm base." icon="i-lucide-palette" variant="ghost" />
    <UPageCard title="Application" description="Components carry the system into interfaces." icon="i-lucide-component" variant="ghost" />
  </UPageList>

  <UPageLogos
    v-else-if="props.name === 'page-logos'"
    title="Logo forms in one system"
    :logos="[
      { src: props.context.assets.wordmark || props.context.assets.symbol, alt: `${props.context.copy.brandLabel} wordmark` },
      { src: props.context.assets.symbol || props.context.assets.wordmark, alt: props.context.logoAlt }
    ].filter(logo => logo.src)"
    :marquee="false"
  />

  <UPageAnchors
    v-else-if="props.name === 'page-anchors'"
    :links="pageAnchors"
  />

  <div v-else-if="props.name === 'content-navigation'" class="max-w-sm rounded-sm border border-default bg-default p-3">
    <UContentNavigation :navigation="contentNavigationItems" />
  </div>

  <div v-else-if="props.name === 'content-system'" class="grid divide-y divide-default overflow-hidden rounded-sm border border-default bg-default lg:grid-cols-[12rem_1fr_11rem] lg:divide-x lg:divide-y-0">
    <aside class="bg-muted/40 p-4">
      <p class="mb-3 text-xs font-medium uppercase text-label">
        Navigation
      </p>
      <UContentNavigation :navigation="contentNavigationItems" />
    </aside>
    <main class="space-y-4 p-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0">
          <p class="font-semibold text-highlighted">
            Component docs
          </p>
          <p class="mt-1 max-w-md text-sm text-muted">
            Navigation and search keep the guide usable without adding another CTA layer.
          </p>
        </div>
        <UContentSearchButton label="Search" />
      </div>
      <USeparator />
      <UContentSurround :surround="contentSurroundItems" />
    </main>
    <aside class="bg-muted/30 p-4">
      <UContentToc title="On this page" :links="contentTocLinks" />
    </aside>
  </div>

  <div v-else-if="props.name === 'content-toc'" class="max-w-sm rounded-sm border border-default bg-default p-3">
    <UContentToc title="On this page" :links="contentTocLinks" />
  </div>

  <div v-else-if="props.name === 'content-surround'" class="overflow-hidden rounded-sm border border-default bg-default">
    <UContentSurround :surround="contentSurroundItems" />
  </div>

  <div v-else-if="props.name === 'content-search'" class="space-y-4">
    <UContentSearchButton label="Search docs" />
    <div class="flex items-start gap-3 rounded-sm border border-default bg-muted p-4">
      <UIcon name="i-lucide-search" class="mt-0.5 size-4 text-primary" />
      <div>
        <p class="font-semibold text-highlighted">
          Global documentation search
        </p>
        <p class="mt-1 text-sm text-muted">
          Keep search available in the shell without making each page busier.
        </p>
      </div>
    </div>
  </div>

  <div v-else-if="props.name === 'header'" class="overflow-hidden rounded-sm border border-default">
    <UHeader :ui="{ root: 'relative border-b border-default bg-default', container: 'h-14' }">
      <template #left>
        <span class="font-semibold text-highlighted">{{ props.context.copy.brandLabel }}</span>
      </template>
      <template #right>
        <UButton label="Docs" variant="ghost" color="neutral" size="sm" />
      </template>
    </UHeader>
  </div>

  <UMain v-else-if="props.name === 'main'" class="rounded-sm border border-default bg-muted p-4">
    <p class="text-sm text-muted">
      Main keeps the primary surface below the header.
    </p>
  </UMain>

  <UContainer v-else-if="props.name === 'container'" class="rounded-sm border border-default bg-default py-4">
    <p class="text-sm text-muted">
      Container sets a reusable readable width.
    </p>
  </UContainer>

  <UFooter
    v-else-if="props.name === 'footer'"
    :ui="{ root: 'border border-default bg-default', container: 'py-4 lg:py-4' }"
  >
    <template #left>
      <span class="text-sm text-muted">Copyright {{ props.context.copy.brandLabel }}</span>
    </template>
    <template #right>
      <span class="font-mono text-xs text-label">Nuxt UI layer</span>
    </template>
  </UFooter>

  <UFooterColumns
    v-else-if="props.name === 'footer-columns'"
    :columns="footerColumns"
  />

  <div v-else-if="props.name === 'page-opening-pattern'" class="space-y-6">
    <UPageHero
      :title="props.context.copy.heroTitle"
      :description="props.context.copy.heroDescription"
      :links="[
        { label: 'Open guide', to: props.context.paths.docs, icon: 'i-lucide-arrow-right', trailing: true },
        { label: 'View components', to: props.context.paths.components, color: 'neutral', variant: 'outline', icon: 'i-lucide-component' }
      ]"
      :ui="{ container: 'py-0 sm:py-0 lg:py-0 gap-4', title: 'text-2xl sm:text-3xl max-w-2xl', description: 'text-sm sm:text-base max-w-2xl', footer: 'mt-6' }"
    />
    <USeparator />
    <UPageHeader
      headline="Component docs"
      :title="props.context.copy.pageTitle"
      :description="props.context.copy.pageDescription"
      :links="[{ label: 'Open docs', to: props.context.paths.components, color: 'neutral', variant: 'outline', trailingIcon: 'i-lucide-arrow-right' }]"
      :ui="{ root: '!mx-0 !px-0 pt-0 pb-6 sm:!px-0 lg:!mx-0 lg:!px-0', wrapper: '!flex-col !items-start gap-3', title: 'text-2xl sm:text-3xl', description: 'text-sm sm:text-base max-w-xl' }"
    />
  </div>

  <div v-else-if="props.name === 'section-system-pattern'" class="space-y-6">
    <UPageSection
      title="Component families"
      description="Use section primitives to group related guidance without inventing one-off layouts."
      :features="[
        { title: 'Actions', description: 'Buttons and compact metadata.', icon: 'i-lucide-mouse-pointer-click' },
        { title: 'Forms', description: 'Labels, fields, and validation.', icon: 'i-lucide-text-cursor-input' }
      ]"
      :ui="{ container: 'py-0 sm:py-0 lg:py-0 gap-4', title: 'text-2xl sm:text-3xl', description: 'text-sm sm:text-base', features: 'mt-5' }"
    />
    <UPageGrid class="sm:grid-cols-2">
      <UPageCard title="Feedback" description="State messages stay close to the task." icon="i-lucide-circle-check" />
      <UPageCard title="Overlays" description="Contextual surfaces support the current flow." icon="i-lucide-panel-top-open" />
    </UPageGrid>
  </div>

  <div v-else-if="props.name === 'page-support-pattern'" class="space-y-5">
    <UPageLinks
      :links="[
        { label: 'Colors', description: 'Palette roles and token behavior.', icon: 'i-lucide-palette', to: props.context.paths.colors },
        { label: 'Typography', description: 'Hierarchy and technical type.', icon: 'i-lucide-type', to: props.context.paths.typography }
      ]"
    />
    <UPageList divide>
      <UPageCard title="Foundations" description="Color and type create the calm base." icon="i-lucide-palette" variant="ghost" />
      <UPageCard title="Application" description="Components carry the system into interfaces." icon="i-lucide-component" variant="ghost" />
    </UPageList>
    <div class="grid gap-4 sm:grid-cols-2">
      <UPageLogos
        title="Logo forms"
        :logos="[
          { src: props.context.assets.wordmark || props.context.assets.symbol, alt: `${props.context.copy.brandLabel} wordmark` },
          { src: props.context.assets.symbol || props.context.assets.wordmark, alt: props.context.logoAlt }
        ].filter(logo => logo.src)"
        :marquee="false"
      />
      <UPageAnchors :links="pageAnchors" />
    </div>
  </div>

  <div v-else-if="props.name === 'page-shell-pattern'" class="overflow-hidden rounded-sm border border-default">
    <UHeader :ui="{ root: 'relative border-b border-default bg-default', container: 'h-14' }">
      <template #left>
        <span class="font-semibold text-highlighted">{{ props.context.copy.brandLabel }}</span>
      </template>
      <template #right>
        <UButton label="Docs" variant="ghost" color="neutral" size="sm" />
      </template>
    </UHeader>
    <UMain class="bg-muted p-4">
      <UContainer class="rounded-sm border border-default bg-default py-4">
        <p class="text-sm text-muted">
          Main and container keep page content aligned inside the shell.
        </p>
      </UContainer>
    </UMain>
    <UFooter :ui="{ root: 'border-t border-default bg-default', container: 'py-4 lg:py-4' }">
      <template #left>
        <span class="text-sm text-muted">Copyright {{ props.context.copy.brandLabel }}</span>
      </template>
      <template #right>
        <span class="font-mono text-xs text-label">Nuxt UI layer</span>
      </template>
    </UFooter>
  </div>
</template>
