<script setup lang="ts">
import type { ComponentExampleContext } from '../../../../src/component-examples'

const props = defineProps<{
  name: string
  context: ComponentExampleContext
}>()

const blogPosts = [{
  title: 'Designing durable defaults',
  description: 'How the brand layer keeps repeated interfaces calm and recognizable.',
  date: 'Jun 15, 2026',
  badge: { label: 'Guide', color: 'primary' as const, variant: 'subtle' as const },
}, {
  title: 'Structure before decoration',
  description: 'A practical note on borders, spacing, type, and restrained accent use.',
  date: 'Jun 12, 2026',
}]

const changelogVersions = [{
  title: props.context.copy.releaseTitle,
  description: props.context.copy.releaseDescription,
  date: 'v0.2',
  badge: { label: 'Docs', color: 'primary' as const, variant: 'subtle' as const },
}, {
  title: 'Logo system refined',
  description: 'Logo forms and lockups use clearer role-based guidance.',
  date: 'v0.1',
}]

const pricingPlans = [{
  title: 'Guide',
  price: 'Docs',
  description: 'Brand decisions for readers and maintainers.',
  features: ['Color roles', 'Logo guidance', 'Component rules'],
  button: { label: 'Open docs', to: props.context.paths.docs },
}, {
  title: 'Layer',
  price: 'Nuxt',
  description: props.context.copy.packageDescription,
  features: ['App config', 'Semantic tokens', 'Component defaults'],
  button: { label: 'Install layer', to: props.context.paths.components },
  highlight: true,
}]

const pricingTableTiers = [{
  id: 'guide',
  title: 'Guide',
  description: 'Documentation',
}, {
  id: 'layer',
  title: 'Layer',
  description: 'Implementation',
  highlight: true,
}]

const pricingTableSections = [{
  title: 'Coverage',
  features: [{
    title: 'Brand decisions',
    tiers: { guide: true, layer: true },
  }, {
    title: 'Nuxt UI defaults',
    tiers: { guide: false, layer: true },
  }],
}]
</script>

<template>
  <div
    v-if="props.name === 'publishing-editorial-pattern'"
    class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
  >
    <div class="space-y-3">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="font-semibold text-highlighted">
            Editorial updates
          </p>
          <p class="mt-1 text-sm text-muted">
            Blog cards keep written updates scannable without making each card a campaign.
          </p>
        </div>
        <UBadge
          color="neutral"
          variant="outline"
        >
          Editorial
        </UBadge>
      </div>
      <div class="grid gap-3">
        <UCard
          v-for="post in blogPosts"
          :key="post.title"
          variant="outline"
          :ui="{ body: 'p-4' }"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="font-mono text-xs text-label">{{ post.date }}</span>
            <UBadge
              v-if="post.badge"
              v-bind="post.badge"
            />
          </div>
          <h3 class="mt-3 font-semibold text-highlighted">
            {{ post.title }}
          </h3>
          <p class="mt-1 text-sm text-muted">
            {{ post.description }}
          </p>
        </UCard>
      </div>
    </div>
    <div class="space-y-3">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="font-semibold text-highlighted">
            Release history
          </p>
          <p class="mt-1 text-sm text-muted">
            Changelog entries make product history readable as a sequence.
          </p>
        </div>
        <UBadge
          color="neutral"
          variant="outline"
        >
          Changelog
        </UBadge>
      </div>
      <div class="grid gap-3">
        <UCard
          v-for="version in changelogVersions"
          :key="version.title"
          variant="outline"
          :ui="{ body: 'p-4' }"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="font-mono text-xs text-label">{{ version.date }}</span>
            <UBadge
              v-if="version.badge"
              v-bind="version.badge"
            />
          </div>
          <h3 class="mt-3 font-semibold text-highlighted">
            {{ version.title }}
          </h3>
          <p class="mt-1 text-sm text-muted">
            {{ version.description }}
          </p>
        </UCard>
      </div>
    </div>
  </div>

  <div
    v-else-if="props.name === 'publishing-package-pattern'"
    class="space-y-6"
  >
    <div class="space-y-3">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="font-semibold text-highlighted">
            Package choices
          </p>
          <p class="mt-1 text-sm text-muted">
            Pricing surfaces can explain editions, packages, or implementation paths.
          </p>
        </div>
        <UBadge
          color="neutral"
          variant="outline"
        >
          Packages
        </UBadge>
      </div>
      <UPricingPlans :plans="pricingPlans" />
    </div>
    <UPricingTable
      :tiers="pricingTableTiers"
      :sections="pricingTableSections"
    />
    <UMarquee
      pause-on-hover
      overlay
      class="rounded-sm border border-default bg-muted p-4"
    >
      <UBadge
        color="neutral"
        variant="outline"
      >
        Nuxt UI layer
      </UBadge>
      <UBadge
        color="primary"
        variant="subtle"
      >
        Primary focus
      </UBadge>
      <UBadge
        color="secondary"
        variant="subtle"
      >
        Technical clarity
      </UBadge>
      <UBadge
        color="success"
        variant="subtle"
      >
        Durable defaults
      </UBadge>
    </UMarquee>
  </div>

  <UBlogPosts
    v-else-if="props.name === 'blog-posts'"
    orientation="horizontal"
  >
    <UBlogPost
      v-for="post in blogPosts"
      :key="post.title"
      v-bind="post"
      variant="outline"
    />
  </UBlogPosts>

  <UBlogPost
    v-else-if="props.name === 'blog-post'"
    v-bind="blogPosts[0]"
    variant="outline"
  />

  <div
    v-else-if="props.name === 'changelog-versions'"
    class="grid gap-3"
  >
    <UCard
      v-for="version in changelogVersions"
      :key="version.title"
      variant="outline"
      :ui="{ body: 'p-4' }"
    >
      <UBadge
        color="neutral"
        variant="outline"
      >
        {{ version.date }}
      </UBadge>
      <h3 class="mt-3 font-semibold text-highlighted">
        {{ version.title }}
      </h3>
      <p class="mt-1 text-sm text-muted">
        {{ version.description }}
      </p>
    </UCard>
  </div>

  <UCard
    v-else-if="props.name === 'changelog-version'"
    variant="outline"
    :ui="{ body: 'p-4' }"
  >
    <UBadge
      color="neutral"
      variant="outline"
    >
      v0.2
    </UBadge>
    <h3 class="mt-3 font-semibold text-highlighted">
      {{ props.context.copy.releaseTitle }}
    </h3>
    <p class="mt-1 text-sm text-muted">
      {{ props.context.copy.releaseDescription }}
    </p>
  </UCard>

  <UPricingPlans
    v-else-if="props.name === 'pricing-plans'"
    :plans="pricingPlans"
  />

  <UPricingPlan
    v-else-if="props.name === 'pricing-plan'"
    v-bind="pricingPlans[1]"
  />

  <UPricingTable
    v-else-if="props.name === 'pricing-table'"
    :tiers="pricingTableTiers"
    :sections="pricingTableSections"
  />

  <UMarquee
    v-else-if="props.name === 'marquee'"
    pause-on-hover
    overlay
    class="rounded-sm border border-default bg-muted p-4"
  >
    <UBadge
      color="neutral"
      variant="outline"
    >
      Nuxt UI layer
    </UBadge>
    <UBadge
      color="primary"
      variant="subtle"
    >
      Primary focus
    </UBadge>
    <UBadge
      color="secondary"
      variant="subtle"
    >
      Technical clarity
    </UBadge>
    <UBadge
      color="success"
      variant="subtle"
    >
      Durable defaults
    </UBadge>
  </UMarquee>
</template>
