<script setup lang="ts">
import { computed, ref } from 'vue'
import { resolveComponentExampleMessage, type ComponentExampleMessageKey, type ComponentExampleContext } from '../../../src/component-examples'

const props = defineProps<{
  name: string
  context: ComponentExampleContext
}>()

const t = (key: ComponentExampleMessageKey) => resolveComponentExampleMessage(props.context.messages, key)

const projectName = ref(props.context.copy.projectTitle)
const status = ref<string | undefined>(props.name === 'select' ? undefined : 'Ready for review')
const reviewer = ref('Design review')
const packageName = ref(props.context.packageName)
const note = ref(t('forms.keep_the_primary_action_clear_use_accent_color_for_focus_and_active_details'))
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

const statusItems = computed(() => [{ value: "Draft", label: t('forms.draft') }, { value: "Ready for review", label: t('forms.ready_for_review') }, { value: "Published", label: t('forms.published') }])
const reviewerItems = computed(() => [{ value: "Design review", label: t('forms.design_review') }, { value: "Engineering review", label: t('forms.engineering_review') }, { value: "Ready to ship", label: t('forms.ready_to_ship') }])
const packageItems = [props.context.packageName, '@example/ui', '@example/tokens']

const checkItems = computed(() => [
  { label: t('forms.visible_borders'), value: 'borders' },
  { label: t('forms.clear_focus'), value: 'focus' },
  { label: t('forms.compact_labels'), value: 'labels' }
])

const rhythmItems = computed(() => [
  { label: t('forms.dense'), value: 'dense' },
  { label: t('forms.balanced'), value: 'balanced' },
  { label: t('forms.spacious'), value: 'spacious' }
])

const listboxItems = computed(() => [
  { label: t('forms.colors'), value: 'colors' },
  { label: t('forms.typography'), value: 'typography' },
  { label: t('forms.logos'), value: 'logos' },
  { label: t('forms.components'), value: 'components' },
  { label: t('forms.voice'), value: 'voice' }
])
</script>

