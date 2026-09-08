<script setup lang="ts">
import { computed, ref } from 'vue'
import type { StudioDocument, StudioScene } from '../../src/studio'

const props = defineProps<{ document: StudioDocument, scene: StudioScene, state: string, mode: 'light' | 'dark' }>()


const open = ref(false)
const saved = ref(false)
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
      <UBadge
        color="neutral"
        variant="subtle"
      >
        {{ scene === 'landing' ? 'Landing page' : 'Documentation' }}
      </UBadge>
    </header>

    <IdStudioComponents v-if="scene === 'components'" :state="state" />
    <template v-else-if="scene === 'landing'">
      <section class="py-10 sm:py-20">
        <UBadge variant="subtle">
          A fresh perspective
        </UBadge>
        <h1 class="mt-6 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-highlighted sm:text-6xl">
          Good work starts<br>with a clear idea.
        </h1>
        <p class="mt-6 max-w-lg text-lg leading-8 text-muted">
          {{ document.brand.claim || 'Bring your team, ideas and next steps together in one thoughtful workspace.' }}
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <UButton
            size="lg"
            @click="saved = !saved"
          >
            {{ saved ? 'You’re on the list' : 'Get started' }}
          </UButton><UButton
            size="lg"
            color="neutral"
            variant="outline"
            @click="open = !open"
          >
            Explore the details
          </UButton>
        </div>
        <p
          v-if="open"
          class="mt-5 text-sm text-muted"
        >
          A considered experience, from your first idea to the finished result.
        </p>
      </section>
      <div class="grid gap-5 sm:grid-cols-3">
        <UCard
          v-for="(title, index) in ['Find your focus', 'Make it yours', 'Move together']"
          :key="title"
        >
          <p class="mb-8 font-mono text-sm text-primary">
            0{{ index + 1 }}
          </p><h2 class="text-lg font-semibold text-highlighted">
            {{ title }}
          </h2><p class="mt-3 text-sm leading-6 text-muted">
            Simple tools and thoughtful details give your best work room to grow.
          </p>
        </UCard>
      </div>
      <section class="my-10 rounded-lg border border-default bg-muted px-6 py-10 sm:px-10">
        <p class="text-xs uppercase tracking-widest text-muted">
          Designed around you
        </p><h2 class="mt-3 text-3xl font-semibold text-highlighted">
          Less friction. More possibility.
        </h2><p class="mt-4 max-w-lg leading-7 text-muted">
          A consistent identity connects the big moments with the smallest interactions.
        </p><UButton
          class="mt-6"
          @click="saved = !saved"
        >
          {{ saved ? 'Thank you' : 'Start a conversation' }}
        </UButton>
      </section>
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
            A shared language
          </h1><p class="mt-5 text-lg leading-8 text-muted">
            Make your identity easy to understand and consistent to use.
          </p>
          <USeparator class="my-8" />
          <h2
            id="principles"
            class="text-2xl font-semibold text-highlighted"
          >
            Start with the essentials
          </h2><p class="my-4 leading-7">
            Colors, typography and a clear hierarchy create a familiar experience. Keep the meaning of your brand close to its source.
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
      <span>{{ document.theme.label }} · Nuxt UI</span><span>Same content. Your identity.</span>
    </footer>
  </div>
</template>
