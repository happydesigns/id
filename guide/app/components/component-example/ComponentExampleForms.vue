<script setup lang="ts">
import { computed, ref } from 'vue'
import { resolveComponentExampleMessage, type ComponentExampleMessageKey, type ComponentExampleContext } from '../../../../src/component-examples'

const props = defineProps<{
  name: string
  context: ComponentExampleContext
}>()

const t = (key: ComponentExampleMessageKey) => resolveComponentExampleMessage(props.context.messages, key)

const projectName = ref(props.context.copy.projectTitle)
const status = ref<string | undefined>(props.name === 'select' ? undefined : 'Ready for review')
const reviewer = ref('Design review')
const packageName = ref(props.context.packageName)
const note = ref(t('forms.initialNote'))
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

const statusItems = computed(() => [{ value: 'Draft', label: t('forms.draft') }, { value: 'Ready for review', label: t('forms.readyForReview') }, { value: 'Published', label: t('forms.published') }])
const reviewerItems = computed(() => [{ value: 'Design review', label: t('forms.designReview') }, { value: 'Engineering review', label: t('forms.engineeringReview') }, { value: 'Ready to ship', label: t('forms.readyToShip') }])
const packageItems = [props.context.packageName, '@example/ui', '@example/tokens']

const checkItems = computed(() => [
  { label: t('forms.visibleBorders'), value: 'borders' },
  { label: t('forms.clearFocus'), value: 'focus' },
  { label: t('forms.compactLabels'), value: 'labels' },
])

const rhythmItems = computed(() => [
  { label: t('forms.dense'), value: 'dense' },
  { label: t('forms.balanced'), value: 'balanced' },
  { label: t('forms.spacious'), value: 'spacious' },
])

const listboxItems = computed(() => [
  { label: t('forms.colors'), value: 'colors' },
  { label: t('forms.typography'), value: 'typography' },
  { label: t('forms.logos'), value: 'logos' },
  { label: t('forms.components'), value: 'components' },
  { label: t('forms.voice'), value: 'voice' },
])
</script>

