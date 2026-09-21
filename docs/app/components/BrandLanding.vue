<script setup lang="ts">
import { useBrandTheme } from '../../../app/composables/useBrandTheme'

const theme = useBrandTheme()
const workspace = ref('Acme Studio')
const tabs = [{ label: 'nuxt.config.ts', value: 'config' }, { label: 'main.css', value: 'css' }]
const snippets = {
  config: 'export default defineNuxtConfig({\n  extends: [\'@acme/brand\']\n})',
  css: '@import "tailwindcss";\n@import "@nuxt/ui";\n@import "@acme/brand/styles.css";',
}
const steps = [
  { number: '01', icon: 'i-lucide-palette', title: 'Define the identity', description: 'Colors, type, assets and component defaults. One editable source for the details that make your brand.' },
  { number: '02', icon: 'i-lucide-panels-top-left', title: 'See it in context', description: 'Try real interfaces in Studio. Compare changes across components, templates and light or dark mode.' },
  { number: '03', icon: 'i-lucide-layers', title: 'Use it everywhere', description: 'Export a native Nuxt UI layer. Keep application behavior independent and bring the same brand to your next project.' },
]
</script>

<template>
  <div class="brand-landing">
    <UPageHero
      orientation="horizontal"
      :ui="{ container: 'py-16 sm:py-24 lg:py-28 gap-12 lg:gap-16', title: 'text-5xl sm:text-6xl lg:text-7xl tracking-tight', description: 'text-lg sm:text-xl max-w-xl' }"
      headline="Identity for Nuxt UI"
      description="Build the application once. Give it an identity that travels with it — from your first button to your next product."
    >
      <template #title>
        One app.<br>
        <span class="text-primary">Every identity.</span>
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
      <div class="brand-demo overflow-hidden rounded-xl border border-default bg-muted shadow-xl">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-default px-5 py-4">
          <span class="flex items-center gap-2 text-sm font-medium"><UIcon
            name="i-lucide-swatch-book"
            class="size-4 text-primary"
          />Try another identity</span>
          <IdThemeSelect class="max-w-44" />
        </div>
        <div class="p-5 sm:p-7">
          <div class="mb-7 flex items-start justify-between gap-4">
            <div>
              <p class="mb-2 text-xs font-medium uppercase tracking-widest text-muted">
                Your workspace
              </p>
              <h2 class="font-sans text-2xl font-semibold text-highlighted">
                {{ workspace || 'Your studio' }}
              </h2>
            </div>
            <UBadge
              color="success"
              variant="subtle"
            >
              All systems go
            </UBadge>
          </div>
          <UCard :ui="{ body: 'space-y-5' }">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm text-muted">
                  Project overview
                </p><h3 class="mt-1 text-lg font-semibold">
                  Website refresh
                </h3>
              </div>
              <UIcon
                name="i-lucide-orbit"
                class="size-8 text-primary"
              />
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-semibold tracking-tight">68<span class="text-primary">%</span></span><span class="text-sm text-muted">ready for launch</span>
            </div>
            <UProgress
              :model-value="68"
              aria-label="Project completion"
            />
            <UFormField
              label="Workspace name"
              name="demo-workspace"
            >
              <UInput
                v-model="workspace"
                class="w-full"
                icon="i-lucide-building-2"
              />
            </UFormField>
            <div class="flex items-center justify-between gap-3">
              <div class="flex -space-x-2">
                <UAvatar
                  v-for="name in ['Alex', 'Sam', 'Jo']"
                  :key="name"
                  :alt="name"
                  size="sm"
                  class="ring-2 ring-default"
                />
              </div>
              <UButton
                to="/studio"
                trailing-icon="i-lucide-arrow-up-right"
              >
                Make it yours
              </UButton>
            </div>
          </UCard>
          <div class="mt-5 grid grid-cols-3 gap-3 text-sm">
            <div class="rounded-lg border border-default bg-default p-3">
              <span class="mb-2 block size-3 rounded-full bg-primary" />Primary
            </div>
            <div class="rounded-lg border border-default bg-default p-3">
              <span class="mb-2 block size-3 rounded-full bg-secondary" />Secondary
            </div>
            <div class="rounded-lg border border-default bg-default p-3">
              <span class="mb-2 block size-3 rounded-full bg-success" />Success
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between gap-4 border-t border-default px-5 py-3 text-xs text-muted">
          <span>Real Nuxt UI components</span><span>{{ theme.currentTheme.value?.label }}</span>
        </div>
      </div>
    </UPageHero>

    <UContainer>
      <div class="grid gap-0 divide-y divide-default border-y border-default sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div
          v-for="item in [{ title: 'One source', detail: 'Your brand, editable and portable' }, { title: 'Native Nuxt UI', detail: 'The components you already use' }, { title: 'Your application', detail: 'Your content, your behavior' }]"
          :key="item.title"
          class="px-6 py-7 first:pl-0"
        >
          <p class="font-semibold text-highlighted">
            {{ item.title }}
          </p><p class="mt-1 text-sm text-muted">
            {{ item.detail }}
          </p>
        </div>
      </div>
      <section
        class="py-16 sm:py-24"
        aria-labelledby="brand-workflow"
      >
        <div class="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p class="mb-3 text-sm font-medium text-primary">
              From identity to interface
            </p><h2
              id="brand-workflow"
              class="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              A brand you can build with.
            </h2>
          </div>
          <p class="max-w-sm text-muted">
            Design decisions become reusable defaults. Your application stays focused on what it does.
          </p>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          <UCard
            v-for="step in steps"
            :key="step.number"
            :ui="{ body: 'sm:p-7' }"
          >
            <div class="mb-8 flex items-center justify-between">
              <UIcon
                :name="step.icon"
                class="size-7 text-primary"
              /><span class="font-mono text-sm text-dimmed">{{ step.number }}</span>
            </div>
            <h3 class="text-xl font-semibold">
              {{ step.title }}
            </h3><p class="mt-3 text-sm leading-relaxed text-muted">
              {{ step.description }}
            </p>
          </UCard>
        </div>
      </section>
      <section
        class="mb-16 grid overflow-hidden rounded-xl border border-default bg-muted lg:mb-24 lg:grid-cols-2"
        aria-labelledby="brand-install"
      >
        <div class="p-7 sm:p-10">
          <p class="mb-3 text-sm font-medium text-primary">
            A small integration. A shared identity.
          </p>
          <h2
            id="brand-install"
            class="text-3xl font-semibold tracking-tight"
          >
            Make the brand<br>a dependency.
          </h2>
          <p class="mt-5 max-w-md leading-relaxed text-muted">
            Extend your exported layer and import its styles. Buttons, forms and feedback share the same identity — across every application that uses it.
          </p>
          <UButton
            to="/guides/brand-studio"
            color="neutral"
            variant="outline"
            class="mt-7"
            trailing-icon="i-lucide-arrow-right"
          >
            Explore the workflow
          </UButton>
        </div>
        <div class="flex items-center border-t border-default bg-default p-5 sm:p-8 lg:border-t-0 lg:border-l">
          <div class="w-full overflow-hidden rounded-lg border border-default">
            <UTabs
              :items="tabs"
              default-value="config"
              variant="link"
              :ui="{ list: 'px-3', content: 'p-5 sm:p-7' }"
            >
              <template #content="{ item }">
                <pre class="overflow-x-auto text-sm leading-7 text-highlighted"><code>{{ snippets[item.value as keyof typeof snippets] }}</code></pre>
              </template>
            </UTabs>
          </div>
        </div>
      </section>
    </UContainer>
  </div>
</template>
