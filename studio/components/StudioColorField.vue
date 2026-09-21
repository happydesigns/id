<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: string, label: string, error?: string }>()
const emit = defineEmits<{ change: [value: string] }>()
const open = ref(false)
const picked = ref('#000000')
watch(open, (value) => {
  if (value) picked.value = props.modelValue || '#000000'
})
</script>

<template>
  <UFormField
    :label="label"
    :error="error"
  >
    <div class="flex gap-2">
      <UPopover v-model:open="open">
        <UButton
          color="neutral"
          variant="outline"
          :aria-label="`Choose color for ${label}`"
          class="shrink-0"
        >
          <span
            class="size-5 rounded border border-default"
            :style="{ background: modelValue || 'transparent' }"
          />
        </UButton>
        <template #content>
          <div class="space-y-3 p-4">
            <UColorPicker
              v-model="picked"
              format="hex"
            />
            <UButton
              block
              @click="emit('change', picked); open = false"
            >
              Apply color
            </UButton>
          </div>
        </template>
      </UPopover>
      <UInput
        :model-value="modelValue"
        :aria-label="label"
        class="w-full"
        @change="emit('change', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </UFormField>
</template>
