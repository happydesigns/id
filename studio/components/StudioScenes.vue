<script setup lang="ts">
import { computed, ref } from 'vue'
import type { StudioDocument, StudioScene } from '../../src/studio'

const props = defineProps<{ document: StudioDocument, scene: StudioScene, state: string, mode: 'light' | 'dark' }>()


const open = ref(false)
const saved = ref(false)
const projectName = ref('')
const logo = computed(() => {
  const logos = props.document.brand.assets?.logos
  return (props.mode === 'dark' ? logos?.wordmarkInverse : undefined) ?? logos?.wordmark ?? logos?.logo
})
</script>

<template>
  <div :class="scene === 'components' ? '' : 'mx-auto max-w-6xl p-5 sm:p-8'">
    <header v-if="scene !== 'components'" class="mb-8 flex items-center justify-between gap-4 border-b border-default pb-5">
      <div class="flex min-w-0 items-center gap-3">
        <img
          v-if="logo"
          :src="logo.src"
          :alt="logo.alt || document.theme.label"
          class="max-h-8 max-w-36 object-contain"
        >
        <span
          v-else
          class="text-lg font-semibold text-highlighted"
        >{{ document.theme.label }}</span>
      </div>
    </header>

    <IdStudioComponents v-if="scene === 'components'" :state="state" />
    <template v-else-if="scene === 'landing'">
      <UPageHero title="Your projects, in one place" :description="document.brand.claim || 'Organize tasks, share files and track deadlines with your team.'" :ui="{ container: 'py-10 sm:py-16 lg:py-20' }">
        <template #links>
          <UButton size="lg" @click="open = true">Create a project</UButton>
          <UButton size="lg" color="neutral" variant="outline" to="#features">View features</UButton>
        </template>
      </UPageHero>
      <UPageSection id="features" title="Project tools" :ui="{ container: 'py-10 sm:py-12 lg:py-12', title: 'text-2xl sm:text-3xl lg:text-3xl' }">
        <UPageGrid>
          <UPageCard v-for="item in [{ title: 'Tasks', description: 'Assign owners and due dates. Filter by status to find unfinished work.', icon: 'i-lucide-list-checks' }, { title: 'Files', description: 'Keep briefs, designs and exports alongside the project.', icon: 'i-lucide-folder' }, { title: 'Activity', description: 'Review recent updates and decisions from your team.', icon: 'i-lucide-history' }]" :key="item.title" :title="item.title" :description="item.description" :icon="item.icon" />
        </UPageGrid>
      </UPageSection>
      <UModal v-model:open="open" title="Create a project" description="Choose a name for your project.">
        <template #body><UFormField label="Project name"><UInput v-model="projectName" placeholder="Website redesign" class="w-full" /></UFormField></template>
        <template #footer><UButton :disabled="!projectName.trim()" @click="saved = true; open = false">Create project</UButton><UButton color="neutral" variant="outline" @click="open = false">Cancel</UButton></template>
      </UModal>
      <UAlert v-if="saved" color="success" title="Project created" :description="projectName" class="mb-8" />
    </template>

    <template v-else>
      <div class="grid gap-8 sm:grid-cols-[150px_1fr]">
        <nav
          aria-label="Example documentation"
          class="space-y-2 text-sm"
        >
          <p class="mb-4 font-semibold text-highlighted">
            Getting started
          </p><a
            href="#overview"
            class="block rounded-md bg-primary/10 px-3 py-2 text-primary"
          >Overview</a><a
            href="#principles"
            class="block px-3 py-2 text-muted"
          >Principles</a><a
            href="#installation"
            class="block px-3 py-2 text-muted"
          >Installation</a>
        </nav>
        <article class="min-w-0 max-w-2xl">
          <p class="text-xs uppercase tracking-widest text-muted">
            Guide / Getting started
          </p><h1
            id="overview"
            class="mt-4 text-4xl font-semibold tracking-tight text-highlighted"
          >
            Use your brand
          </h1><p class="mt-5 text-lg leading-8 text-muted">
            Install the brand layer and use its colors and typography in your application.
          </p>
          <USeparator class="my-8" />
          <h2
            id="principles"
            class="text-2xl font-semibold text-highlighted"
          >
            Theme tokens
          </h2><p class="my-4 leading-7">
            Use semantic tokens for text, backgrounds and borders. They follow the active brand and color mode.
          </p>
          <UAlert
            color="info"
            variant="subtle"
            title="One source of truth"
            description="Change the brand document once, then use the same values in every application."
            class="my-6"
          />
          <h2
            id="installation"
            class="mt-9 text-2xl font-semibold text-highlighted"
          >
            Use the brand layer
          </h2><pre class="my-5 overflow-x-auto rounded-lg border border-default bg-elevated p-5 text-sm"><code>export default defineNuxtConfig({
  extends: ['{{ document.brand.packageName || '@example/brand' }}']
})</code></pre>
          <UCard>
            <UTable :data="[{ token: 'Primary', purpose: 'Actions and focus' }, { token: 'Neutral', purpose: 'Text, surfaces and borders' }]" />
          </UCard>
        </article>
      </div>
    </template>
    <footer v-if="scene !== 'components'" class="mt-10 flex flex-wrap justify-between gap-3 border-t border-default pt-5 text-xs text-muted">
      <span>{{ document.theme.label }}</span>
    </footer>
  </div>
</template>
