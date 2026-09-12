<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useAppConfig, useColorMode } from '#imports'
import { parseStudioDocument } from '../../src/studio'
import type { StudioDocument } from '../../src/studio'
import { createBrandReference, guideContrastRatio, isGuideAssetPath } from '../../src/guide-reference'

const props = withDefaults(defineProps<{
  document?: StudioDocument
  section?: 'all' | 'colors' | 'typography' | 'assets' | 'styles' | 'icons'
}>(), { section: 'all', document: undefined })
const config = useAppConfig() as unknown as { idStudio?: { document?: StudioDocument } }
const reference = computed(() => {
  const source = props.document ?? config.idStudio?.document
  return source ? createBrandReference(parseStudioDocument(source)) : undefined
})
const show = (section: string) => props.section === 'all' || props.section === section
const imageAsset = (src?: string) => !!src && /\.(svg|png|jpe?g|webp|avif|gif)$/i.test(src)
const colorMode = useColorMode()
const contrastRoot = ref<HTMLElement>()
const contrastPairs = ['--ui-text', '--ui-text-muted', '--ui-primary', '--ui-error']
const ratios = ref<Record<string, number | undefined>>({})
async function measureContrast() {
  if (!import.meta.client) return
  await nextTick()
  requestAnimationFrame(() => {
    if (!contrastRoot.value) return
    const context = window.document.createElement('canvas').getContext('2d', { willReadFrequently: true })
    if (!context) return
    const pixel = (color: string) => {
      if (!CSS.supports('color', color)) return []
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = color
      context.fillRect(0, 0, 1, 1)
      return Array.from(context.getImageData(0, 0, 1, 1).data)
    }
    ratios.value = Object.fromEntries(Array.from(contrastRoot.value.querySelectorAll<HTMLElement>('[data-contrast-pair]')).map(element => {
      const style = getComputedStyle(element)
      return [element.dataset.contrastPair!, guideContrastRatio(pixel(style.color), pixel(style.backgroundColor))]
    }))
  })
}
onMounted(measureContrast)
watch([reference, () => colorMode.value], measureContrast)
</script>

