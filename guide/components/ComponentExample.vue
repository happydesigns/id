<script setup lang="ts">
import { computed } from 'vue'
import {
  createComponentExampleContext,
  getComponentExampleDefinition,
  componentExampleOwnSurfaceNames,
  type ComponentExampleContextInput,
  type ComponentExampleFrame
} from '../../src/component-examples'
import ComponentExampleActions from './component-example/ComponentExampleActions.vue'
import ComponentExampleForms from './component-example/ComponentExampleForms.vue'
import ComponentExampleFeedback from './component-example/ComponentExampleFeedback.vue'
import ComponentExampleData from './component-example/ComponentExampleData.vue'
import ComponentExampleNavigation from './component-example/ComponentExampleNavigation.vue'
import ComponentExampleOverlays from './component-example/ComponentExampleOverlays.vue'
import ComponentExamplePage from './component-example/ComponentExamplePage.vue'
import ComponentExampleSystem from './component-example/ComponentExampleSystem.vue'
import ComponentExampleDashboard from './component-example/ComponentExampleDashboard.vue'
import ComponentExamplePublishing from './component-example/ComponentExamplePublishing.vue'
import ComponentExampleChatEditor from './component-example/ComponentExampleChatEditor.vue'

const props = withDefaults(defineProps<{
  name: string
  frame?: ComponentExampleFrame
  context?: ComponentExampleContextInput
}>(), {
  frame: 'default',
  context: undefined
})

const ownSurfaceNames = new Set(componentExampleOwnSurfaceNames)

const example = computed(() => getComponentExampleDefinition(props.name))
const context = computed(() => createComponentExampleContext(props.context))

const exampleClass = computed(() => [
  props.frame === 'none' ? 'contents' : 'not-prose isolate my-5',
  props.frame === 'none' || ownSurfaceNames.has(props.name)
    ? 'overflow-visible'
    : 'overflow-hidden rounded-sm border border-default bg-default p-4 sm:p-6'
])
</script>

<template>
  <div :class="exampleClass">
    <slot
      :name="props.name"
      :context="context"
      :example="example"
    >
      <ComponentExampleActions
        v-if="example?.family === 'actions'"
        :name="props.name"
        :context="context"
      />

      <ComponentExampleForms
        v-else-if="example?.family === 'forms'"
        :name="props.name"
        :context="context"
      />

      <ComponentExampleFeedback
        v-else-if="example?.family === 'feedback'"
        :name="props.name"
      />

      <ComponentExampleData
        v-else-if="example?.family === 'data'"
        :name="props.name"
        :context="context"
      />

      <ComponentExampleNavigation
        v-else-if="example?.family === 'navigation'"
        :name="props.name"
        :context="context"
      />

      <ComponentExampleOverlays
        v-else-if="example?.family === 'overlays'"
        :context="context"
        :name="props.name"
      />

      <ComponentExamplePage
        v-else-if="example?.family === 'page'"
        :name="props.name"
        :context="context"
      />

      <ComponentExampleSystem
        v-else-if="example?.family === 'system'"
        :name="props.name"
        :context="context"
      />

      <ComponentExampleDashboard
        v-else-if="example?.family === 'dashboard'"
        :name="props.name"
        :context="context"
      />

      <ComponentExamplePublishing
        v-else-if="example?.family === 'publishing'"
        :name="props.name"
        :context="context"
      />

      <ComponentExampleChatEditor
        v-else-if="example?.family === 'chat' || example?.family === 'editor'"
        :name="props.name"
        :context="context"
      />

      <UAlert
        v-else
        color="warning"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        title="Unknown component example"
        :description="`No default example is registered for ${props.name}.`"
      />
    </slot>
  </div>
</template>
