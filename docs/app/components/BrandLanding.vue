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
      :ui="{ container: 'py-16 sm:py-20 lg:py-32 gap-10 lg:gap-20', title: 'text-4xl sm:text-5xl lg:text-6xl', description: 'text-lg sm:text-xl' }"
      description="Develop your app ecosystem without tying application code to a visual identity. Define your brand in a reusable Nuxt layer, apply it across your apps, and evolve it in one place."
    >
      <template #title>
        Build your apps.<br>
        <span class="text-primary">Brand them together.</span>
      </template>
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
      <UCard
        variant="subtle"
        :ui="{ body: 'space-y-6' }"
      >
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <span class="flex items-center gap-2 text-sm font-medium">
              <UIcon
                name="i-lucide-panels-top-left"
                class="size-4 text-primary"
              />
              Your workspace
            </span>
            <IdThemeSelect />
          </div>
        </template>
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm text-muted">
              Project overview
            </p>
            <h2 class="mt-1 text-2xl font-semibold text-highlighted">
              {{ workspace || 'Untitled project' }}
            </h2>
          </div>
          <UBadge
            color="success"
            variant="subtle"
          >
            In progress
          </UBadge>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between gap-3 text-sm">
            <span class="text-muted">Launch preparation</span>
            <span>4 of 6 complete</span>
          </div>
          <UProgress
            :model-value="4"
            :max="6"
            aria-label="Project completion"
          />
        </div>
        <UFormField
          label="Project name"
          name="demo-workspace"
        >
          <UInput
            v-model="workspace"
            class="w-full"
          />
        </UFormField>
        <template #footer>
          <div class="flex flex-wrap items-center justify-between gap-4">
            <UAvatarGroup>
              <UAvatar
                v-for="name in ['Alex', 'Sam', 'Jo']"
                :key="name"
                :alt="name"
                size="sm"
              />
            </UAvatarGroup>
            <UButton
              to="/studio"
              trailing-icon="i-lucide-arrow-right"
            >
              Edit brand in Studio
            </UButton>
          </div>
        </template>
      </UCard>
    </UPageHero>

    <UPageSection
      :ui="{ container: 'py-12 sm:py-16 lg:py-24 gap-8 sm:gap-10 lg:gap-14' }"
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
      class="border-y border-default bg-muted"
      :ui="{ container: 'py-12 sm:py-16 lg:py-24 gap-8 lg:gap-20' }"
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
