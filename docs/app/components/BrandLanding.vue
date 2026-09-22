<script setup lang="ts">
const workspace = ref('Website refresh')
const steps = [
  { icon: 'i-lucide-palette', title: 'Define your brand', description: 'Keep colors, typography, assets and component defaults in one editable source.' },
  { icon: 'i-lucide-panels-top-left', title: 'Preview your applications', description: 'Check the brand on real components and application routes, in light and dark mode.' },
  { icon: 'i-lucide-layers', title: 'Share a native layer', description: 'Export your brand as a Nuxt layer. Update each application when you are ready.' },
]
</script>

<template>
  <div>
    <UPageHero
      orientation="horizontal"
      headline="Identity for Nuxt UI"
      title="Build your apps. Brand them together."
      description="Develop your app ecosystem without tying application code to a visual identity. Define your brand in a reusable Nuxt layer, apply it across your apps, and evolve it in one place."
    >
      <template #links>
        <UButton
          to="/getting-started/introduction"
          size="xl"
          trailing-icon="i-lucide-arrow-right"
        >
          Read the docs
        </UButton>
        <UButton
          to="/studio"
          size="xl"
          color="neutral"
          variant="outline"
          icon="i-lucide-fingerprint"
        >
          Open Studio
        </UButton>
      </template>
      <UPageCard
        :title="workspace || 'Untitled project'"
        description="Switch the brand to see the same Nuxt UI components in another identity."
        icon="i-lucide-panels-top-left"
        variant="outline"
      >
        <template #header>
          <IdThemeSelect />
        </template>
        <UFormField
          label="Project name"
          name="demo-workspace"
        >
          <UInput
            v-model="workspace"
            class="w-full"
          />
        </UFormField>
        <UProgress
          :model-value="4"
          :max="6"
          aria-label="Project completion"
        />
        <template #footer>
          <UButton
            to="/studio"
            trailing-icon="i-lucide-arrow-right"
          >
            Edit brand in Studio
          </UButton>
        </template>
      </UPageCard>
    </UPageHero>

    <UPageSection
      headline="From brand to application"
      title="Define once. Apply across your apps."
      description="Your applications own their features, routes and content. The shared brand layer supplies their visual identity."
    >
      <UPageGrid>
        <UPageCard
          v-for="step in steps"
          :key="step.title"
          v-bind="step"
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      orientation="horizontal"
      title="Use your brand with Nuxt UI."
      description="Extend the exported layer and import its styles. When the brand changes, adopt the new version and rebuild your applications. ID is not required in their runtime."
    >
      <template #links>
        <UButton
          to="/getting-started/apply-branding"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-arrow-right"
        >
          Apply your brand
        </UButton>
      </template>
      <slot name="installation" />
    </UPageSection>
  </div>
</template>
