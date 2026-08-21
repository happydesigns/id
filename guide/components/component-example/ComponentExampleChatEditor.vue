<script setup lang="ts">
import { computed, ref } from 'vue'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
import type { ComponentExampleContext } from '../../../src/component-examples'
import ComponentExampleEditorPreview from './ComponentExampleEditorPreview.vue'

const props = defineProps<{
  name: string
  context: ComponentExampleContext
}>()

const chatInput = ref('Review the component hierarchy.')
const editorContent = ref({
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Component note' }]
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Use visible structure before adding brand expression.' }]
    }
  ]
})

const chatMessages = [
  {
    id: 'user-1',
    role: 'user' as const,
    parts: [{ type: 'text' as const, text: 'Can this interface stay useful before it feels branded?' }]
  },
  {
    id: 'assistant-1',
    role: 'assistant' as const,
    parts: [{ type: 'text' as const, text: 'Yes. Start with clear structure, then add recognition through restrained details.' }]
  }
]

const assistantChatMessage = computed(() => chatMessages[1])

const editorMentions = [
  { label: 'Brand owner', avatar: { text: 'BO' } },
  { label: 'Design review', avatar: { icon: 'i-lucide-palette' } }
]
</script>

<template>
  <UChatPalette
    v-if="props.name === 'chat-palette'"
    class="overflow-hidden rounded-sm border border-default bg-default"
    :ui="{ content: 'p-3 sm:p-4', prompt: 'border-t border-default bg-muted p-3' }"
  >
    <UChatMessages
      :messages="chatMessages"
      status="ready"
      compact
      class="min-h-40 max-h-64 rounded-sm bg-muted px-2 py-2"
    >
      <template #content="{ message }">
        <p class="text-sm text-default">
          {{ getTextFromMessage(message) }}
        </p>
      </template>
      <template #indicator>
        <UChatShimmer text="Checking component behavior" />
      </template>
    </UChatMessages>
    <template #prompt>
      <UChatPrompt
        v-model="chatInput"
        placeholder="Ask about component behavior"
        class="bg-default"
        :ui="{ root: 'rounded-sm', footer: 'justify-end pt-1' }"
      >
        <template #footer>
          <UChatPromptSubmit status="ready" />
        </template>
      </UChatPrompt>
    </template>
  </UChatPalette>

  <UChatMessages
    v-else-if="props.name === 'chat-messages'"
    :messages="chatMessages"
    status="ready"
    compact
    class="min-h-40 rounded-sm bg-muted px-2 py-2"
  >
    <template #content="{ message }">
      <p class="text-sm text-default">
        {{ getTextFromMessage(message) }}
      </p>
    </template>
  </UChatMessages>

  <UChatMessage
    v-else-if="props.name === 'chat-message' && assistantChatMessage"
    v-bind="assistantChatMessage"
  />

  <UChatPrompt
    v-else-if="props.name === 'chat-prompt'"
    v-model="chatInput"
    placeholder="Ask about component behavior"
  />

  <UChatPromptSubmit
    v-else-if="props.name === 'chat-prompt-submit'"
    status="ready"
  />

  <UChatReasoning
    v-else-if="props.name === 'chat-reasoning'"
    text="Check structure, then color usage, then interaction copy."
  />

  <UChatShimmer
    v-else-if="props.name === 'chat-shimmer'"
    text="Checking component behavior"
  />

  <UChatTool
    v-else-if="props.name === 'chat-tool'"
    text="Checked contrast"
    icon="i-lucide-contrast"
  />

  <div v-else-if="props.name === 'chat-activity-pattern'" class="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
    <div class="space-y-3">
      <p class="font-semibold text-highlighted">
        Reasoning stays secondary
      </p>
      <UChatReasoning text="Check hierarchy first, then color behavior, then recovery copy." />
    </div>
    <div class="space-y-3 rounded-sm border border-default bg-muted p-4">
      <p class="font-semibold text-highlighted">
        System activity
      </p>
      <UChatTool
        text="Checked contrast"
        icon="i-lucide-contrast"
      />
      <div class="rounded-sm bg-default p-3">
        <UChatShimmer text="Checking component behavior" />
      </div>
    </div>
  </div>

  <ClientOnly v-else-if="props.name === 'editor'">
    <UEditor
      v-slot="{ editor }"
      v-model="editorContent"
      class="min-h-64 rounded-sm border border-default bg-default p-4"
    >
      <UEditorToolbar :editor="editor" />
      <UEditorSuggestionMenu :editor="editor" />
      <UEditorMentionMenu
        :editor="editor"
        :items="editorMentions"
      />
      <UEditorEmojiMenu :editor="editor" />
      <UEditorDragHandle :editor="editor" />
    </UEditor>
    <template #fallback>
      <ComponentExampleEditorPreview />
    </template>
  </ClientOnly>

  <ClientOnly
    v-else-if="['editor-toolbar', 'editor-drag-handle', 'editor-emoji-menu', 'editor-mention-menu', 'editor-suggestion-menu'].includes(props.name)"
  >
    <UEditor
      v-slot="{ editor }"
      v-model="editorContent"
      class="min-h-64 rounded-sm border border-default bg-default p-4"
    >
      <UEditorToolbar
        v-if="props.name === 'editor-toolbar'"
        :editor="editor"
      />
      <UEditorSuggestionMenu
        v-if="props.name === 'editor-suggestion-menu'"
        :editor="editor"
      />
      <UEditorMentionMenu
        v-if="props.name === 'editor-mention-menu'"
        :editor="editor"
        :items="editorMentions"
      />
      <UEditorEmojiMenu
        v-if="props.name === 'editor-emoji-menu'"
        :editor="editor"
      />
      <UEditorDragHandle
        v-if="props.name === 'editor-drag-handle'"
        :editor="editor"
      />
    </UEditor>
    <template #fallback>
      <ComponentExampleEditorPreview />
    </template>
  </ClientOnly>
</template>
