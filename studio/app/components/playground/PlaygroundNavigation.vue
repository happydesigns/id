<script setup lang="ts">
import { useStudioIcons } from '../../../playground-icons'
import type { NavigationMenuItem } from '@nuxt/ui'

const studioIcons = useStudioIcons()

const appConfig = useAppConfig()

const items: NavigationMenuItem[][] = [
  [
    { label: 'Dashboard', get icon() {
      return studioIcons.dashboard
    }, active: true },
    { label: 'Inbox', get icon() {
      return studioIcons.inbox
    }, badge: '4' },
    { label: 'Projects', icon: appConfig.ui.icons.folder },
    { label: 'Calendar', get icon() {
      return studioIcons.calendar
    } },
  ],
  [
    { label: 'Settings', get icon() {
      return studioIcons.settings
    } },
    { label: 'Help', icon: appConfig.ui.icons.info },
  ],
]
</script>

<template>
  <div class="p-2">
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      class="w-full"
    />
  </div>
</template>
