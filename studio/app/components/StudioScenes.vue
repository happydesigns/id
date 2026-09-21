<script setup lang="ts">
import { useStudioIcon } from '../../playground-icons'
import { computed, ref } from 'vue'
import type { StudioDocument, StudioScene } from '../../../src/studio'

const props = defineProps<{ document: StudioDocument, scene: StudioScene, state: string, mode: 'light' | 'dark' }>()

const open = ref(false)
const saved = ref(false)
const projectName = ref('')
const logo = computed(() => {
  const logos = props.document.brand.assets?.logos
  return (props.mode === 'dark' ? logos?.wordmarkInverse : undefined) ?? logos?.wordmark ?? logos?.logo
})

const resolveIcon = useStudioIcon()
</script>

<template>
  <div :class="scene === 'components' ? '' : 'mx-auto max-w-6xl p-5 sm:p-8'">
    <header
      v-if="scene !== 'components'"
      class="mb-8 flex items-center justify-between gap-4 border-b border-default pb-5"
    >
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

    <LazyIdStudioComponents
      v-if="scene === 'components'"
      :state="state"
    />
    <template v-else-if="scene === 'landing'">
      <UPageHero
        title="Your projects, in one place"
        :description="document.brand.claim || 'Organize tasks, share files and track deadlines with your team.'"
        :ui="{ container: 'py-10 sm:py-16 lg:py-20' }"
      >
        <template #links>
          <UButton
            size="lg"
            @click="open = true"
          >
            Create a project
          </UButton>
          <UButton
            size="lg"
            color="neutral"
            variant="outline"
            to="#features"
          >
            View features
          </UButton>
        </template>
      </UPageHero>
      <UPageSection
        id="features"
        title="Project tools"
        :ui="{ container: 'py-10 sm:py-12 lg:py-12', title: 'text-2xl sm:text-3xl lg:text-3xl' }"
      >
        <UPageGrid>
          <UPageCard
            v-for="item in [{ title: 'Tasks', description: 'Assign owners and due dates. Filter by status to find unfinished work.', icon: resolveIcon('i-lucide-list-checks') }, { title: 'Files', description: 'Keep briefs, designs and exports alongside the project.', icon: resolveIcon('i-lucide-folder') }, { title: 'Activity', description: 'Review recent updates and decisions from your team.', icon: resolveIcon('i-lucide-history') }]"
            :key="item.title"
            :title="item.title"
            :description="item.description"
            :icon="item.icon"
          />
        </UPageGrid>
      </UPageSection>
      <UModal
        v-model:open="open"
        title="Create a project"
        description="Choose a name for your project."
      >
        <template #body>
          <UFormField label="Project name">
            <UInput
              v-model="projectName"
              placeholder="Website redesign"
              class="w-full"
            />
          </UFormField>
        </template>
        <template #footer>
          <UButton
            :disabled="!projectName.trim()"
            @click="saved = true; open = false"
          >
            Create project
          </UButton><UButton
            color="neutral"
            variant="outline"
            @click="open = false"
          >
            Cancel
          </UButton>
        </template>
      </UModal>
      <UAlert
        v-if="saved"
        color="success"
        title="Project created"
        :description="projectName"
        class="mb-8"
      />
    </template>

    <footer
      v-if="scene !== 'components'"
      class="mt-10 flex flex-wrap justify-between gap-3 border-t border-default pt-5 text-xs text-muted"
    >
      <span>{{ document.theme.label }}</span>
    </footer>
  </div>
</template>