<template>
  <div v-if="reference" class="not-prose space-y-10" data-brand-reference>
    <template v-if="show('colors')">
      <section aria-label="Brand palettes" class="space-y-6">
        <h2 class="text-xl font-semibold text-highlighted">Palette</h2>
        <p v-if="!reference.palettes.length" class="text-sm text-muted">No custom palettes. This brand uses Nuxt UI colors.</p>
        <div v-for="palette in reference.palettes" :key="palette.name" class="space-y-3">
          <h3 class="font-medium text-highlighted">{{ palette.name }}</h3>
          <ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            <li v-for="shade in palette.shades" :key="shade.shade" class="overflow-hidden rounded-lg border border-default">
              <div class="h-12 border-b border-default" :style="{ backgroundColor: shade.value }" aria-hidden="true" />
              <div class="space-y-1 p-3 text-xs">
                <span class="block font-medium">{{ palette.name }}{{ shade.shade ? `-${shade.shade}` : '' }}</span>
                <code class="block break-all text-muted">{{ shade.value }}</code>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section aria-label="Semantic roles" class="space-y-3">
        <h2 class="text-xl font-semibold text-highlighted">Semantic roles</h2>
        <div class="overflow-x-auto rounded-lg border border-default">
          <table class="w-full text-left text-sm">
            <caption class="sr-only">Configured Nuxt UI color roles</caption>
            <thead class="bg-muted"><tr><th class="p-3" scope="col">Role</th><th class="p-3" scope="col">Palette</th><th class="p-3" scope="col">Source</th></tr></thead>
            <tbody><tr v-for="role in reference.roles" :key="role.role" class="border-t border-default"><th class="p-3 font-medium" scope="row">{{ role.role }}</th><td class="p-3">{{ role.palette }}</td><td class="p-3 text-muted">{{ role.source }}</td></tr></tbody>
          </table>
        </div>
        <p class="text-xs text-muted">Unspecified roles follow Nuxt UI defaults.</p>
      </section>
      <section aria-label="Theme variables" class="space-y-3">
        <h2 class="text-xl font-semibold text-highlighted">Light and dark variables</h2>
        <p class="text-sm text-muted">Explicit brand values. Dark mode inherits light values unless overridden; other values follow Nuxt UI defaults.</p>
        <div class="overflow-x-auto rounded-lg border border-default">
          <table class="w-full table-fixed text-left text-xs">
            <caption class="sr-only">Brand CSS variables by color mode</caption>
            <thead class="bg-muted"><tr><th class="p-3" scope="col">Variable</th><th class="p-3" scope="col">Light</th><th class="p-3" scope="col">Dark</th></tr></thead>
            <tbody><tr v-for="variable in reference.variables" :key="variable.name" class="border-t border-default"><th class="break-all p-3 font-mono font-normal" scope="row">{{ variable.name }}</th><td class="break-words p-3 font-mono">{{ variable.light ?? 'Nuxt UI default' }}</td><td class="break-words p-3 font-mono">{{ variable.dark ?? 'Nuxt UI default' }}</td></tr></tbody>
          </table>
        </div>
      </section>
      <section ref="contrastRoot" aria-label="Text contrast" class="space-y-3">
        <h2 class="text-xl font-semibold text-highlighted">Text contrast · {{ colorMode.value }}</h2>
        <p class="text-sm text-muted">Selected opaque text colors against the current default surface. Normal text needs at least 4.5:1. These checks do not assess every component or interaction state.</p>
        <ul class="grid gap-3 sm:grid-cols-2">
          <li v-for="pair in contrastPairs" :key="pair" class="space-y-2 rounded-lg border border-default p-3 text-sm">
            <span :data-contrast-pair="pair" :style="{ color: `var(${pair})`, backgroundColor: 'var(--ui-bg)' }" class="block rounded p-2">Sample text</span>
            <code class="text-xs">{{ pair }}</code>
            <p>{{ ratios[pair] === undefined ? 'Not measured' : `${ratios[pair]!.toFixed(2)}:1 · ${ratios[pair]! >= 4.5 ? 'Meets normal text contrast' : 'Below normal text contrast'}` }}</p>
          </li>
        </ul>
      </section>
    </template>
    <section v-if="show('typography')" aria-label="Typography roles" class="space-y-4">
      <h2 class="text-xl font-semibold text-highlighted">Typography</h2>
      <p v-if="!reference.typography.length" class="text-sm text-muted">Typography follows Nuxt UI defaults.</p>
      <article v-for="font in reference.typography" :key="font.role" class="space-y-3 rounded-lg border border-default p-4">
        <h3 class="font-medium text-highlighted">{{ font.role }}</h3>
        <p class="break-words text-2xl" :style="{ fontFamily: `var(--font-${font.role}, ${font.family})` }">The quick brown fox jumps over the lazy dog.</p>
        <dl class="space-y-2 text-xs"><div><dt class="font-medium">Light</dt><dd class="break-words font-mono text-muted">{{ font.light }}</dd></div><div><dt class="font-medium">Dark</dt><dd class="break-words font-mono text-muted">{{ font.dark }}</dd></div></dl>
      </article>
    </section>
    <section v-if="show('icons')" aria-label="Configured icons" class="space-y-4">
      <h2 class="text-xl font-semibold text-highlighted">Icons</h2>
      <p v-if="!reference.icons.length" class="text-sm text-muted">Icons follow Nuxt UI defaults.</p>
      <ul class="grid gap-3 sm:grid-cols-2">
        <li v-for="item in reference.icons" :key="item.role" class="flex min-w-0 gap-3 rounded-lg border border-default p-3">
          <UIcon :name="item.icon" class="size-5 shrink-0" aria-hidden="true" />
          <div class="min-w-0 text-sm"><span class="font-medium">{{ item.role }}</span><code class="block break-all text-xs text-muted">{{ item.icon }}</code></div>
        </li>
      </ul>
    </section>
    <section v-if="show('styles')" aria-label="Configured styles" class="space-y-4">
      <h2 class="text-xl font-semibold text-highlighted">Styles</h2>
      <dl class="grid grid-cols-2 gap-3 rounded-lg border border-default p-4 text-sm"><div><dt class="font-medium">Corner radius · Light</dt><dd>{{ reference.radius.light ?? 'Nuxt UI default' }}</dd></div><div><dt class="font-medium">Corner radius · Dark</dt><dd>{{ reference.radius.dark ?? 'Nuxt UI default' }}</dd></div></dl>
      <p class="text-sm text-muted">Only explicit component overrides are listed. Other settings use Nuxt UI defaults.</p>
      <details v-for="component in reference.components" :key="component.name" class="rounded-lg border border-default p-3">
        <summary class="cursor-pointer text-sm font-medium">{{ component.name }}</summary>
        <pre class="mt-3 overflow-x-auto text-xs"><code>{{ component.config }}</code></pre>
      </details>
    </section>
    <section v-if="show('assets')" aria-label="Brand assets" class="space-y-4">
      <h2 class="text-xl font-semibold text-highlighted">Assets</h2>
      <p v-if="!reference.assets.length" class="text-sm text-muted">No assets have been added.</p>
      <ul class="grid gap-4 sm:grid-cols-2">
        <li v-for="asset in reference.assets" :key="asset.key" class="min-w-0 overflow-hidden rounded-lg border border-default">
          <div v-if="isGuideAssetPath(asset.src) && imageAsset(asset.src)" class="flex h-32 items-center justify-center p-5" :style="{ background: asset.media === 'dark' ? '#18181b' : '#fafafa' }">
            <img :src="asset.src" :alt="asset.alt || asset.name" loading="lazy" class="max-h-full max-w-full object-contain">
          </div>
          <div class="space-y-2 p-4 text-sm"><h3 class="font-medium">{{ asset.name }}</h3><p class="text-xs text-muted">{{ asset.role }} · {{ asset.media ?? 'any' }}</p><a v-if="isGuideAssetPath(asset.src)" :href="asset.src" download class="break-all text-primary underline underline-offset-4">Download {{ asset.name }}</a><p v-else class="break-all text-muted">{{ asset.src }}</p></div>
        </li>
      </ul>
    </section>
  </div>
  <p v-else class="text-sm text-muted">Connect a brand source to display its reference.</p>
</template>
