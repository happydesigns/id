<script setup lang="ts">
import { galleryCard as card } from '../../gallery'
import { ref } from 'vue'
const invited = ref(false)
</script>

<template>
<UCard :ui="card" class="example-card">
        <h2>Invite your team</h2>
        <div class="mt-5 space-y-3">
          <div v-for="(user, index) in ['alex@example.com', 'sam@example.com']" :key="user" class="flex gap-2"><UInput :default-value="user" :aria-label="'Teammate ' + (index + 1)" class="min-w-0 flex-1" /><USelect :items="['Editor', 'Viewer']" :default-value="index ? 'Viewer' : 'Editor'" :aria-label="'Role for teammate ' + (index + 1)" class="w-24" /></div>
        </div><USeparator label="Design team" class="my-5" /><div class="flex items-center gap-3"><UAvatar alt="Design team" icon="i-lucide-users" /><p class="flex-1 text-sm text-muted">2 pending invitations</p><UButton @click="invited = !invited">{{ invited ? 'Invited' : 'Send invites' }}</UButton></div>
      </UCard>
</template>
