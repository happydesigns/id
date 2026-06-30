<script setup lang="ts">
import { ref } from '#imports'
import type { ComponentExampleContext } from '../../../src/component-examples'

const props = defineProps<{
  name: string
  context: ComponentExampleContext
}>()

const projectName = ref(props.context.copy.projectTitle)
const status = ref('Ready for review')
const reviewer = ref('Design review')
const packageName = ref(props.context.packageName)
const note = ref('Keep the primary action clear. Use accent color for focus and active details.')
const enabled = ref(true)
const includeNotes = ref(true)
const progress = ref(72)
const budget = ref(4)
const tags = ref(['accessible', 'durable'])
const checks = ref(['borders', 'focus'])
const rhythm = ref('balanced')
const pin = ref(['2', '4', '2', '4'])
const accent = ref(props.context.accentColor)
const selectedSection = ref('components')

const statusItems = ['Draft', 'Ready for review', 'Published']
const reviewerItems = ['Design review', 'Engineering review', 'Ready to ship']
const packageItems = [props.context.packageName, '@example/ui', '@example/tokens']

const checkItems = [
  { label: 'Visible borders', value: 'borders' },
  { label: 'Clear focus', value: 'focus' },
  { label: 'Compact labels', value: 'labels' }
]

const rhythmItems = [
  { label: 'Dense', value: 'dense' },
  { label: 'Balanced', value: 'balanced' },
  { label: 'Spacious', value: 'spacious' }
]

const listboxItems = [
  { label: 'Colors', value: 'colors' },
  { label: 'Typography', value: 'typography' },
  { label: 'Logos', value: 'logos' },
  { label: 'Components', value: 'components' },
  { label: 'Voice', value: 'voice' }
]
</script>

