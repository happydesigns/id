<script setup lang="ts">
import GalleryInput from './gallery/GalleryInput.vue'
import GalleryActivity from './gallery/GalleryActivity.vue'
import GalleryVerification from './gallery/GalleryVerification.vue'
import GalleryMilestones from './gallery/GalleryMilestones.vue'
import GalleryCommand from './gallery/GalleryCommand.vue'
import GalleryBudget from './gallery/GalleryBudget.vue'
import GalleryProgress from './gallery/GalleryProgress.vue'
import GalleryActions from './gallery/GalleryActions.vue'
import GalleryCalendar from './gallery/GalleryCalendar.vue'
import GalleryInvite from './gallery/GalleryInvite.vue'
import GalleryFeedback from './gallery/GalleryFeedback.vue'
import GalleryTasks from './gallery/GalleryTasks.vue'
import GalleryNotifications from './gallery/GalleryNotifications.vue'
import GalleryAnalytics from './gallery/GalleryAnalytics.vue'
import GalleryGoal from './gallery/GalleryGoal.vue'
import GalleryEmpty from './gallery/GalleryEmpty.vue'
import GalleryNavigation from './gallery/GalleryNavigation.vue'
import GalleryAccount from './gallery/GalleryAccount.vue'
import GalleryAuth from './gallery/GalleryAuth.vue'
import GalleryPrompt from './gallery/GalleryPrompt.vue'
import GalleryStatus from './gallery/GalleryStatus.vue'
defineProps<{ state: string }>()
</script>

<template>
  <UPageColumns as="section" class="component-gallery" aria-label="Interactive component examples">
    <h1 class="sr-only">Component examples</h1>
    <GalleryInput :state="state" />
    <GalleryCommand />
    <GalleryCalendar />
    <GalleryNotifications />
    <GalleryActivity />
    <GalleryBudget />
    <GalleryInvite />
    <GalleryAnalytics />
    <GalleryVerification />
    <GalleryProgress />
    <GalleryFeedback />
    <GalleryGoal />
    <GalleryMilestones />
    <GalleryNavigation />
    <GalleryEmpty />
    <GalleryAccount />
    <GalleryAuth />
    <GalleryPrompt />
    <GalleryActions />
    <GalleryTasks />
    <GalleryStatus :state="state" />
  </UPageColumns>
</template>

<style scoped>
/* CSS columns keep short cards packed at every frame width without a second scroll container. */
.component-gallery { columns: 4; column-gap: 16px; padding: 20px; }
.component-gallery > * { break-inside: avoid; margin-bottom: 16px; }
.example-card { min-width: 0; }
.example-card :deep(label) { font-weight: 500; }
.example-card :deep([data-slot="label"]) { font-weight: 500; }
.component-gallery :deep(h2) { font-size: 15px; line-height: 1.5; font-weight: 600; color: var(--ui-text-highlighted); }
.component-gallery :deep(.card-description) { margin-top: 2px; font-size: 13px; line-height: 1.55; color: var(--ui-text-muted); }
.component-gallery :deep(.goal-ring) { background: conic-gradient(var(--ui-primary) 0 80%, var(--ui-bg-accented) 80% 100%); }
@media (max-width: 1199px) { .component-gallery { columns: 3; } }
@media (max-width: 899px) { .component-gallery { columns: 2; column-gap: 12px; padding: 14px; }.component-gallery > * { margin-bottom: 12px; } }
@media (max-width: 579px) { .component-gallery { columns: 1; padding: 12px; } }
</style>