<template>
  <UForm
    v-if="props.name === 'form-pattern'"
    :state="{ projectName, status, note }"
    class="space-y-5"
  >
    <div class="grid gap-4 md:grid-cols-2">
      <UFormField :label="t('forms.projectName')" :help="t('forms.use_plain_labels_and_visible_borders')">
        <UInput v-model="projectName" />
      </UFormField>
      <UFormField :label="t('forms.reviewStatus')" :help="t('forms.name_the_state_before_adding_color')">
        <USelect v-model="status" :items="statusItems" />
      </UFormField>
    </div>
    <UFormField :label="t('forms.implementation_note')" :help="t('forms.keep_help_text_close_to_the_decision_it_supports')">
      <UTextarea v-model="note" :rows="3" spellcheck="false" />
    </UFormField>
    <UFormField :label="t('forms.package')" :help="t('forms.pair_exact_values_with_adjacent_actions')">
      <UFieldGroup class="max-w-md">
        <UInput :model-value="props.context.packageName" readonly />
        <UButton color="neutral" variant="outline" icon="i-lucide-copy" :aria-label="t('forms.copy_package')" />
      </UFieldGroup>
    </UFormField>
    <div class="flex flex-wrap justify-end gap-2 border-t border-default pt-4">
      <UButton :label="t('actions.cancel')" color="neutral" variant="outline" />
      <UButton :label="t('forms.save_settings')" />
    </div>
  </UForm>

  <div v-else-if="props.name === 'text-entry-pattern'" class="grid gap-4 md:grid-cols-2">
    <UFormField :label="t('forms.short_text')" :help="t('forms.inputs_are_for_exact_compact_values')">
      <UInput v-model="projectName" />
    </UFormField>
    <UFormField :label="t('forms.longer_note')" :help="t('forms.textareas_need_enough_room_to_feel_intentional')">
      <UTextarea v-model="note" :rows="4" spellcheck="false" />
    </UFormField>
  </div>

  <div v-else-if="props.name === 'selection-pattern'" class="grid gap-4 md:grid-cols-2">
    <UFormField :label="t('forms.known_status')" :help="t('forms.short_stable_option_sets_stay_predictable')">
      <USelect v-model="status" :items="statusItems" />
    </UFormField>
    <UFormField :label="t('forms.searchable_reviewer')" :help="t('forms.search_helps_when_the_list_grows')">
      <USelectMenu v-model="reviewer" :items="reviewerItems" value-key="value" />
    </UFormField>
    <UFormField :label="t('forms.exact_package')" :help="t('forms.suggestions_complete_exact_technical_values')">
      <UInputMenu v-model="packageName" :items="packageItems" />
    </UFormField>
    <UFormField :label="t('forms.visible_section')" :help="t('forms.keep_visible_choices_open_when_scanning_matters')">
      <UListbox v-model="selectedSection" :items="listboxItems" value-key="value" />
    </UFormField>
  </div>

  <div v-else-if="props.name === 'choice-pattern'" class="grid gap-5 md:grid-cols-2">
    <div class="space-y-3">
      <UCheckbox v-model="includeNotes" :label="t('forms.attach_implementation_notes')" />
      <USwitch v-model="enabled" :label="t('forms.apply_brand_layer')" />
    </div>
    <div class="grid gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
      <UCheckboxGroup v-model="checks" :items="checkItems" />
      <URadioGroup v-model="rhythm" :items="rhythmItems" />
    </div>
  </div>

  <div v-else-if="props.name === 'bounded-pattern'" class="grid gap-5 md:grid-cols-2">
    <UFormField :label="t('forms.pattern_count')" :help="t('forms.use_steppers_for_bounded_numeric_choices')">
      <UInputNumber v-model="budget" :min="1" :max="12" class="max-w-xs" />
    </UFormField>
    <UFormField :label="t('forms.review_window')" :help="t('forms.group_date_and_time_when_they_describe_one_decision')">
      <div class="grid gap-2 sm:grid-cols-2">
        <UInputDate icon="i-lucide-calendar" class="w-full" />
        <UInputTime class="w-full" />
      </div>
    </UFormField>
    <UFormField :label="t('forms.intensity')" :help="t('forms.sliders_are_useful_only_for_approximate_values')">
      <USlider v-model="progress" />
    </UFormField>
    <UFormField :label="t('forms.access_code')" :help="t('forms.pin_inputs_are_for_short_fixed_length_codes')">
      <UPinInput v-model="pin" />
    </UFormField>
  </div>

  <div v-else-if="props.name === 'advanced-inputs-pattern'" class="grid gap-5 md:grid-cols-2">
    <UFormField :label="t('forms.labels')" :help="t('forms.tags_should_help_scanning_not_decorate_the_form')">
      <UInputTags v-model="tags" />
    </UFormField>
    <UFormField :label="t('forms.asset_upload')" :help="t('forms.uploads_belong_where_files_are_part_of_the_task')">
      <UFileUpload :label="t('forms.drop_a_brand_asset')" :description="t('forms.svg_png_or_pdf')" icon="i-lucide-upload" />
    </UFormField>
    <UFormField :label="t('forms.accent')" :help="t('forms.color_pickers_belong_in_tooling_contexts')">
      <UColorPicker v-model="accent" />
    </UFormField>
    <UFormField :label="t('forms.publishing_date')" :help="t('forms.calendars_are_for_date_selection_not_generic_decoration')">
      <UCalendar />
    </UFormField>
  </div>

  <UForm v-else-if="props.name === 'form'" :state="{ projectName, status }" class="grid gap-4 sm:grid-cols-2">
    <UFormField :label="t('forms.projectName')" :help="t('forms.plain_labels_and_visible_borders_keep_forms_easy_to_scan')">
      <UInput v-model="projectName" />
    </UFormField>
    <UFormField :label="t('forms.reviewStatus')" :help="t('forms.use_semantic_labels_before_color')">
      <USelect v-model="status" :items="statusItems" />
    </UFormField>
    <div class="sm:col-span-2">
      <UButton :label="t('forms.save_settings')" />
    </div>
  </UForm>

  <UFormField v-else-if="props.name === 'form-field'" :label="t('forms.projectName')" :help="t('forms.help_text_stays_close_to_the_control_it_explains')">
    <UInput v-model="projectName" />
  </UFormField>

  <UInput v-else-if="props.name === 'input'" v-model="projectName" class="max-w-md" />
  <UTextarea v-else-if="props.name === 'textarea'" v-model="note" :rows="3" spellcheck="false" />
  <USelect v-else-if="props.name === 'select'" v-model="status" :aria-label="t('forms.reviewStatus')" :placeholder="t('forms.selectPlaceholder')" :items="statusItems" class="max-w-sm" />
  <USelectMenu v-else-if="props.name === 'select-menu'" v-model="reviewer" :aria-label="t('forms.reviewer')" :items="reviewerItems" value-key="value" class="max-w-sm" />
  <UInputMenu v-else-if="props.name === 'input-menu'" v-model="packageName" :items="packageItems" class="max-w-md" />
  <UInputNumber v-else-if="props.name === 'input-number'" v-model="budget" :min="1" :max="12" class="max-w-xs" />
  <UInputTags v-else-if="props.name === 'input-tags'" v-model="tags" class="max-w-md" />
  <UInputDate v-else-if="props.name === 'input-date'" icon="i-lucide-calendar" class="w-full max-w-[16rem]" />
  <UInputTime v-else-if="props.name === 'input-time'" class="max-w-xs" />
  <UCheckbox v-else-if="props.name === 'checkbox'" v-model="includeNotes" :label="t('forms.attach_implementation_notes')" />
  <UCheckboxGroup v-else-if="props.name === 'checkbox-group'" v-model="checks" :items="checkItems" />
  <URadioGroup v-else-if="props.name === 'radio-group'" v-model="rhythm" :aria-label="t('forms.spacing')" :items="rhythmItems" />
  <USwitch v-else-if="props.name === 'switch'" v-model="enabled" :label="t('forms.apply_brand_layer')" />
  <USlider v-else-if="props.name === 'slider'" v-model="progress" />
  <UPinInput v-else-if="props.name === 'pin-input'" v-model="pin" />
  <UFileUpload v-else-if="props.name === 'file-upload'" :label="t('forms.drop_a_brand_asset')" :description="t('forms.svg_png_or_pdf')" icon="i-lucide-upload" />
  <UColorPicker v-else-if="props.name === 'color-picker'" v-model="accent" />
  <UCalendar v-else-if="props.name === 'calendar'" />
  <UListbox v-else-if="props.name === 'listbox'" v-model="selectedSection" :items="listboxItems" value-key="value" class="max-w-sm" />
</template>
