<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ state: string }>()
const email = ref('')
const notifications = ref(true)
const security = ref(true)
const marketing = ref(false)
const saved = ref(false)
const planSaved = ref(false)
const preferencesSaved = ref(false)
const open = ref(false)
const invited = ref(false)
const subscribed = ref(false)
const amount = ref(1200)
const search = ref('')
const selected = ref('Alex Morgan')
const task = ref(false)
const attached = ref(false)
const submitted = ref(false)
const message = ref('')
const pin = ref(['4', '3', '2', '', '', ''])
const users = ['Alex Morgan', 'Sam Taylor', 'Jamie Chen']
const card = { body: 'p-4 sm:p-5' }
</script>

<template>
  <section class="component-gallery" aria-label="Interactive component examples">
    <h1 class="sr-only">One brand. Every detail.</h1>
    <div class="gallery-column">
      <UCard :ui="card" class="example-card">
        <UFormField label="Email address" required :error="state === 'error' ? 'Enter a valid email address.' : undefined" help="We’ll only send you the essentials.">
          <UInput v-model="email" icon="i-lucide-mail" placeholder="you@example.com" class="w-full" />
        </UFormField>
        <UFormField label="Search" class="mt-5">
          <UInput v-model="search" icon="i-lucide-search" placeholder="Find a teammate…" class="w-full" />
        </UFormField>
      </UCard>
      <UCard :ui="card" class="example-card">
        <h2>Recent activity</h2><p class="card-description">The little steps that move work forward.</p>
        <div class="mt-5 divide-y divide-default">
          <div v-for="(item, index) in [{ name: 'Brand library', detail: 'Published a new version', icon: 'i-lucide-library', time: '2m' }, { name: 'Website refresh', detail: 'Ready for your review', icon: 'i-lucide-panels-top-left', time: '18m' }, { name: 'Product launch', detail: 'Added three new assets', icon: 'i-lucide-sparkles', time: '1h' }, { name: 'Team workspace', detail: 'Jamie joined the team', icon: 'i-lucide-users', time: '2h' }]" :key="item.name" class="flex items-center gap-3 py-3" :class="{ 'pt-0': index === 0 }">
            <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-elevated"><UIcon :name="item.icon" class="size-4 text-muted" /></span>
            <div class="min-w-0 flex-1"><p class="text-sm font-medium text-highlighted">{{ item.name }}</p><p class="text-xs text-muted">{{ item.detail }}</p></div><span class="text-xs text-muted">{{ item.time }}</span>
          </div>
        </div>
      </UCard>
      <UCard :ui="card" class="example-card text-center">
        <UIcon name="i-lucide-shield-check" class="mx-auto mb-3 size-7 text-highlighted" />
        <h2>One more step</h2><p class="card-description">Enter the code sent to your email.</p>
        <UPinInput v-model="pin" :length="6" aria-label="Verification code" class="mt-5 justify-center" :ui="{ base: 'w-8' }" />
        <p class="mt-4 text-xs text-muted">Need a new code? <UButton size="xs" variant="link" @click="pin = ['', '', '', '', '', '']">Try again</UButton></p>
      </UCard>
      <UCard :ui="card" class="example-card">
        <h2>Your milestones</h2><p class="card-description">Good things take shape, step by step.</p>
        <div v-for="goal in [{ name: 'Design system', value: 80, count: '24 / 30' }, { name: 'Website launch', value: 45, count: '9 / 20' }]" :key="goal.name" class="mt-5">
          <div class="mb-2 flex justify-between text-xs text-muted"><span>{{ goal.name }}</span><span>{{ goal.value }}%</span></div><p class="mb-3 text-2xl font-semibold text-highlighted">{{ goal.count }}<span class="ml-2 text-xs font-normal text-muted">tasks</span></p><UProgress :model-value="goal.value" :aria-label="goal.name" size="sm" />
        </div>
      </UCard>
    </div>

    <div class="gallery-column">
      <UCard :ui="card" class="example-card">
        <h2>Your workspace</h2><p class="card-description">People and actions, one search away.</p>
        <div class="mt-4 space-y-1">
          <button v-for="user in users.filter(user => user.toLowerCase().includes(search.toLowerCase()))" :key="user" class="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-elevated" :class="{ 'bg-elevated': selected === user }" @click="selected = user">
            <UAvatar :alt="user" size="sm" /><span class="flex-1 text-sm text-highlighted">{{ user }}</span><UIcon v-if="selected === user" name="i-lucide-check" class="size-4 text-primary" />
          </button>
          <p v-if="!users.some(user => user.toLowerCase().includes(search.toLowerCase()))" class="py-4 text-sm text-muted">No teammates found.</p>
        </div>
        <USeparator class="my-4" />
        <UButton color="neutral" variant="ghost" icon="i-lucide-file-plus-2" block class="justify-start" @click="open = true">Create a project</UButton>
        <UButton color="neutral" variant="ghost" icon="i-lucide-user-plus" block class="justify-start" @click="invited = !invited">{{ invited ? 'Invite ready to share' : 'Invite someone' }}</UButton>
      </UCard>
      <UCard :ui="card" class="example-card">
        <h2>Plan your next move</h2><p class="card-description">A little clarity goes a long way.</p>
        <div class="mt-5 space-y-4">
          <UFormField label="Project budget"><UInputNumber v-model="amount" :min="0" :step="100" :format-options="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }" class="w-full" /></UFormField>
          <UFormField label="Workspace"><USelect :items="['Design team', 'Marketing', 'Product']" default-value="Design team" class="w-full" /></UFormField>
          <UFormField label="Priority"><USelect :items="['Normal', 'High', 'Low']" default-value="Normal" class="w-full" /></UFormField>
          <div class="flex justify-between text-sm"><span class="text-muted">Next check-in</span><span class="text-highlighted">Tomorrow</span></div>
          <UButton block @click="planSaved = !planSaved">{{ planSaved ? 'Plan saved' : 'Save plan' }}</UButton>
        </div>
      </UCard>
      <UCard :ui="card" class="example-card">
        <div class="flex items-start justify-between gap-3"><div><p class="text-sm text-muted">Team momentum</p><p class="mt-1 text-3xl font-semibold text-highlighted">92<span class="text-lg text-muted">%</span></p></div><UBadge color="success" variant="subtle" size="sm">+12%</UBadge></div>
        <div class="my-4 flex justify-between text-xs text-muted"><span>This week’s goal</span><span>Almost there</span></div><UProgress :model-value="92" aria-label="Team momentum" />
        <USeparator class="my-4" /><div class="flex items-center justify-between"><UAvatarGroup><UAvatar v-for="user in users" :key="user" :alt="user" size="sm" /></UAvatarGroup><span class="text-xs text-muted">Together, it adds up.</span></div>
      </UCard>
      <UCard :ui="card" class="example-card">
        <h2>A clear next step</h2><p class="card-description">Every action has its place.</p>
        <div class="mt-4 flex flex-wrap gap-2"><UButton @click="saved = !saved">{{ saved ? 'Changes saved' : 'Save changes' }}</UButton><UButton color="neutral" variant="outline" @click="open = true">Preview dialog</UButton><UButton disabled>Unavailable</UButton></div>
        <div class="mt-4 flex flex-wrap gap-2"><UBadge>New</UBadge><UBadge color="success" variant="subtle">Approved</UBadge><UBadge color="warning" variant="subtle">In review</UBadge></div>
      </UCard>
    </div>

    <div class="gallery-column">
      <UCard :ui="{ body: 'p-3 sm:p-4' }" class="example-card">
        <h2 class="sr-only">Choose a date</h2><UCalendar aria-label="Choose a date" class="w-full" />
      </UCard>
      <UCard :ui="card" class="example-card">
        <h2>Invite your team</h2><p class="card-description">Make room for another perspective.</p>
        <div class="mt-5 space-y-3">
          <div v-for="(user, index) in ['alex@example.com', 'sam@example.com']" :key="user" class="flex gap-2"><UInput :default-value="user" :aria-label="'Teammate ' + (index + 1)" class="min-w-0 flex-1" /><USelect :items="['Editor', 'Viewer']" :default-value="index ? 'Viewer' : 'Editor'" :aria-label="'Role for teammate ' + (index + 1)" class="w-24" /></div>
        </div><USeparator label="Your shared workspace" class="my-5" /><div class="flex items-center gap-3"><UAvatar alt="Design team" icon="i-lucide-users" /><p class="flex-1 text-sm text-muted">Better work, together.</p><UButton @click="invited = !invited">{{ invited ? 'Invited' : 'Send invites' }}</UButton></div>
      </UCard>
      <UCard :ui="card" class="example-card">
        <h2>Share feedback</h2><p class="card-description">Help make the next version better.</p>
        <form class="mt-5 space-y-4" @submit.prevent="submitted = true">
          <UFormField label="Title"><UInput placeholder="What could be better?" class="w-full" required /></UFormField>
          <div class="grid grid-cols-2 gap-3"><UFormField label="Category"><USelect :items="['Design', 'Content', 'Interaction']" default-value="Design" class="w-full" /></UFormField><UFormField label="Priority"><USelect :items="['Normal', 'High', 'Low']" default-value="Normal" class="w-full" /></UFormField></div>
          <UFormField label="A little more detail"><UTextarea v-model="message" placeholder="Tell us what you have in mind…" :rows="3" class="w-full" /></UFormField>
          <div class="flex items-center justify-between gap-2"><UButton icon="i-lucide-paperclip" color="neutral" variant="ghost" size="sm" @click="attached = !attached">{{ attached ? 'Example attached' : 'Add example' }}</UButton><UButton type="submit">Send feedback</UButton></div>
          <p v-if="submitted" role="status" class="text-sm text-success">Thanks. Your example feedback is ready.</p>
        </form>
      </UCard>
      <UCard :ui="card" class="example-card"><h2>Today’s focus</h2><p class="card-description">Keep the next step small.</p><UCheckbox v-model="task" label="Review the new brand direction" class="mt-5" /><UCheckbox label="Share the first draft with the team" class="mt-4" /><UCheckbox label="Make time for a fresh perspective" class="mt-4" /></UCard>
    </div>

    <div class="gallery-column">
      <UCard :ui="card" class="example-card">
        <h2>Stay in the loop</h2><p class="card-description">A quieter inbox, on your terms.</p>
        <div class="my-5 space-y-5"><USwitch v-model="notifications" label="Project updates" description="Reviews, milestones and next steps." /><USwitch v-model="security" label="Security alerts" description="Account activity worth knowing about." /><USwitch v-model="marketing" label="News and inspiration" description="Fresh ideas, every now and then." /></div>
        <UButton color="neutral" @click="preferencesSaved = !preferencesSaved">{{ preferencesSaved ? 'Preferences saved' : 'Save preferences' }}</UButton>
      </UCard>
      <UCard :ui="card" class="example-card">
        <div class="flex items-start justify-between"><div><p class="text-sm text-muted">Visitors</p><p class="mt-1 text-3xl font-semibold text-highlighted">24,680</p></div><UBadge color="success" variant="subtle" size="sm">+18%</UBadge></div>
        <div class="mt-6 flex h-24 items-end gap-2" role="img" aria-label="Weekly visits rise from Monday to a Saturday peak">
          <div v-for="(height, index) in [38, 58, 47, 78, 62, 100, 84]" :key="index" class="flex h-full min-w-0 flex-1 flex-col justify-end gap-2"><div class="rounded-t-md bg-primary" :style="{ height: height + '%' }" /><span class="text-center text-[10px] text-muted">{{ ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index] }}</span></div>
        </div>
      </UCard>
      <UCard :ui="card" class="example-card">
        <h2>Room to grow</h2><p class="card-description">Your next milestone is getting closer.</p>
        <div class="goal-ring mx-auto my-6 flex size-32 items-center justify-center rounded-full" role="img" aria-label="80 percent of the quarterly goal achieved"><div class="flex size-26 flex-col items-center justify-center rounded-full bg-default"><span class="text-2xl font-semibold text-highlighted">80%</span><span class="text-xs text-muted">of the way there</span></div></div>
        <div class="flex justify-between text-xs"><span class="text-muted">Next milestone</span><span class="text-highlighted">End of quarter</span></div>
      </UCard>
      <UCard :ui="card" class="example-card text-center"><UIcon name="i-lucide-sparkles" class="mx-auto mb-3 size-7 text-primary" /><h2>Something good is next.</h2><p class="card-description">A monthly note on design and better work.</p><UButton class="mt-5" color="neutral" @click="subscribed = !subscribed">{{ subscribed ? 'You’re on the list' : 'Count me in' }}</UButton></UCard>
      <UAlert :color="state === 'error' ? 'error' : 'success'" variant="subtle" :title="state === 'error' ? 'Changes need attention' : 'Everything is up to date'" description="Your latest work is ready to share." />
    </div>
    <UModal v-model:open="open" title="Review your changes" description="This dialog uses the same brand as the page."><template #body><p class="text-sm text-muted">Check the action hierarchy, focus ring and overlay surface.</p></template><template #footer><UButton @click="open = false">Done</UButton><UButton color="neutral" variant="outline" @click="open = false">Cancel</UButton></template></UModal>
  </section>
</template>

<style scoped>
/* CSS columns keep short cards packed at every frame width without a second scroll container. */
.component-gallery { columns: 4; column-gap: 16px; padding: 20px 20px 4px; }
.gallery-column { display: contents; }
.gallery-column > * { break-inside: avoid; margin-bottom: 16px; }
.example-card { min-width: 0; }
h2 { font-size: 14px; line-height: 1.5; font-weight: 600; color: var(--ui-text-highlighted); }
.card-description { margin-top: 2px; font-size: 13px; line-height: 1.55; color: var(--ui-text-muted); }
.goal-ring { background: conic-gradient(var(--ui-primary) 0 80%, var(--ui-bg-accented) 80% 100%); }
@media (max-width: 1199px) { .component-gallery { columns: 3; } }
@media (max-width: 899px) { .component-gallery { columns: 2; column-gap: 12px; padding: 14px 14px 2px; }.gallery-column > * { margin-bottom: 12px; } }
@media (max-width: 579px) { .component-gallery { columns: 1; padding: 12px 12px 0; } }
</style>