<template>
  <UForm
    v-if="props.name === 'form-pattern'"
    :state="{ projectName, status, note }"
    class="space-y-5"
  >
    <div class="grid gap-4 md:grid-cols-2">
      <UFormField
        :label="t('forms.projectName')"
        :help="t('forms.projectNameHelp')"
      >
        <UInput v-model="projectName" />
      </UFormField>
      <UFormField
        :label="t('forms.reviewStatus')"
        :help="t('forms.reviewStatusHelp')"
      >
        <USelect
          v-model="status"
          :items="statusItems"
        />
      </UFormField>
    </div>
    <UFormField
      :label="t('forms.implementationNote')"
      :help="t('forms.noteHelp')"
    >
      <UTextarea
        v-model="note"
        :rows="3"
        spellcheck="false"
      />
    </UFormField>
    <UFormField
      :label="t('forms.package')"
      :help="t('forms.packageHelp')"
    >
      <UFieldGroup class="max-w-md">
        <UInput
          :model-value="props.context.packageName"
          readonly
        />
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-copy"
          :aria-label="t('forms.copyPackage')"
        />
      </UFieldGroup>
    </UFormField>
    <div class="flex flex-wrap justify-end gap-2 border-t border-default pt-4">
      <UButton
        :label="t('actions.cancel')"
        color="neutral"
        variant="outline"
      />
      <UButton :label="t('forms.saveSettings')" />
    </div>
  </UForm>

  <div
    v-else-if="props.name === 'text-entry-pattern'"
    class="grid gap-4 md:grid-cols-2"
  >
    <UFormField
      :label="t('forms.shortText')"
      :help="t('forms.shortTextHelp')"
    >
      <UInput v-model="projectName" />
    </UFormField>
    <UFormField
      :label="t('forms.longerNote')"
      :help="t('forms.longNoteHelp')"
    >
      <UTextarea
        v-model="note"
        :rows="4"
        spellcheck="false"
      />
    </UFormField>
  </div>

  <div
    v-else-if="props.name === 'selection-pattern'"
    class="grid gap-4 md:grid-cols-2"
  >
    <UFormField
      :label="t('forms.knownStatus')"
      :help="t('forms.knownStatusHelp')"
    >
      <USelect
        v-model="status"
        :items="statusItems"
      />
    </UFormField>
    <UFormField
      :label="t('forms.searchableReviewer')"
      :help="t('forms.reviewerHelp')"
    >
      <USelectMenu
        v-model="reviewer"
        :items="reviewerItems"
        value-key="value"
      />
    </UFormField>
    <UFormField
      :label="t('forms.exactPackage')"
      :help="t('forms.packageSuggestionsHelp')"
    >
      <UInputMenu
        v-model="packageName"
        :items="packageItems"
      />
    </UFormField>
    <UFormField
      :label="t('forms.visibleSection')"
      :help="t('forms.sectionHelp')"
    >
      <UListbox
        v-model="selectedSection"
        :items="listboxItems"
        value-key="value"
      />
    </UFormField>
  </div>

  <div
    v-else-if="props.name === 'choice-pattern'"
    class="grid gap-5 md:grid-cols-2"
  >
    <div class="space-y-3">
      <UCheckbox
        v-model="includeNotes"
        :label="t('forms.includeNotes')"
      />
      <USwitch
        v-model="enabled"
        :label="t('forms.enabled')"
      />
    </div>
    <div class="grid gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      <UCheckboxGroup
        v-model="checks"
        :items="checkItems"
      />
      <URadioGroup
        v-model="rhythm"
        :items="rhythmItems"
      />
    </div>
  </div>

  <div
    v-else-if="props.name === 'bounded-pattern'"
    class="grid gap-5 md:grid-cols-2"
  >
    <UFormField
      :label="t('forms.patternCount')"
      :help="t('forms.countHelp')"
    >
      <UInputNumber
        v-model="budget"
        :min="1"
        :max="12"
        class="max-w-xs"
      />
    </UFormField>
    <UFormField
      :label="t('forms.reviewWindow')"
      :help="t('forms.reviewWindowHelp')"
    >
      <div class="grid gap-2 sm:grid-cols-2">
        <UInputDate
          icon="i-lucide-calendar"
          class="w-full"
        />
        <UInputTime class="w-full" />
      </div>
    </UFormField>
    <UFormField
      :label="t('forms.intensity')"
      :help="t('forms.intensityHelp')"
    >
      <USlider v-model="progress" />
    </UFormField>
    <UFormField
      :label="t('forms.accessCode')"
      :help="t('forms.accessCodeHelp')"
    >
      <UPinInput v-model="pin" />
    </UFormField>
  </div>

  <div
    v-else-if="props.name === 'advanced-inputs-pattern'"
    class="grid gap-5 md:grid-cols-2"
  >
    <UFormField
      :label="t('forms.labels')"
      :help="t('forms.tagsHelp')"
    >
      <UInputTags v-model="tags" />
    </UFormField>
    <UFormField
      :label="t('forms.assetUpload')"
      :help="t('forms.uploadHelp')"
    >
      <UFileUpload
        :label="t('forms.uploadLabel')"
        :description="t('forms.uploadFormats')"
        icon="i-lucide-upload"
      />
    </UFormField>
    <UFormField
      :label="t('forms.accent')"
      :help="t('forms.accentHelp')"
    >
      <UColorPicker v-model="accent" />
    </UFormField>
    <UFormField
      :label="t('forms.publishingDate')"
      :help="t('forms.dateHelp')"
    >
      <UCalendar />
    </UFormField>
  </div>

  <UForm
    v-else-if="props.name === 'form'"
    :state="{ projectName, status }"
    class="grid gap-4 sm:grid-cols-2"
  >
    <UFormField
      :label="t('forms.projectName')"
      :help="t('forms.formNameHelp')"
    >
      <UInput v-model="projectName" />
    </UFormField>
    <UFormField
      :label="t('forms.reviewStatus')"
      :help="t('forms.formStatusHelp')"
    >
      <USelect
        v-model="status"
        :items="statusItems"
      />
    </UFormField>
    <div class="sm:col-span-2">
      <UButton :label="t('forms.saveSettings')" />
    </div>
  </UForm>

  <UFormField
    v-else-if="props.name === 'form-field'"
    :label="t('forms.projectName')"
    :help="t('forms.fieldHelp')"
  >
    <UInput v-model="projectName" />
  </UFormField>

  <UInput
    v-else-if="props.name === 'input'"
    v-model="projectName"
    class="max-w-md"
  />
  <UTextarea
    v-else-if="props.name === 'textarea'"
    v-model="note"
    :rows="3"
    spellcheck="false"
  />
  <USelect
    v-else-if="props.name === 'select'"
    v-model="status"
    :aria-label="t('forms.reviewStatus')"
    :placeholder="t('forms.selectPlaceholder')"
    :items="statusItems"
    class="max-w-sm"
  />
  <USelectMenu
    v-else-if="props.name === 'select-menu'"
    v-model="reviewer"
    :aria-label="t('forms.reviewer')"
    :items="reviewerItems"
    value-key="value"
    class="max-w-sm"
  />
  <UInputMenu
    v-else-if="props.name === 'input-menu'"
    v-model="packageName"
    :items="packageItems"
    class="max-w-md"
  />
  <UInputNumber
    v-else-if="props.name === 'input-number'"
    v-model="budget"
    :min="1"
    :max="12"
    class="max-w-xs"
  />
  <UInputTags
    v-else-if="props.name === 'input-tags'"
    v-model="tags"
    class="max-w-md"
  />
  <UInputDate
    v-else-if="props.name === 'input-date'"
    icon="i-lucide-calendar"
    class="w-full max-w-[16rem]"
  />
  <UInputTime
    v-else-if="props.name === 'input-time'"
    class="max-w-xs"
  />
  <UCheckbox
    v-else-if="props.name === 'checkbox'"
    v-model="includeNotes"
    :label="t('forms.includeNotes')"
  />
  <UCheckboxGroup
    v-else-if="props.name === 'checkbox-group'"
    v-model="checks"
    :items="checkItems"
  />
  <URadioGroup
    v-else-if="props.name === 'radio-group'"
    v-model="rhythm"
    :aria-label="t('forms.spacing')"
    :items="rhythmItems"
  />
  <USwitch
    v-else-if="props.name === 'switch'"
    v-model="enabled"
    :label="t('forms.enabled')"
  />
  <USlider
    v-else-if="props.name === 'slider'"
    v-model="progress"
  />
  <UPinInput
    v-else-if="props.name === 'pin-input'"
    v-model="pin"
  />
  <UFileUpload
    v-else-if="props.name === 'file-upload'"
    :label="t('forms.uploadLabel')"
    :description="t('forms.uploadFormats')"
    icon="i-lucide-upload"
  />
  <UColorPicker
    v-else-if="props.name === 'color-picker'"
    v-model="accent"
  />
  <UCalendar v-else-if="props.name === 'calendar'" />
  <UListbox
    v-else-if="props.name === 'listbox'"
    v-model="selectedSection"
    :items="listboxItems"
    value-key="value"
    class="max-w-sm"
  />
</template>
