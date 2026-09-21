<script setup lang="ts">
import { useStudioIcon } from '../playground-icons'

import { computed, ref, watch } from 'vue'
import { paletteRamp, paletteSwatch, rolePalettes } from '../palette'

const props = defineProps<{
  label: string
  role: string
  options: string[]
  colors: Record<string, string | Record<string, string | undefined>>
}>()
const model = defineModel<string>({ required: true })
const open = ref(false)
const all = ref(false)
watch(open, () => {
  all.value = false
})
const groups = computed(() => {
  const options = rolePalettes(props.options, props.role, model.value, props.colors, all.value)
  return [
    { label: 'Brand palettes', items: options.filter(name => typeof props.colors[name] === 'object') },
    { label: 'Nuxt UI palettes', items: options.filter(name => typeof props.colors[name] !== 'object') },
  ].filter(group => group.items.length)
})
function select(value: string) {
  model.value = value
  open.value = false
}

const resolveIcon = useStudioIcon()
</script>

<template>
  <UPopover
    v-model:open="open"
    :content="{ align: 'start' }"
  >
    <UButton
      color="neutral"
      variant="outline"
      :trailing-icon="resolveIcon('i-lucide-chevron-down')"
      :aria-label="label"
      class="w-full"
      :ui="{ trailingIcon: 'ms-auto' }"
    >
      <template #leading>
        <span
          class="size-3 shrink-0 rounded-full ring ring-default"
          :class="{ 'bg-elevated': model === '__default' }"
          :style="{ background: paletteSwatch(model, colors) }"
        />
      </template>
      <span class="capitalize">{{ model === '__default' ? 'Nuxt UI default' : model }}</span>
    </UButton>
    <template #content>
      <div
        class="grid w-80 max-w-[calc(100vw-2rem)] grid-cols-3 gap-1 p-2 max-h-[min(65dvh,28rem)] overflow-y-auto"
        :aria-label="`${label} palettes`"
      >
        <UButton
          color="neutral"
          variant="ghost"
          class="col-span-3"
          :aria-pressed="model === '__default'"
          :active="model === '__default'"
          active-variant="soft"
          @click="select('__default')"
        >
          Nuxt UI default
        </UButton>
        <template
          v-for="group in groups"
          :key="group.label"
        >
          <p class="col-span-3 px-2 pt-2 text-xs text-muted">
            {{ group.label }}
          </p>
          <UButton
            v-for="name in group.items"
            :key="name"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="name"
            :aria-pressed="model === name"
            :active="model === name"
            active-variant="soft"
            class="min-w-0"
            @click="select(name)"
          >
            <template #leading>
              <span
                class="h-3 w-4 shrink-0 rounded-full ring ring-default"
                :style="{ background: paletteRamp(name, colors) }"
              />
            </template>
            <span class="break-all whitespace-normal capitalize">{{ name }}</span>
          </UButton>
        </template>
        <UButton
          color="neutral"
          variant="link"
          size="xs"
          class="col-span-3"
          @click="all = !all"
        >
          {{ all ? 'Show suggested palettes' : 'Show all palettes' }}
        </UButton>
      </div>
    </template>
  </UPopover>
</template>