<template>
  <UForm
    v-if="props.name === 'form-pattern'"
    :state="{ projectName, status, note }"
    class="space-y-5"
  >
    <div class="grid gap-4 md:grid-cols-2">
      <UFormField label="Project name" help="Use plain labels and visible borders.">
        <UInput v-model="projectName" />
      </UFormField>
      <UFormField label="Status" help="Name the state before adding color.">
        <USelect v-model="status" :items="statusItems" />
      </UFormField>
    </div>
    <UFormField label="Implementation note" help="Keep help text close to the decision it supports.">
      <UTextarea v-model="note" :rows="3" spellcheck="false" />
    </UFormField>
    <UFormField label="Package" help="Pair exact values with adjacent actions.">
      <UFieldGroup class="max-w-md">
        <UInput :model-value="props.context.packageName" readonly />
        <UButton color="neutral" variant="outline" icon="i-lucide-copy" aria-label="Copy package" />
      </UFieldGroup>
    </UFormField>
    <div class="flex flex-wrap justify-end gap-2 border-t border-default pt-4">
      <UButton label="Cancel" color="neutral" variant="outline" />
      <UButton label="Save settings" />
    </div>
  </UForm>

  <div v-else-if="props.name === 'text-entry-pattern'" class="grid gap-4 md:grid-cols-2">
    <UFormField label="Short text" help="Inputs are for exact, compact values.">
      <UInput v-model="projectName" />
    </UFormField>
    <UFormField label="Longer note" help="Textareas need enough room to feel intentional.">
      <UTextarea v-model="note" :rows="4" spellcheck="false" />
    </UFormField>
  </div>

  <div v-else-if="props.name === 'selection-pattern'" class="grid gap-4 md:grid-cols-2">
    <UFormField label="Known status" help="Short, stable option sets stay predictable.">
      <USelect v-model="status" :items="statusItems" />
    </UFormField>
    <UFormField label="Searchable reviewer" help="Search helps when the list grows.">
      <USelectMenu v-model="reviewer" :items="reviewerItems" />
    </UFormField>
    <UFormField label="Exact package" help="Suggestions complete exact technical values.">
      <UInputMenu v-model="packageName" :items="packageItems" />
    </UFormField>
    <UFormField label="Visible section" help="Keep visible choices open when scanning matters.">
      <UListbox v-model="selectedSection" :items="listboxItems" value-key="value" />
    </UFormField>
  </div>

  <div v-else-if="props.name === 'choice-pattern'" class="grid gap-5 md:grid-cols-2">
    <div class="space-y-3">
      <UCheckbox v-model="includeNotes" label="Attach implementation notes" />
      <USwitch v-model="enabled" label="Apply brand layer" />
    </div>
    <div class="grid gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      <UCheckboxGroup v-model="checks" :items="checkItems" />
      <URadioGroup v-model="rhythm" :items="rhythmItems" />
    </div>
  </div>

  <div v-else-if="props.name === 'bounded-pattern'" class="grid gap-5 md:grid-cols-2">
    <UFormField label="Pattern count" help="Use steppers for bounded numeric choices.">
      <UInputNumber v-model="budget" :min="1" :max="12" class="max-w-xs" />
    </UFormField>
    <UFormField label="Review window" help="Group date and time when they describe one decision.">
      <div class="grid gap-2 sm:grid-cols-2">
        <UInputDate icon="i-lucide-calendar" class="w-full" />
        <UInputTime class="w-full" />
      </div>
    </UFormField>
    <UFormField label="Intensity" help="Sliders are useful only for approximate values.">
      <USlider v-model="progress" />
    </UFormField>
    <UFormField label="Access code" help="Pin inputs are for short fixed-length codes.">
      <UPinInput v-model="pin" />
    </UFormField>
  </div>

  <div v-else-if="props.name === 'advanced-inputs-pattern'" class="grid gap-5 md:grid-cols-2">
    <UFormField label="Labels" help="Tags should help scanning, not decorate the form.">
      <UInputTags v-model="tags" />
    </UFormField>
    <UFormField label="Asset upload" help="Uploads belong where files are part of the task.">
      <UFileUpload label="Drop a brand asset" description="SVG, PNG, or PDF" icon="i-lucide-upload" />
    </UFormField>
    <UFormField label="Accent" help="Color pickers belong in tooling contexts.">
      <UColorPicker v-model="accent" />
    </UFormField>
    <UFormField label="Publishing date" help="Calendars are for date selection, not generic decoration.">
      <UCalendar />
    </UFormField>
  </div>

  <UForm v-else-if="props.name === 'form'" :state="{ projectName, status }" class="grid gap-4 sm:grid-cols-2">
    <UFormField label="Project name" help="Plain labels and visible borders keep forms easy to scan.">
      <UInput v-model="projectName" />
    </UFormField>
    <UFormField label="Status" help="Use semantic labels before color.">
      <USelect v-model="status" :items="statusItems" />
    </UFormField>
    <div class="sm:col-span-2">
      <UButton label="Save settings" />
    </div>
  </UForm>

  <UFormField v-else-if="props.name === 'form-field'" label="Project name" help="Help text stays close to the control it explains.">
    <UInput v-model="projectName" />
  </UFormField>

  <UInput v-else-if="props.name === 'input'" v-model="projectName" class="max-w-md" />
  <UTextarea v-else-if="props.name === 'textarea'" v-model="note" :rows="3" spellcheck="false" />
  <USelect v-else-if="props.name === 'select'" v-model="status" :items="statusItems" class="max-w-sm" />
  <USelectMenu v-else-if="props.name === 'select-menu'" v-model="reviewer" :items="reviewerItems" class="max-w-sm" />
  <UInputMenu v-else-if="props.name === 'input-menu'" v-model="packageName" :items="packageItems" class="max-w-md" />
  <UInputNumber v-else-if="props.name === 'input-number'" v-model="budget" :min="1" :max="12" class="max-w-xs" />
  <UInputTags v-else-if="props.name === 'input-tags'" v-model="tags" class="max-w-md" />
  <UInputDate v-else-if="props.name === 'input-date'" icon="i-lucide-calendar" class="w-full max-w-[16rem]" />
  <UInputTime v-else-if="props.name === 'input-time'" class="max-w-xs" />
  <UCheckbox v-else-if="props.name === 'checkbox'" v-model="includeNotes" label="Attach implementation notes" />
  <UCheckboxGroup v-else-if="props.name === 'checkbox-group'" v-model="checks" :items="checkItems" />
  <URadioGroup v-else-if="props.name === 'radio-group'" v-model="rhythm" :items="rhythmItems" />
  <USwitch v-else-if="props.name === 'switch'" v-model="enabled" label="Apply brand layer" />
  <USlider v-else-if="props.name === 'slider'" v-model="progress" />
  <UPinInput v-else-if="props.name === 'pin-input'" v-model="pin" />
  <UFileUpload v-else-if="props.name === 'file-upload'" label="Drop a brand asset" description="SVG, PNG, or PDF" icon="i-lucide-upload" />
  <UColorPicker v-else-if="props.name === 'color-picker'" v-model="accent" />
  <UCalendar v-else-if="props.name === 'calendar'" />
  <UListbox v-else-if="props.name === 'listbox'" v-model="selectedSection" :items="listboxItems" value-key="value" class="max-w-sm" />
</template>
