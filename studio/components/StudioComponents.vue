<script setup lang="ts">
import PlaygroundInput from './playground/PlaygroundInput.vue'
import PlaygroundCommandPalette from './playground/PlaygroundCommandPalette.vue'
import PlaygroundCalendar from './playground/PlaygroundCalendar.vue'
import PlaygroundNotifications from './playground/PlaygroundNotifications.vue'
import PlaygroundTransactions from './playground/PlaygroundTransactions.vue'
import PlaygroundTransferFunds from './playground/PlaygroundTransferFunds.vue'
import PlaygroundInviteTeam from './playground/PlaygroundInviteTeam.vue'
import PlaygroundAnalytics from './playground/PlaygroundAnalytics.vue'
import PlaygroundPinInput from './playground/PlaygroundPinInput.vue'
import PlaygroundDashboard from './playground/PlaygroundDashboard.vue'
import PlaygroundReportBug from './playground/PlaygroundReportBug.vue'
import PlaygroundGoal from './playground/PlaygroundGoal.vue'
import PlaygroundSavingsTargets from './playground/PlaygroundSavingsTargets.vue'
import PlaygroundShortcuts from './playground/PlaygroundShortcuts.vue'
import PlaygroundNavigation from './playground/PlaygroundNavigation.vue'
import PlaygroundEmpty from './playground/PlaygroundEmpty.vue'
import PlaygroundAnnouncement from './playground/PlaygroundAnnouncement.vue'
import PlaygroundTabs from './playground/PlaygroundTabs.vue'
import PlaygroundContributors from './playground/PlaygroundContributors.vue'
import PlaygroundAuthForm from './playground/PlaygroundAuthForm.vue'
import PlaygroundPrompt from './playground/PlaygroundPrompt.vue'
import PlaygroundCard from './playground/PlaygroundCard.vue'
import { computed, onMounted, onBeforeUnmount, ref, useTemplateRef } from 'vue'
defineProps<{ state: string }>()

// Adapted from Nuxt UI. See playground/NOTICE.md for source and changes.
const tiles = [
  { name: 'input', component: PlaygroundInput },
  { name: 'command-palette', component: PlaygroundCommandPalette },
  { name: 'calendar', component: PlaygroundCalendar },
  { name: 'notifications', component: PlaygroundNotifications },
  { name: 'transactions', component: PlaygroundTransactions },
  { name: 'transfer-funds', component: PlaygroundTransferFunds },
  { name: 'invite-team', component: PlaygroundInviteTeam },
  { name: 'analytics', component: PlaygroundAnalytics },
  { name: 'pin-input', component: PlaygroundPinInput },
  { name: 'dashboard', component: PlaygroundDashboard },
  { name: 'report-bug', component: PlaygroundReportBug },
  { name: 'goal', component: PlaygroundGoal },
  { name: 'savings-targets', component: PlaygroundSavingsTargets },
  { name: 'shortcuts', component: PlaygroundShortcuts },
  { name: 'navigation', component: PlaygroundNavigation },
  { name: 'empty', component: PlaygroundEmpty },
  { name: 'announcement', component: PlaygroundAnnouncement },
  { name: 'tabs', component: PlaygroundTabs },
  { name: 'contributors', component: PlaygroundContributors },
  { name: 'auth-form', component: PlaygroundAuthForm },
  { name: 'prompt', component: PlaygroundPrompt }
]

// Measure the actual preview container, including its padding.
const scrollArea = useTemplateRef('scrollArea')
const width = ref(0)
let observer: ResizeObserver | undefined
onMounted(() => {
  const element = scrollArea.value?.$el as HTMLElement | undefined
  if (!element) return
  width.value = element.getBoundingClientRect().width
  observer = new ResizeObserver(() => { width.value = element.getBoundingClientRect().width })
  observer.observe(element, { box: 'border-box' })
})
onBeforeUnmount(() => observer?.disconnect())
const lanes = computed(() => width.value >= 1200 ? 4 : width.value >= 900 ? 3 : width.value >= 600 ? 2 : 1)

// The gutters follow the container too, so the vertical padding matches the
// horizontal one and the tiles sit in an even frame at every width.
const compact = computed(() => width.value > 0 && width.value < 600)
const padding = computed(() => (compact.value ? 16 : 24))

// Keep every example available at every width in the brand editor.
const visibleTiles = tiles
</script>

<template>
  <UScrollArea
    ref="scrollArea"
    aria-label="Interactive component examples"
    :items="visibleTiles"
    :virtualize="{
      lanes,
      gap: 16,
      estimateSize: 360,
      paddingStart: padding,
      paddingEnd: padding,
      overscan: 0,
      getItemKey: (index: number) => visibleTiles[index]!.name
    }"
    :class="['component-gallery h-dvh', compact ? 'px-4' : 'px-6']"
  >
    <template #default="{ item }">
      <PlaygroundCard :data-example="item.name">
        <component :is="item.component" :state="state" />
      </PlaygroundCard>
    </template>
  </UScrollArea>
</template>
